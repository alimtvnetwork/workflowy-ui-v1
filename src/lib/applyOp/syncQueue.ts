// Sync simulator — wraps applyOp with configurable latency, a durable queue, and
// a conflict-resolver hook. Models spec/31-app/01-features/14-concurrency-and-sync.md
// + spec/31-app/01-features/14b-offline-queue.md (queue persists across reload —
// invariant I-OQ-02).

import { applyOp, listItems } from "./index";
import { itemsStore, syncQueueStore } from "./db";
import type { Envelope, Item, Op, OpKind, UpdatePayload } from "./types";
import { nowIso, ulid } from "./util";

export type ResolutionStrategy = "lww" | "keep-local" | "keep-remote";

export interface QueuedOp {
  QueueId: string;
  /** Monotonic per-device sequence — strict FIFO replay order (spec 14b §14b.1). */
  LocalSeq: number;
  Kind: OpKind;
  Payload: unknown;
  EnqueuedAt: string;
  ScheduledFor: string;
  /** Snapshot of the item BEFORE the user made the local change (for items.update only). */
  BaseSnapshot: Item | null;
  /** Optimistic local result the user sees immediately. */
  OptimisticPatch: Partial<Item> | null;
  Status: "queued" | "in-flight" | "applied" | "conflict" | "failed";
  ConflictRemote: Item | null;
  ConflictLocal: Partial<Item> | null;
  Resolution: ResolutionStrategy | null;
  ResultEnvelope: Envelope<unknown> | null;
}

type Listener = (snapshot: QueuedOp[]) => void;
export interface LwwLossEvent {
  QueueId: string;
  ItemId: string;
  Reason: "keep-remote" | "lww-local-lost";
  At: string;
  /** ISO timestamp of the remote write that won (for diagnostics). */
  RemoteUpdatedAt?: string;
  /** ISO timestamp of the local edit that lost (EnqueuedAt). */
  LocalEnqueuedAt?: string;
}
type LossListener = (ev: LwwLossEvent) => void;

const SEQ_KEY = "spec-applyop-localseq";

class SyncQueue {
  private queue: QueuedOp[] = [];
  private listeners = new Set<Listener>();
  private lossListeners = new Set<LossListener>();
  private hydrated = false;
  private hydratePromise: Promise<void> | null = null;
  private nextSeq = 1;
  latencyMs = 1500;
  /** When true, the next queued items.update on the same Id will inject a remote conflict. */
  injectConflictForNext = false;

  /** Load persisted queue + LocalSeq from IndexedDB. Called on first subscribe/list. */
  private async hydrate(): Promise<void> {
    if (this.hydrated) return;
    if (this.hydratePromise) return this.hydratePromise;
    this.hydratePromise = (async () => {
      const persisted = await syncQueueStore.getAll();
      persisted.sort((a, b) => a.LocalSeq - b.LocalSeq);
      this.queue = persisted;
      const stored = typeof localStorage !== "undefined" ? localStorage.getItem(SEQ_KEY) : null;
      const fromSeq = stored ? parseInt(stored, 10) : 0;
      const fromQueue = persisted.reduce((m, q) => Math.max(m, q.LocalSeq), 0);
      this.nextSeq = Math.max(fromSeq, fromQueue) + 1;
      // Resume timers for ops that were "queued" or "in-flight" when the page died.
      for (const entry of this.queue) {
        if (entry.Status === "in-flight") entry.Status = "queued";
        if (entry.Status === "queued") {
          const delay = Math.max(0, new Date(entry.ScheduledFor).getTime() - Date.now());
          setTimeout(() => { void this.flush(entry.QueueId); }, delay);
        }
      }
      this.hydrated = true;
      this.emit();
    })();
    return this.hydratePromise;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn([...this.queue]);
    void this.hydrate();
    return () => { this.listeners.delete(fn); };
  }

  private emit() {
    const snap = [...this.queue];
    this.listeners.forEach((l) => l(snap));
  }

  subscribeLoss(fn: LossListener) {
    this.lossListeners.add(fn);
    return () => { this.lossListeners.delete(fn); };
  }

  private emitLoss(ev: LwwLossEvent) {
    this.lossListeners.forEach((l) => l(ev));
  }

  list() { return [...this.queue]; }

  async clear() {
    this.queue = [];
    await syncQueueStore.clear();
    this.emit();
  }

  /** Persist a single entry (insert or update). */
  private async persist(entry: QueuedOp) {
    await syncQueueStore.put(entry);
  }

  private bumpSeq(): number {
    const s = this.nextSeq++;
    if (typeof localStorage !== "undefined") localStorage.setItem(SEQ_KEY, String(s));
    return s;
  }

  /**
   * Enqueue an op. For items.update we capture the base snapshot so we can
   * detect conflicts when the op finally fires. Returns the QueueId.
   */
  async enqueue(kind: OpKind, payload: unknown): Promise<string> {
    await this.hydrate();
    const queueId = ulid();
    let baseSnapshot: Item | null = null;
    let optimisticPatch: Partial<Item> | null = null;

    if (kind === "items.update") {
      const p = payload as UpdatePayload;
      baseSnapshot = (await itemsStore.get(p.Id)) ?? null;
      optimisticPatch = {
        Content: p.Content,
        Note: p.Note,
        Tags: p.Tags,
      };
    }

    const entry: QueuedOp = {
      QueueId: queueId,
      LocalSeq: this.bumpSeq(),
      Kind: kind,
      Payload: payload,
      EnqueuedAt: nowIso(),
      ScheduledFor: new Date(Date.now() + this.latencyMs).toISOString(),
      BaseSnapshot: baseSnapshot,
      OptimisticPatch: optimisticPatch,
      Status: "queued",
      ConflictRemote: null,
      ConflictLocal: null,
      Resolution: null,
      ResultEnvelope: null,
    };
    this.queue.push(entry);
    await this.persist(entry);
    this.emit();

    // If conflict injection is armed and this is an update, mutate the
    // "remote" item right now to simulate another peer editing first.
    if (this.injectConflictForNext && kind === "items.update" && baseSnapshot) {
      this.injectConflictForNext = false;
      const remoteEdit: Item = {
        ...baseSnapshot,
        Content: `${baseSnapshot.Content} [edited by peer]`,
        UpdatedAt: nowIso(),
      };
      await itemsStore.put(remoteEdit);
    }

    setTimeout(() => { void this.flush(queueId); }, this.latencyMs);
    return queueId;
  }

  /** Force flush a single queued op now (skip wait). */
  async flushNow(queueId: string) {
    return this.flush(queueId);
  }

  private async flush(queueId: string) {
    const entry = this.queue.find((q) => q.QueueId === queueId);
    if (!entry || entry.Status !== "queued") return;
    entry.Status = "in-flight";
    await this.persist(entry);
    this.emit();

    // Conflict detection for items.update — compare current persisted item
    // against the snapshot taken at enqueue time.
    if (entry.Kind === "items.update" && entry.BaseSnapshot) {
      const current = await itemsStore.get(entry.BaseSnapshot.Id);
      const driftedRemotely =
        current &&
        (current.Content !== entry.BaseSnapshot.Content ||
          current.Note !== entry.BaseSnapshot.Note ||
          JSON.stringify(current.Tags) !== JSON.stringify(entry.BaseSnapshot.Tags));
      if (driftedRemotely && current) {
        entry.Status = "conflict";
        entry.ConflictRemote = current;
        entry.ConflictLocal = entry.OptimisticPatch;
        await this.persist(entry);
        this.emit();
        return;
      }
    }

    await this.commit(entry);
  }

  /** Resolve a conflict and commit. */
  async resolve(queueId: string, strategy: ResolutionStrategy) {
    const entry = this.queue.find((q) => q.QueueId === queueId);
    if (!entry || entry.Status !== "conflict") return;
    entry.Resolution = strategy;
    const itemId = (entry.Payload as UpdatePayload)?.Id ?? entry.BaseSnapshot?.Id ?? "";

    if (strategy === "keep-remote") {
      // User explicitly drops local — overwrite is a loss event.
      entry.Status = "applied";
      entry.ResultEnvelope = null;
      await this.persist(entry);
      this.emitLoss({
        QueueId: entry.QueueId,
        ItemId: itemId,
        Reason: "keep-remote",
        At: nowIso(),
        RemoteUpdatedAt: entry.ConflictRemote?.UpdatedAt,
        LocalEnqueuedAt: entry.EnqueuedAt,
      });
      this.emit();
      return;
    }

    if (strategy === "lww") {
      // Auto last-writer-wins — compare remote's UpdatedAt against the local
      // edit's EnqueuedAt (when the user typed it). If remote is strictly
      // newer, local loses: drop the local payload AND emit a loss event so
      // the toast pipeline can surface it (spec 14 §14.4 + 14b §14b.4).
      const remoteAt = entry.ConflictRemote?.UpdatedAt
        ? new Date(entry.ConflictRemote.UpdatedAt).getTime()
        : 0;
      const localAt = new Date(entry.EnqueuedAt).getTime();
      if (remoteAt > localAt) {
        entry.Status = "applied";
        entry.ResultEnvelope = null;
        await this.persist(entry);
        this.emitLoss({
          QueueId: entry.QueueId,
          ItemId: itemId,
          Reason: "lww-local-lost",
          At: nowIso(),
          RemoteUpdatedAt: entry.ConflictRemote?.UpdatedAt,
          LocalEnqueuedAt: entry.EnqueuedAt,
        });
        this.emit();
        return;
      }
      // Local is newer (or equal) — fall through and commit, local wins.
    }

    // keep-local OR lww-local-wins: reapply the local payload.
    await this.commit(entry);
  }

  private async commit(entry: QueuedOp) {
    try {
      const env = await applyOp(entry.Kind as never, entry.Payload as never);
      entry.ResultEnvelope = env as Envelope<unknown>;
      entry.Status = env.Status.IsSuccess ? "applied" : "failed";
    } catch {
      entry.Status = "failed";
      entry.ResultEnvelope = null;
    }
    await this.persist(entry);
    this.emit();
  }
}

export const syncQueue = new SyncQueue();

/** Convenience re-exports for the simulator UI. */
export { applyOp, listItems };
export type { Item, Op };
