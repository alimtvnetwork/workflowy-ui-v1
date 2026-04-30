// Reference applyOp implementation — the WordPress plugin should mirror this contract.
// Each call: append op to journal → mutate items store → return universal envelope.

import { itemsStore, opsStore } from "./db";
import type {
  CompletePayload,
  CreatePayload,
  DeletePayload,
  Envelope,
  Item,
  MovePayload,
  Op,
  OpKind,
  RestorePayload,
  UpdatePayload,
} from "./types";
import { nowIso, sortAfter, ulid } from "./util";

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

// ---- Operations ----

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
  await itemsStore.put(next);
  await journal("items.update", p, true, null);
  return ok([next]);
}

async function completeItem(p: CompletePayload): Promise<Envelope<Item>> {
  const cur = await itemsStore.get(p.Id);
  if (!cur) return fail(404, `Item ${p.Id} not found`);
  const next: Item = {
    ...cur,
    IsCompleted: p.IsCompleted,
    CompletedAt: p.IsCompleted ? nowIso() : null,
    UpdatedAt: nowIso(),
  };
  await itemsStore.put(next);
  await journal("items.complete", p, true, null);
  return ok([next]);
}

async function moveItem(p: MovePayload): Promise<Envelope<Item>> {
  const cur = await itemsStore.get(p.Id);
  if (!cur) return fail(404, `Item ${p.Id} not found`);
  const all = await itemsStore.getAll();
  const siblings = all
    .filter((i) => i.ParentId === p.NewParentId && i.Id !== p.Id && !i.TrashedAt)
    .sort((a, b) => (a.Sort < b.Sort ? -1 : 1));
  const after = p.AfterSort ?? siblings[siblings.length - 1]?.Sort ?? null;
  const next: Item = {
    ...cur,
    ParentId: p.NewParentId,
    Sort: sortAfter(after, null),
    UpdatedAt: nowIso(),
  };
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

// ---- Public dispatcher ----

export async function applyOp(kind: "items.create", payload: CreatePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.update", payload: UpdatePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.complete", payload: CompletePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.move", payload: MovePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.delete", payload: DeletePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: "items.restore", payload: RestorePayload): Promise<Envelope<Item>>;
export async function applyOp(kind: OpKind, payload: any): Promise<Envelope<Item>> {
  try {
    switch (kind) {
      case "items.create":
        return await createItem(payload);
      case "items.update":
        return await updateItem(payload);
      case "items.complete":
        return await completeItem(payload);
      case "items.move":
        return await moveItem(payload);
      case "items.delete":
        return await deleteItem(payload);
      case "items.restore":
        return await restoreItem(payload);
      default:
        return fail(400, `Unknown op kind: ${kind}`);
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

export async function resetPlayground() {
  const { resetAll } = await import("./db");
  await resetAll();
}
