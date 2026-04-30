// Mirror cycle detection — DFS up the effective-parent chain.
// Mirrors spec/31-app/01-features/09a-mirror-cycle-detection.md.
//
// Effective parents of node X = {Items[X].ParentId} ∪ {peers of X under different parents}.
// Per spec 09b, mirror "edges" are encoded as MirrorMember rows: every member
// of a peer group is reachable as a parent of any other peer's children.

import type { Item, MirrorMember } from "./types";

export interface CycleResult {
  IsCycle: boolean;
  CyclePath: string[];
}

/**
 * Returns IsCycle=true iff moving/mirroring `SourceId` under `TargetParentId`
 * would create an unrenderable loop. Pure function: callers pass snapshots.
 */
export function hasCycle(
  SourceId: string,
  TargetParentId: string | null,
  items: Item[],
  members: MirrorMember[],
): CycleResult {
  if (TargetParentId == null) return { IsCycle: false, CyclePath: [] };
  if (SourceId === TargetParentId) return { IsCycle: true, CyclePath: [SourceId] };

  const itemById = new Map(items.map((i) => [i.Id, i]));
  // Map: peerGroupId → member item ids
  const peersByGroup = new Map<string, string[]>();
  for (const m of members) {
    const arr = peersByGroup.get(m.PeerGroupId) ?? [];
    arr.push(m.ItemId);
    peersByGroup.set(m.PeerGroupId, arr);
  }

  const visited = new Set<string>();
  // Stack of (nodeId, pathSoFar) for debug path reporting.
  const stack: Array<{ id: string; path: string[] }> = [
    { id: TargetParentId, path: [TargetParentId] },
  ];

  while (stack.length) {
    const { id, path } = stack.pop()!;
    if (id === SourceId) return { IsCycle: true, CyclePath: path };
    if (visited.has(id)) continue;
    visited.add(id);

    const node = itemById.get(id);
    if (!node) continue;

    // Containment edge.
    if (node.ParentId) {
      stack.push({ id: node.ParentId, path: [...path, node.ParentId] });
    }
    // Mirror edges: every other peer in this node's group is also an
    // "effective parent surface" — its containment chain must be walked.
    if (node.PeerGroupId) {
      for (const peerId of peersByGroup.get(node.PeerGroupId) ?? []) {
        if (peerId === id) continue;
        stack.push({ id: peerId, path: [...path, peerId] });
      }
    }
  }
  return { IsCycle: false, CyclePath: [] };
}
