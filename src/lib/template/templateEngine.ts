// Template snapshot engine — spec/31-app/01-features/13b-templates-snapshot-semantics.md
//
// Faithful in-memory implementation of the snapshot/instantiate model.
//
// Core rules (§1 Decision):
//   • Templates store a serialised JSON tree (PayloadJson) — full subtree.
//   • Instantiation creates BRAND-NEW Item rows; no FK back to template.
//   • Edits to template do NOT affect instances, and vice versa.
//   • Mirrors inside a template are FLATTENED to plain items on snapshot.
//   • Trashed descendants are EXCLUDED from snapshot.
//   • Owner of new rows = instantiating user (auth.uid()), regardless of author.
//
// Acceptance coverage:
//   AT-TPL-01..05  +  AT-APP-TSNAP-01..05

export type ItemId = string;
export type ItemType = "Bullet" | "Todo" | "H1" | "H2" | "Paragraph";

export interface Item {
  Id: ItemId;
  ParentId: ItemId | null;
  OwnerId: string;
  ItemType: ItemType;
  Title: string;
  IsMirror?: boolean;        // mirrors get flattened on snapshot
  PeerGroupId?: string | null;
  TrashedAt?: string | null; // excluded on snapshot
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SnapshotNode {
  Id: ItemId;             // original id (informational only — re-stamped on apply)
  ParentId: ItemId | null;
  ItemType: ItemType;
  Title: string;
  Children: SnapshotNode[];
}

export interface TemplatePayload {
  Version: 1;
  Root: SnapshotNode;
  NodeCount: number;
  TakenAt: string;
  SourceRootId: ItemId;
}

export interface Template {
  Id: string;
  Name: string;
  AuthorOwnerId: string;
  CreatedAt: string;
  PayloadJson: string;       // canonical storage form per §1
}

export interface ApplyResult {
  RootId: ItemId;
  NewItems: Item[];
  IdMap: Record<ItemId, ItemId>;
}

export interface ApplyError {
  Code: "ERR_FORBIDDEN" | "ERR_TEMPLATE_TOO_LARGE" | "ERR_PARENT_NOT_FOUND";
  Status: 403 | 413 | 404;
  Message: string;
}

export const SIZE_CAP = 10_000;

let _uuid = 0;
function uuid(prefix = "i"): ItemId {
  _uuid += 1;
  return `${prefix}_${_uuid.toString(36).padStart(4, "0")}`;
}

let _now = Date.parse("2026-05-01T00:00:00Z");
function nowIso(): string {
  _now += 1;
  return new Date(_now).toISOString();
}

export function resetClock() {
  _uuid = 0;
  _now = Date.parse("2026-05-01T00:00:00Z");
}

// ─────────────────────────────────────────────────────────────────────
// Snapshot — DFS clone with flatten + trash-exclusion
// ─────────────────────────────────────────────────────────────────────

export interface SnapshotTrace {
  IncludedIds: ItemId[];
  ExcludedTrashed: ItemId[];
  FlattenedMirrors: ItemId[];
  NodeCount: number;
}

export function takeSnapshot(
  items: Item[],
  rootId: ItemId,
): { Payload: TemplatePayload; Trace: SnapshotTrace } | { Error: ApplyError } {
  const byId = new Map(items.map((i) => [i.Id, i]));
  const root = byId.get(rootId);
  if (!root) {
    return { Error: { Code: "ERR_PARENT_NOT_FOUND", Status: 404, Message: `Source root ${rootId} not found` } };
  }
  const childrenOf = new Map<ItemId | null, Item[]>();
  for (const it of items) {
    const arr = childrenOf.get(it.ParentId) ?? [];
    arr.push(it);
    childrenOf.set(it.ParentId, arr);
  }
  const trace: SnapshotTrace = {
    IncludedIds: [],
    ExcludedTrashed: [],
    FlattenedMirrors: [],
    NodeCount: 0,
  };

  function build(node: Item, parentIdInPayload: ItemId | null): SnapshotNode | null {
    if (node.TrashedAt) {
      trace.ExcludedTrashed.push(node.Id);
      return null;
    }
    if (node.IsMirror) trace.FlattenedMirrors.push(node.Id);
    trace.IncludedIds.push(node.Id);
    trace.NodeCount += 1;
    const out: SnapshotNode = {
      Id: node.Id,
      ParentId: parentIdInPayload,
      ItemType: node.ItemType,
      Title: node.Title,
      Children: [],
    };
    const kids = childrenOf.get(node.Id) ?? [];
    for (const k of kids) {
      const child = build(k, node.Id);
      if (child) out.Children.push(child);
    }
    return out;
  }

  const tree = build(root, null);
  if (!tree) {
    return { Error: { Code: "ERR_PARENT_NOT_FOUND", Status: 404, Message: "Root is trashed" } };
  }
  if (trace.NodeCount > SIZE_CAP) {
    return {
      Error: {
        Code: "ERR_TEMPLATE_TOO_LARGE",
        Status: 413,
        Message: `Snapshot has ${trace.NodeCount} nodes, exceeds cap ${SIZE_CAP}`,
      },
    };
  }
  const payload: TemplatePayload = {
    Version: 1,
    Root: tree,
    NodeCount: trace.NodeCount,
    TakenAt: nowIso(),
    SourceRootId: rootId,
  };
  return { Payload: payload, Trace: trace };
}

export function createTemplate(
  items: Item[],
  rootId: ItemId,
  name: string,
  authorOwnerId: string,
): { Template: Template; Trace: SnapshotTrace } | { Error: ApplyError } {
  const r = takeSnapshot(items, rootId);
  if ("Error" in r) return { Error: r.Error };
  const t: Template = {
    Id: uuid("t"),
    Name: name,
    AuthorOwnerId: authorOwnerId,
    CreatedAt: nowIso(),
    PayloadJson: JSON.stringify(r.Payload),
  };
  return { Template: t, Trace: r.Trace };
}

// ─────────────────────────────────────────────────────────────────────
// Apply — DFS clone with fresh UUIDs + ownership rewrite
// ─────────────────────────────────────────────────────────────────────

export interface ApplyTrace {
  IdMap: Record<ItemId, ItemId>;
  Order: ItemId[];        // original ids in insert order
  CountInserted: number;
}

export function applyTemplate(
  template: Template,
  targetParentId: ItemId,
  ownerId: string,
  existingItems: Item[],
): { Result: ApplyResult; Trace: ApplyTrace } | { Error: ApplyError } {
  const targetParent = existingItems.find((i) => i.Id === targetParentId);
  if (!targetParent) {
    return {
      Error: { Code: "ERR_PARENT_NOT_FOUND", Status: 404, Message: `Target parent ${targetParentId} missing` },
    };
  }
  if (targetParent.TrashedAt) {
    return {
      Error: { Code: "ERR_FORBIDDEN", Status: 403, Message: "Target parent is trashed" },
    };
  }
  const payload: TemplatePayload = JSON.parse(template.PayloadJson);
  const idMap: Record<ItemId, ItemId> = {};
  const order: ItemId[] = [];
  const newItems: Item[] = [];

  function clone(node: SnapshotNode, parentNew: ItemId): ItemId {
    const newId = uuid("i");
    idMap[node.Id] = newId;
    order.push(node.Id);
    newItems.push({
      Id: newId,
      ParentId: parentNew,
      OwnerId: ownerId,                 // §2: always instantiator
      ItemType: node.ItemType,
      Title: node.Title,
      IsMirror: false,                  // §1 / AT-TPL-04: mirrors collapse
      PeerGroupId: null,
      TrashedAt: null,
      CreatedAt: nowIso(),
      UpdatedAt: nowIso(),
    });
    for (const k of node.Children) clone(k, newId);
    return newId;
  }

  const rootNew = clone(payload.Root, targetParentId);

  return {
    Result: { RootId: rootNew, NewItems: newItems, IdMap: idMap },
    Trace: { IdMap: idMap, Order: order, CountInserted: newItems.length },
  };
}

// ─────────────────────────────────────────────────────────────────────
// Convenience: mutate template payload (proves AT-TPL-02 — no propagation)
// ─────────────────────────────────────────────────────────────────────

export function mutateTemplatePayload(
  template: Template,
  mutator: (payload: TemplatePayload) => void,
): Template {
  const p: TemplatePayload = JSON.parse(template.PayloadJson);
  mutator(p);
  return { ...template, PayloadJson: JSON.stringify(p) };
}

// ─────────────────────────────────────────────────────────────────────
// Seed fixture
// ─────────────────────────────────────────────────────────────────────

export function seedFixture(): { items: Item[]; rootId: ItemId; targetId: ItemId } {
  resetClock();
  const mk = (
    id: string,
    parent: string | null,
    type: ItemType,
    title: string,
    extra: Partial<Item> = {},
  ): Item => ({
    Id: id,
    ParentId: parent,
    OwnerId: "alice",
    ItemType: type,
    Title: title,
    CreatedAt: nowIso(),
    UpdatedAt: nowIso(),
    ...extra,
  });
  const items: Item[] = [
    mk("workspace", null, "H1", "Workspace"),
    mk("src_root", "workspace", "H1", "Sprint Template Source"),
    mk("src_a", "src_root", "H2", "Goals"),
    mk("src_a1", "src_a", "Bullet", "Ship beta"),
    mk("src_a2", "src_a", "Bullet", "Collect feedback"),
    mk("src_b", "src_root", "H2", "Tasks"),
    mk("src_b1", "src_b", "Todo", "Write spec"),
    mk("src_b2", "src_b", "Todo", "Mirror of canonical task", { IsMirror: true, PeerGroupId: "g1" }),
    mk("src_b3", "src_b", "Todo", "Trashed task (excluded)", { TrashedAt: nowIso() }),
    mk("src_c", "src_root", "Paragraph", "Notes"),
    mk("target", "workspace", "H1", "Project Beta (target)"),
  ];
  return { items, rootId: "src_root", targetId: "target" };
}
