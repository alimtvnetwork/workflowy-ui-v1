// Trash reaper simulator — models spec/31-app/01-features/11b-trash-reaper.md.
// Runs against the same applyOp IndexedDB items/mirrorMembers stores so it
// composes with the playground and sync simulator.

import { itemsStore, mirrorMembersStore } from "./db";
import type { Item } from "./types";

export interface ReaperRun {
  Id: string;
  RanAt: string;
  RowsDeleted: number;
  DurationMs: number;
  /** IDs of items hard-deleted, for the UI log. */
  DeletedIds: string[];
  /** Peer groups dissolved as a side-effect (size dropped to ≤ 1). */
  DissolvedGroups: string[];
}

export interface ReaperConfig {
  /** Spec default: 30 days. Sim allows shrinking for demos. */
  RetentionDays: number;
  /** Spec default: 1000. */
  BatchSize: number;
  /** Virtual "now" for the sim — defaults to wall clock. */
  NowMs: number;
}

const DEFAULT_CONFIG: ReaperConfig = {
  RetentionDays: 30,
  BatchSize: 1000,
  NowMs: Date.now(),
};

function ulid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/** Pure: returns the items eligible for hard delete given the cutoff. */
export function eligibleForReap(items: Item[], cutoffIso: string): Item[] {
  return items.filter((i) => i.TrashedAt !== null && i.TrashedAt < cutoffIso);
}

/**
 * Run one reaper pass. Hard-deletes eligible items in batches; cascades to
 * children whose ParentId points at a deleted row (mirrors `ON DELETE CASCADE`);
 * dissolves peer groups that drop to ≤ 1 member (per spec 09b §dissolve).
 */
export async function runReaper(cfg: Partial<ReaperConfig> = {}): Promise<ReaperRun> {
  const config = { ...DEFAULT_CONFIG, ...cfg };
  const start = performance.now();
  const cutoff = new Date(config.NowMs - config.RetentionDays * 86400_000).toISOString();

  const allItems = await itemsStore.getAll();
  const eligible = eligibleForReap(allItems, cutoff);

  // Cascade: walk descendants of each eligible item, regardless of their own
  // TrashedAt — once parent is gone, FK cascade takes them too.
  const childrenByParent = new Map<string | null, Item[]>();
  for (const it of allItems) {
    const arr = childrenByParent.get(it.ParentId) ?? [];
    arr.push(it);
    childrenByParent.set(it.ParentId, arr);
  }
  const toDelete = new Set<string>();
  const stack = [...eligible.map((i) => i.Id)];
  while (stack.length) {
    const id = stack.pop()!;
    if (toDelete.has(id)) continue;
    toDelete.add(id);
    for (const child of childrenByParent.get(id) ?? []) stack.push(child.Id);
  }

  // Apply the batch cap.
  const batch = Array.from(toDelete).slice(0, config.BatchSize);
  for (const id of batch) await itemsStore.delete(id);

  // Cascade peer-group members + dissolve singletons.
  const allMembers = await mirrorMembersStore.getAll();
  const dissolved = new Set<string>();
  const remainingByGroup = new Map<string, number>();
  for (const m of allMembers) {
    if (batch.includes(m.ItemId)) {
      await mirrorMembersStore.delete(m.PeerGroupId, m.ItemId);
    } else {
      remainingByGroup.set(m.PeerGroupId, (remainingByGroup.get(m.PeerGroupId) ?? 0) + 1);
    }
  }
  for (const [groupId, count] of remainingByGroup) {
    if (count <= 1) {
      dissolved.add(groupId);
      // Detach the lone survivor: delete its membership row + clear PeerGroupId.
      const survivor = allMembers.find((m) => m.PeerGroupId === groupId && !batch.includes(m.ItemId));
      if (survivor) {
        await mirrorMembersStore.delete(groupId, survivor.ItemId);
        const item = await itemsStore.get(survivor.ItemId);
        if (item) await itemsStore.put({ ...item, PeerGroupId: null, UpdatedAt: new Date().toISOString() });
      }
    }
  }

  return {
    Id: ulid(),
    RanAt: new Date(config.NowMs).toISOString(),
    RowsDeleted: batch.length,
    DurationMs: Math.round(performance.now() - start),
    DeletedIds: batch,
    DissolvedGroups: Array.from(dissolved),
  };
}
