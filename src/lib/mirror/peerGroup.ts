// Mirror peer-group reference impl — spec/31-app/01-features/09b-mirror-peer-group-model.md
//
// Faithful in-memory implementation of the five rules:
//   R-1  A mirror is membership in a peer group; all peers are equal.
//   R-2  Creating a mirror promotes BOTH the originator and the new peer to members.
//   R-3  Detach removes one member; group dissolves when size drops to 1.
//   R-4  Edits to canonical content (Title/Notes/etc.) flow read-through;
//        per-instance state is ParentItemId + FractionalIndex + IsCollapsed.
//   R-5  LWW tiebreak by (ServerTs DESC, OwnerId ASC, ItemId ASC).

export type ItemId = number;
export type GroupId = number;

export interface PeerItem {
  ItemId: ItemId;
  ParentItemId: ItemId | null;
  OwnerId: string;
  ItemType: "Bullet" | "Todo" | "H1" | "H2" | "Paragraph";
  /** Canonical content lives only on the canonical row; other peers store "" and read-through. */
  Content: string;
  Note: string;
  CompletedAt: string | null;
  FractionalIndex: string;
  /** Per-instance UI state (NOT synced across peers). */
  IsCollapsed: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  ServerTs: number;
}

export interface MirrorGroup {
  MirrorGroupId: GroupId;
  CanonicalItemId: ItemId;
  CreatedAt: string;
}

export interface MirrorMember {
  MirrorGroupId: GroupId;
  ItemId: ItemId;
  JoinedAt: string;
}

export type EventKind =
  | "item.created"
  | "item.edited"
  | "item.collapsed"
  | "item.deleted"
  | "mirror.group.created"
  | "mirror.member.added"
  | "mirror.member.removed"
  | "mirror.group.dissolved"
  | "mirror.canonical.promoted"
  | "mirror.cycle.blocked"
  | "mirror.duplicate.blocked";

export interface PeerEvent {
  Id: number;
  Kind: EventKind;
  At: string;
  Payload: Record<string, unknown>;
  Note: string;
}

interface State {
  items: Map<ItemId, PeerItem>;
  groups: Map<GroupId, MirrorGroup>;
  members: MirrorMember[];           // (group, item) pairs; UNIQUE on each axis
  events: PeerEvent[];
  nextItemId: number;
  nextGroupId: number;
  nextEventId: number;
  serverClock: number;
}

const state: State = {
  items: new Map(),
  groups: new Map(),
  members: [],
  events: [],
  nextItemId: 1,
  nextGroupId: 1,
  nextEventId: 1,
  serverClock: 1,
};

const subs = new Set<() => void>();
function notify() { for (const fn of subs) fn(); }
export function subscribe(fn: () => void): () => void {
  subs.add(fn);
  return () => { subs.delete(fn); };
}

function nowIso() { return new Date().toISOString(); }
function fi(n: number): string { return `a${n.toString(36).padStart(4, "0")}`; }

function logEvent(kind: EventKind, payload: Record<string, unknown>, note: string) {
  state.events.unshift({
    Id: state.nextEventId++,
    Kind: kind,
    At: nowIso(),
    Payload: payload,
    Note: note,
  });
  if (state.events.length > 200) state.events.length = 200;
}

// ---------------------------------------------------------------------------
// Read-side
// ---------------------------------------------------------------------------

export function getState() {
  return {
    items: Array.from(state.items.values()).sort((a, b) => a.ItemId - b.ItemId),
    groups: Array.from(state.groups.values()),
    members: state.members.slice(),
    events: state.events.slice(),
  };
}

export function groupOf(id: ItemId): GroupId | null {
  const m = state.members.find((x) => x.ItemId === id);
  return m ? m.MirrorGroupId : null;
}

export function peersOf(id: ItemId): PeerItem[] {
  const g = groupOf(id);
  if (g === null) return [];
  return state.members
    .filter((m) => m.MirrorGroupId === g)
    .map((m) => state.items.get(m.ItemId)!)
    .filter(Boolean);
}

export function canonicalFor(id: ItemId): PeerItem | null {
  const g = groupOf(id);
  if (g === null) return state.items.get(id) ?? null;
  const grp = state.groups.get(g)!;
  return state.items.get(grp.CanonicalItemId) ?? null;
}

/** Render a peer through the read-through lens — Content/Note from canonical, position from peer. */
export function readThrough(id: ItemId): PeerItem | null {
  const peer = state.items.get(id);
  if (!peer) return null;
  const c = canonicalFor(id);
  if (!c || c.ItemId === peer.ItemId) return peer;
  return {
    ...peer,
    Content: c.Content,
    Note: c.Note,
    CompletedAt: c.CompletedAt,
    ItemType: c.ItemType,
  };
}

export function isMirror(id: ItemId): boolean {
  const g = groupOf(id);
  if (g === null) return false;
  return state.members.filter((m) => m.MirrorGroupId === g).length >= 2;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isDescendantOrSelf(candidateAncestor: ItemId, candidateDescendant: ItemId): boolean {
  let cur: ItemId | null = candidateDescendant;
  let safety = 1000;
  while (cur !== null && safety-- > 0) {
    if (cur === candidateAncestor) return true;
    const item = state.items.get(cur);
    cur = item ? item.ParentItemId : null;
  }
  return false;
}

function dissolveIfSingleton(groupId: GroupId): boolean {
  const remaining = state.members.filter((m) => m.MirrorGroupId === groupId);
  if (remaining.length === 1) {
    // Drop the lone member row AND the group → trg_mirrorgroup_dissolve_on_singleton
    const lone = remaining[0];
    state.members = state.members.filter((m) => m.MirrorGroupId !== groupId);
    state.groups.delete(groupId);
    logEvent("mirror.group.dissolved", { MirrorGroupId: groupId, LoneItemId: lone.ItemId },
      `Group ${groupId} dropped to size 1 → dissolved by trigger; item ${lone.ItemId} is now a regular item.`);
    return true;
  }
  return false;
}

function promoteCanonicalIfNeeded(groupId: GroupId, removedItemId: ItemId, oldCanonical: PeerItem) {
  const grp = state.groups.get(groupId);
  if (!grp) return;
  if (grp.CanonicalItemId !== removedItemId) return;
  // Promote next-lowest ItemId in the group; carry over content from old canonical
  // because the deprecated row's content lived only there.
  const survivors = state.members
    .filter((m) => m.MirrorGroupId === groupId)
    .map((m) => m.ItemId)
    .sort((a, b) => a - b);
  const nextId = survivors[0];
  if (nextId === undefined) return;
  grp.CanonicalItemId = nextId;
  const next = state.items.get(nextId);
  if (next) {
    next.Content = oldCanonical.Content;
    next.Note = oldCanonical.Note;
    next.CompletedAt = oldCanonical.CompletedAt;
    next.ItemType = oldCanonical.ItemType;
    next.UpdatedAt = nowIso();
    next.ServerTs = ++state.serverClock;
  }
  logEvent("mirror.canonical.promoted",
    { MirrorGroupId: groupId, FromItemId: removedItemId, ToItemId: nextId },
    `Canonical row deleted — promoted lowest surviving ItemId ${nextId} and copied content over.`);
}

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

export interface CreateInput {
  ParentItemId: ItemId | null;
  Content: string;
  ItemType?: PeerItem["ItemType"];
  OwnerId?: string;
}

export function createItem(input: CreateInput): PeerItem {
  const id = state.nextItemId++;
  const item: PeerItem = {
    ItemId: id,
    ParentItemId: input.ParentItemId,
    OwnerId: input.OwnerId ?? "u1",
    ItemType: input.ItemType ?? "Bullet",
    Content: input.Content,
    Note: "",
    CompletedAt: null,
    FractionalIndex: fi(id),
    IsCollapsed: false,
    CreatedAt: nowIso(),
    UpdatedAt: nowIso(),
    ServerTs: ++state.serverClock,
  };
  state.items.set(id, item);
  logEvent("item.created", { ItemId: id, ParentItemId: item.ParentItemId, Content: item.Content },
    `Created regular item ${id} ("${item.Content}") under parent ${item.ParentItemId ?? "root"}.`);
  notify();
  return item;
}

export interface MirrorResult {
  Status: "success" | "error";
  Code?: "ERR_CYCLE" | "ERR_DUPLICATE_PEER";
  GroupId?: GroupId;
  NewItemId?: ItemId;
  Message?: string;
}

/** §6.1 Create — `/mirror to`. Implements R-1, R-2, AT-MPG-01, AT-MPG-10, edge case 2. */
export function createMirror(originatingItemId: ItemId, targetParentItemId: ItemId | null): MirrorResult {
  const origin = state.items.get(originatingItemId);
  if (!origin) return { Status: "error", Message: "Originating item not found" };

  // AT-MPG-10: cycle guard
  if (targetParentItemId !== null && isDescendantOrSelf(originatingItemId, targetParentItemId)) {
    logEvent("mirror.cycle.blocked",
      { OriginatingItemId: originatingItemId, TargetParentItemId: targetParentItemId },
      `Blocked: cannot mirror item ${originatingItemId} into itself or its descendants (ERR_CYCLE).`);
    notify();
    return { Status: "error", Code: "ERR_CYCLE", Message: "Cannot mirror an item into itself or its descendants" };
  }

  // Edge case 2: already-peered in this parent
  let groupId = groupOf(originatingItemId);
  if (groupId !== null) {
    const peerInTarget = state.members
      .filter((m) => m.MirrorGroupId === groupId)
      .some((m) => state.items.get(m.ItemId)?.ParentItemId === targetParentItemId);
    if (peerInTarget) {
      logEvent("mirror.duplicate.blocked",
        { OriginatingItemId: originatingItemId, TargetParentItemId: targetParentItemId },
        `Blocked: a peer of item ${originatingItemId} already exists under parent ${targetParentItemId ?? "root"}.`);
      notify();
      return { Status: "error", Code: "ERR_DUPLICATE_PEER", Message: "Already mirrored in this location" };
    }
  }

  // Step 1: ensure a group exists, with origin as a member.
  if (groupId === null) {
    groupId = state.nextGroupId++;
    state.groups.set(groupId, {
      MirrorGroupId: groupId,
      CanonicalItemId: originatingItemId,            // §3 lowest-ItemId convention
      CreatedAt: nowIso(),
    });
    state.members.push({ MirrorGroupId: groupId, ItemId: originatingItemId, JoinedAt: nowIso() });
    logEvent("mirror.group.created",
      { MirrorGroupId: groupId, CanonicalItemId: originatingItemId },
      `Created MirrorGroup ${groupId} with canonical item ${originatingItemId}.`);
  }

  // Step 2: insert the new peer Item with empty Content (read-through).
  const newId = state.nextItemId++;
  const newPeer: PeerItem = {
    ItemId: newId,
    ParentItemId: targetParentItemId,
    OwnerId: origin.OwnerId,
    ItemType: origin.ItemType,
    Content: "",                                     // §6.1 step 2
    Note: "",
    CompletedAt: null,
    FractionalIndex: fi(newId),
    IsCollapsed: false,
    CreatedAt: nowIso(),
    UpdatedAt: nowIso(),
    ServerTs: ++state.serverClock,
  };
  state.items.set(newId, newPeer);
  state.members.push({ MirrorGroupId: groupId, ItemId: newId, JoinedAt: nowIso() });
  logEvent("mirror.member.added",
    { MirrorGroupId: groupId, NewItemId: newId, OriginatingItemId: originatingItemId },
    `Added peer ${newId} to group ${groupId}. Diamond ◇ now renders on all peers.`);
  notify();
  return { Status: "success", GroupId: groupId, NewItemId: newId };
}

/** §6.2 Detach — context menu "Detach mirror". Implements R-3, AT-MPG-04, AT-MPG-05. */
export function detachMirror(itemId: ItemId): { Status: "success" | "error"; Dissolved?: boolean } {
  const groupId = groupOf(itemId);
  if (groupId === null) return { Status: "error" };
  const peer = state.items.get(itemId);
  const c = canonicalFor(itemId);
  if (!peer || !c) return { Status: "error" };

  // Detached peer keeps a copy of the canonical content (it stops reading through).
  peer.Content = c.Content;
  peer.Note = c.Note;
  peer.CompletedAt = c.CompletedAt;
  peer.ItemType = c.ItemType;
  peer.UpdatedAt = nowIso();
  peer.ServerTs = ++state.serverClock;

  state.members = state.members.filter(
    (m) => !(m.MirrorGroupId === groupId && m.ItemId === itemId),
  );
  logEvent("mirror.member.removed",
    { MirrorGroupId: groupId, ItemId: itemId },
    `Detached item ${itemId} from group ${groupId}; copied content over to make it standalone.`);

  const dissolved = dissolveIfSingleton(groupId);
  notify();
  return { Status: "success", Dissolved: dissolved };
}

/** Edit canonical content (R-4 read-through propagation). */
export function editContent(itemId: ItemId, content: string) {
  const c = canonicalFor(itemId);
  if (!c) return;
  c.Content = content;
  c.UpdatedAt = nowIso();
  c.ServerTs = ++state.serverClock;
  const peers = peersOf(itemId);
  logEvent("item.edited",
    { ItemId: c.ItemId, GroupId: groupOf(itemId), PeerCount: peers.length || 1 },
    peers.length >= 2
      ? `Edited canonical row ${c.ItemId} → ${peers.length} peers re-render (read-through).`
      : `Edited item ${c.ItemId}.`);
  notify();
}

/** Per-instance collapse toggle (R-4 isolation, AT-MPG-07). */
export function toggleCollapse(itemId: ItemId) {
  const peer = state.items.get(itemId);
  if (!peer) return;
  peer.IsCollapsed = !peer.IsCollapsed;
  peer.UpdatedAt = nowIso();
  logEvent("item.collapsed", { ItemId: itemId, IsCollapsed: peer.IsCollapsed },
    `Toggled collapse on peer ${itemId} only — other peers unchanged.`);
  notify();
}

/** Hard-delete (used to demo AT-MPG-08 canonical promotion). */
export function deleteItem(itemId: ItemId) {
  const peer = state.items.get(itemId);
  if (!peer) return;
  const groupId = groupOf(itemId);
  const oldCanonical = canonicalFor(itemId);

  state.items.delete(itemId);
  if (groupId !== null) {
    state.members = state.members.filter(
      (m) => !(m.MirrorGroupId === groupId && m.ItemId === itemId),
    );
  }
  logEvent("item.deleted", { ItemId: itemId, GroupId: groupId },
    `Deleted item ${itemId}.`);

  if (groupId !== null && oldCanonical && oldCanonical.ItemId === itemId) {
    promoteCanonicalIfNeeded(groupId, itemId, oldCanonical);
  }
  if (groupId !== null) dissolveIfSingleton(groupId);
  notify();
}

// ---------------------------------------------------------------------------
// Seeds + reset
// ---------------------------------------------------------------------------

export function reset() {
  state.items.clear();
  state.groups.clear();
  state.members.length = 0;
  state.events.length = 0;
  state.nextItemId = 1;
  state.nextGroupId = 1;
  state.nextEventId = 1;
  state.serverClock = 1;
  notify();
}

export function seedDefault() {
  reset();
  const home = createItem({ ParentItemId: null, Content: "Home" });
  const work = createItem({ ParentItemId: null, Content: "Work" });
  const inbox = createItem({ ParentItemId: null, Content: "Inbox" });
  createItem({ ParentItemId: home.ItemId, Content: "Q3 roadmap" });
  const ship = createItem({ ParentItemId: work.ItemId, Content: "Ship invoice fix" });
  createItem({ ParentItemId: inbox.ItemId, Content: "Reply to Alice" });
  // Pre-built peer group: 3 mirrors of "Ship invoice fix" — Home and Inbox.
  createMirror(ship.ItemId, home.ItemId);
  createMirror(ship.ItemId, inbox.ItemId);
}

// Auto-seed on module load.
if (state.items.size === 0) seedDefault();
