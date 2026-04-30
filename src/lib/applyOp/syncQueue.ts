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

const SEQ_KEY = "spec-applyop-localseq";

class SyncQueue {
  private queue: QueuedOp[] = [];
  private listeners = new Set<Listener>();
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
    if (strategy === "keep-remote") {
      // Drop the local change entirely.
      entry.Status = "applied";
      entry.ResultEnvelope = null;
      await this.persist(entry);
      this.emit();
      return;
    }
    // keep-local and lww both reapply the local payload — lww wins because
    // applyOp will write a newer UpdatedAt over the remote.
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
