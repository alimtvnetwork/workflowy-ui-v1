// Reference applyOp implementation — the WordPress plugin should mirror this contract.
// Each call: append op to journal → mutate stores → return universal envelope.

import {
  boardColumnsStore,
  itemsStore,
  mirrorMembersStore,
  opsStore,
  sharesStore,
} from "./db";
import type {
  BoardAddColumnPayload,
  BoardColumn,
  BoardMoveCardPayload,
  CompletePayload,
  CreatePayload,
  DeletePayload,
  Envelope,
  Item,
  MirrorCreatePayload,
  MirrorDetachPayload,
  MirrorMember,
  MovePayload,
  Op,
  OpKind,
  RestorePayload,
  ShareGrant,
  ShareGrantPayload,
  ShareRevokePayload,
  UpdatePayload,
} from "./types";
import { nowIso, sortAfter, ulid } from "./util";
import { hasCycle } from "./cycle";

export { hasCycle } from "./cycle";
export type { CycleResult } from "./cycle";

function ok<T>(results: T[], code = 200, message = "OK", url = "/applyOp"): Envelope<T> {
  const ts = nowIso();
  return {
    Status: { IsSuccess: true, IsFailed: false, Code: code, Message: message, Timestamp: ts },
    Attributes: {
      RequestedAt: url,
      RequestDelegatedAt: "",
      HasAnyErrors: false,
      IsSingle: results.length === 1,
      IsMultiple: results.length > 1,
      IsEmpty: results.length === 0,
      TotalRecords: results.length,
      PerPage: 0,
      TotalPages: 0,
      CurrentPage: 0,
    },
    Results: results,
    Errors: null,
  };
}

function fail<T>(code: number, message: string, url = "/applyOp"): Envelope<T> {
  return {
    Status: { IsSuccess: false, IsFailed: true, Code: code, Message: message, Timestamp: nowIso() },
    Attributes: {
      RequestedAt: url,
      RequestDelegatedAt: "",
      HasAnyErrors: true,
      IsSingle: false,
      IsMultiple: false,
      IsEmpty: true,
      TotalRecords: 0,
      PerPage: 0,
      TotalPages: 0,
      CurrentPage: 0,
    },
    Results: [],
    Errors: {
      BackendMessage: message,
      DelegatedServiceErrorStack: [],
      Backend: ["src/lib/applyOp/index.ts:applyOp"],
      Frontend: [],
    },
  };
}

async function journal(kind: OpKind, payload: unknown, applied: boolean, error: string | null): Promise<Op> {
  const op: Op = {
    OpId: ulid(),
    Kind: kind,
    Payload: payload,
    ClientTs: nowIso(),
    AppliedTs: applied ? nowIso() : null,
    Status: applied ? "Applied" : "Failed",
    ErrorMessage: error,
  };
  await opsStore.put(op);
  return op;
}

// ---- Items ----

async function createItem(p: CreatePayload): Promise<Envelope<Item>> {
  if (!p.Content?.trim()) return fail(400, "Content is required");
  const all = await itemsStore.getAll();
  const siblings = all
    .filter((i) => i.ParentId === p.ParentId && !i.TrashedAt)
    .sort((a, b) => (a.Sort < b.Sort ? -1 : 1));
  const after = p.AfterSort ?? siblings[siblings.length - 1]?.Sort ?? null;
  const item: Item = {
    Id: ulid(),
    ParentId: p.ParentId,
    Content: p.Content.trim(),
    ItemType: p.ItemType,
    Sort: sortAfter(after, null),
    IsCompleted: false,
    Note: null,
    Tags: [],
    ColumnId: p.ColumnId ?? null,
    PeerGroupId: null,
    CreatedAt: nowIso(),
    UpdatedAt: nowIso(),
    CompletedAt: null,
    TrashedAt: null,
  };
  await itemsStore.put(item);
  await journal("items.create", p, true, null);
  return ok([item], 201, "Created");
}

async function updateItem(p: UpdatePayload): Promise<Envelope<Item>> {
  const cur = await itemsStore.get(p.Id);
  if (!cur) {
    await journal("items.update", p, false, "Not found");
    return fail(404, `Item ${p.Id} not found`);
  }
  const next: Item = {
    ...cur,
    Content: p.Content ?? cur.Content,
    Note: p.Note !== undefined ? p.Note : cur.Note,
    Tags: p.Tags ?? cur.Tags,
    UpdatedAt: nowIso(),
  };
  // Mirror sync: edits propagate to all peers in the group (per spec 09 §8.3).
  if (cur.PeerGroupId) {
    const members = (await mirrorMembersStore.getAll()).filter((m) => m.PeerGroupId === cur.PeerGroupId);
    for (const m of members) {
      if (m.ItemId === cur.Id) continue;
      const peer = await itemsStore.get(m.ItemId);
      if (!peer) continue;
      await itemsStore.put({
        ...peer,
        Content: next.Content,
        Note: next.Note,
        Tags: next.Tags,
        UpdatedAt: nowIso(),
      });
    }
  }
  await itemsStore.put(next);
  await journal("items.update", p, true, null);
  return ok([next]);
}

async function completeItem(p: CompletePayload): Promise<Envelope<Item>> {
  const cur = await itemsStore.get(p.Id);
  if (!cur) return fail(404, `Item ${p.Id} not found`);
  const completedAt = p.IsCompleted ? nowIso() : null;
  const next: Item = { ...cur, IsCompleted: p.IsCompleted, CompletedAt: completedAt, UpdatedAt: nowIso() };
  // Mirror: completion is shared per spec 09 §8.3.
  if (cur.PeerGroupId) {
    const members = (await mirrorMembersStore.getAll()).filter((m) => m.PeerGroupId === cur.PeerGroupId);
    for (const m of members) {
      if (m.ItemId === cur.Id) continue;
      const peer = await itemsStore.get(m.ItemId);
      if (!peer) continue;
      await itemsStore.put({ ...peer, IsCompleted: p.IsCompleted, CompletedAt: completedAt, UpdatedAt: nowIso() });
    }
  }
  await itemsStore.put(next);
  await journal("items.complete", p, true, null);
  return ok([next]);
}

async function moveItem(p: MovePayload): Promise<Envelope<Item>> {
  const cur = await itemsStore.get(p.Id);
  if (!cur) return fail(404, `Item ${p.Id} not found`);
  const all = await itemsStore.getAll();
  // Spec 09a: reject moves that would create a cycle (ERR_CYCLE).
  if (p.NewParentId) {
    const members = await mirrorMembersStore.getAll();
    const cyc = hasCycle(p.Id, p.NewParentId, all, members);
    if (cyc.IsCycle) {
      await journal("items.move", p, false, `ERR_CYCLE: ${cyc.CyclePath.join(" → ")}`);
      return fail(409, `ERR_CYCLE: move would create a loop (${cyc.CyclePath.join(" → ")})`);
    }
  }
  const siblings = all
    .filter((i) => i.ParentId === p.NewParentId && i.Id !== p.Id && !i.TrashedAt)
    .sort((a, b) => (a.Sort < b.Sort ? -1 : 1));
  const after = p.AfterSort ?? siblings[siblings.length - 1]?.Sort ?? null;
  const next: Item = { ...cur, ParentId: p.NewParentId, Sort: sortAfter(after, null), UpdatedAt: nowIso() };
  await itemsStore.put(next);
  await journal("items.move", p, true, null);
  return ok([next]);
}

async function deleteItem(p: DeletePayload): Promise<Envelope<Item>> {
  const cur = await itemsStore.get(p.Id);
  if (!cur) return fail(404, `Item ${p.Id} not found`);
  const next: Item = { ...cur, TrashedAt: nowIso(), UpdatedAt: nowIso() };
  await itemsStore.put(next);
  await journal("items.delete", p, true, null);
  return ok<Item>([], 200, "Item moved to trash");
}

async function restoreItem(p: RestorePayload): Promise<Envelope<Item>> {
  const cur = await itemsStore.get(p.Id);
  if (!cur) return fail(404, `Item ${p.Id} not found`);
  const next: Item = { ...cur, TrashedAt: null, UpdatedAt: nowIso() };
  await itemsStore.put(next);
  await journal("items.restore", p, true, null);
  return ok([next]);
}

// ---- Mirrors (spec 09 + 09b peer-group model) ----

async function createMirror(p: MirrorCreatePayload): Promise<Envelope<Item>> {
  const source = await itemsStore.get(p.SourceItemId);
  if (!source) return fail(404, `Source item ${p.SourceItemId} not found`);

  // Spec 09a: mirror creation is a virtual move; same cycle check applies.
  if (p.NewParentId) {
    const allItems = await itemsStore.getAll();
    const allMembers = await mirrorMembersStore.getAll();
    const cyc = hasCycle(p.SourceItemId, p.NewParentId, allItems, allMembers);
    if (cyc.IsCycle) {
      await journal("mirrors.create", p, false, `ERR_CYCLE: ${cyc.CyclePath.join(" → ")}`);
      return fail(409, `ERR_CYCLE: mirror would create a loop (${cyc.CyclePath.join(" → ")})`);
    }
  }

  // Promote source into a peer group if it isn't already in one.
  const peerGroupId = source.PeerGroupId ?? ulid();
  if (!source.PeerGroupId) {
    const updated: Item = { ...source, PeerGroupId: peerGroupId, UpdatedAt: nowIso() };
    await itemsStore.put(updated);
    const member: MirrorMember = {
      PeerGroupId: peerGroupId,
      ItemId: source.Id,
      ParentId: source.ParentId,
      Sort: source.Sort,
      CreatedAt: nowIso(),
    };
    await mirrorMembersStore.put(member);
  }

  // Create the new mirror peer under NewParentId, sharing source content.
  const all = await itemsStore.getAll();
  const siblings = all
    .filter((i) => i.ParentId === p.NewParentId && !i.TrashedAt)
    .sort((a, b) => (a.Sort < b.Sort ? -1 : 1));
  const after = siblings[siblings.length - 1]?.Sort ?? null;
  const mirror: Item = {
    Id: ulid(),
    ParentId: p.NewParentId,
    Content: source.Content,
    ItemType: source.ItemType,
    Sort: sortAfter(after, null),
    IsCompleted: source.IsCompleted,
    Note: source.Note,
    Tags: source.Tags,
    ColumnId: null,
    PeerGroupId: peerGroupId,
    CreatedAt: nowIso(),
    UpdatedAt: nowIso(),
    CompletedAt: source.CompletedAt,
    TrashedAt: null,
  };
  await itemsStore.put(mirror);
  await mirrorMembersStore.put({
    PeerGroupId: peerGroupId,
    ItemId: mirror.Id,
    ParentId: mirror.ParentId,
    Sort: mirror.Sort,
    CreatedAt: nowIso(),
  });
  await journal("mirrors.create", p, true, null);
  return ok([mirror], 201, "Mirror created");
}

async function detachMirror(p: MirrorDetachPayload): Promise<Envelope<Item>> {
  const cur = await itemsStore.get(p.ItemId);
  if (!cur) return fail(404, `Item ${p.ItemId} not found`);
  if (!cur.PeerGroupId) return fail(409, "Item is not part of a mirror group");

  const peerGroupId = cur.PeerGroupId;
  await mirrorMembersStore.delete(peerGroupId, cur.Id);
  const remaining = (await mirrorMembersStore.getAll()).filter((m) => m.PeerGroupId === peerGroupId);

  // Spec 09b: a singleton peer group dissolves.
  const detached: Item = { ...cur, PeerGroupId: null, UpdatedAt: nowIso() };
  await itemsStore.put(detached);

  if (remaining.length === 1) {
    const lone = await itemsStore.get(remaining[0].ItemId);
    if (lone) {
      await itemsStore.put({ ...lone, PeerGroupId: null, UpdatedAt: nowIso() });
      await mirrorMembersStore.delete(peerGroupId, lone.Id);
    }
  }
  await journal("mirrors.detach", p, true, null);
  return ok([detached]);
}

// ---- Shares (spec 08) ----

async function grantShare(p: ShareGrantPayload): Promise<Envelope<ShareGrant>> {
  const item = await itemsStore.get(p.ItemId);
  if (!item) return fail(404, `Item ${p.ItemId} not found`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.GranteeEmail)) return fail(400, "Invalid email");
  const grant: ShareGrant = {
    ShareId: ulid(),
    ItemId: p.ItemId,
    GranteeEmail: p.GranteeEmail.toLowerCase(),
    Permission: p.Permission,
    CreatedAt: nowIso(),
    RevokedAt: null,
  };
  await sharesStore.put(grant);
  await journal("shares.grant", p, true, null);
  return ok([grant], 201, "Share granted");
}

async function revokeShare(p: ShareRevokePayload): Promise<Envelope<ShareGrant>> {
  const cur = await sharesStore.get(p.ShareId);
  if (!cur) return fail(404, `Share ${p.ShareId} not found`);
  const next: ShareGrant = { ...cur, RevokedAt: nowIso() };
  await sharesStore.put(next);
  await journal("shares.revoke", p, true, null);
  return ok([next]);
}

// ---- Boards (spec 07) ----

async function addColumn(p: BoardAddColumnPayload): Promise<Envelope<BoardColumn>> {
  const board = await itemsStore.get(p.BoardItemId);
  if (!board) return fail(404, `Board ${p.BoardItemId} not found`);
  if (board.ItemType !== "Board") return fail(409, "Parent is not a Board");
  const cols = (await boardColumnsStore.getAll()).filter((c) => c.BoardItemId === p.BoardItemId)
    .sort((a, b) => (a.Sort < b.Sort ? -1 : 1));
  const after = cols[cols.length - 1]?.Sort ?? null;
  const col: BoardColumn = {
    ColumnId: ulid(),
    BoardItemId: p.BoardItemId,
    Title: p.Title.trim() || "Untitled",
    Sort: sortAfter(after, null),
    CreatedAt: nowIso(),
  };
  await boardColumnsStore.put(col);
  await journal("boards.addColumn", p, true, null);
  return ok([col], 201, "Column added");
}

async function moveCard(p: BoardMoveCardPayload): Promise<Envelope<Item>> {
  const card = await itemsStore.get(p.CardItemId);
  if (!card) return fail(404, `Card ${p.CardItemId} not found`);
  const cards = (await itemsStore.getAll())
    .filter((i) => i.ColumnId === p.TargetColumnId && i.Id !== p.CardItemId && !i.TrashedAt)
    .sort((a, b) => (a.Sort < b.Sort ? -1 : 1));
  const after = p.AfterSort ?? cards[cards.length - 1]?.Sort ?? null;
  const next: Item = { ...card, ColumnId: p.TargetColumnId, Sort: sortAfter(after, null), UpdatedAt: nowIso() };
  await itemsStore.put(next);
  await journal("boards.moveCard", p, true, null);
  return ok([next]);
}

// ---- Public dispatcher ----

export async function applyOp(kind: "items.create", payload: CreatePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.update", payload: UpdatePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.complete", payload: CompletePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.move", payload: MovePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.delete", payload: DeletePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.restore", payload: RestorePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "mirrors.create", payload: MirrorCreatePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "mirrors.detach", payload: MirrorDetachPayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "shares.grant", payload: ShareGrantPayload): Promise<Envelope<ShareGrant>>;
export async function applyOp(kind: "shares.revoke", payload: ShareRevokePayload): Promise<Envelope<ShareGrant>>;
export async function applyOp(kind: "boards.addColumn", payload: BoardAddColumnPayload): Promise<Envelope<BoardColumn>>;
export async function applyOp(kind: "boards.moveCard", payload: BoardMoveCardPayload): Promise<Envelope<Item>>;
export async function applyOp(kind: OpKind, payload: any): Promise<Envelope<unknown>> {
  try {
    switch (kind) {
      case "items.create": return await createItem(payload);
      case "items.update": return await updateItem(payload);
      case "items.complete": return await completeItem(payload);
      case "items.move": return await moveItem(payload);
      case "items.delete": return await deleteItem(payload);
      case "items.restore": return await restoreItem(payload);
      case "mirrors.create": return await createMirror(payload);
      case "mirrors.detach": return await detachMirror(payload);
      case "shares.grant": return await grantShare(payload);
      case "shares.revoke": return await revokeShare(payload);
      case "boards.addColumn": return await addColumn(payload);
      case "boards.moveCard": return await moveCard(payload);
      default: return fail(400, `Unknown op kind: ${kind}`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await journal(kind, payload, false, msg);
    return fail(500, msg);
  }
}

export async function listItems(opts?: { includeTrashed?: boolean }) {
  const all = await itemsStore.getAll();
  const filtered = opts?.includeTrashed ? all : all.filter((i) => !i.TrashedAt);
  return ok(filtered.sort((a, b) => (a.Sort < b.Sort ? -1 : 1)));
}

export async function listOps() {
  const ops = await opsStore.getAll();
  return ok(ops.sort((a, b) => (a.ClientTs < b.ClientTs ? 1 : -1)));
}

export async function listMirrorMembers() {
  const m = await mirrorMembersStore.getAll();
  return ok(m);
}

export async function listShares() {
  const s = await sharesStore.getAll();
  return ok(s.sort((a, b) => (a.CreatedAt < b.CreatedAt ? 1 : -1)));
}

export async function listBoardColumns() {
  const c = await boardColumnsStore.getAll();
  return ok(c.sort((a, b) => (a.Sort < b.Sort ? -1 : 1)));
}

export async function resetPlayground() {
  const { resetAll } = await import("./db");
  await resetAll();
}
