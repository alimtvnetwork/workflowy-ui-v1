// Sync simulator — wraps applyOp with configurable latency, a pending queue, and
// a conflict-resolver hook. Models spec/31-app/01-features/14-concurrency-and-sync.md
// (last-write-wins by default, with explicit user override).
//
// This module deliberately lives next to the reference applyOp impl: the
// WordPress plugin would replace this file with a real network client, but the
// queue / conflict shape stays the same.

import { applyOp, listItems } from "./index";
import { itemsStore } from "./db";
import type { Envelope, Item, Op, OpKind, UpdatePayload } from "./types";
import { nowIso, ulid } from "./util";

export type ResolutionStrategy = "lww" | "keep-local" | "keep-remote";

export interface QueuedOp {
  QueueId: string;
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

class SyncQueue {
  private queue: QueuedOp[] = [];
  private listeners = new Set<Listener>();
  latencyMs = 1500;
  /** When true, the next queued items.update on the same Id will inject a remote conflict. */
  injectConflictForNext = false;

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn([...this.queue]);
    return () => { this.listeners.delete(fn); };
  }

  private emit() {
    const snap = [...this.queue];
    this.listeners.forEach((l) => l(snap));
  }

  list() { return [...this.queue]; }

  clear() {
    this.queue = [];
    this.emit();
  }

  /**
   * Enqueue an op. For items.update we capture the base snapshot so we can
   * detect conflicts when the op finally fires. Returns the QueueId.
   */
  async enqueue(kind: OpKind, payload: unknown): Promise<string> {
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
    } catch (e) {
      entry.Status = "failed";
      entry.ResultEnvelope = null;
    }
    this.emit();
  }
}

export const syncQueue = new SyncQueue();

/** Convenience re-exports for the simulator UI. */
export { applyOp, listItems };
export type { Item, Op };
