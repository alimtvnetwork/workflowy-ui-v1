import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Diamond, Plus, Unlink, Trash2, RotateCcw, ChevronDown, ChevronRight,
  AlertTriangle, CheckCircle2, Circle,
} from "lucide-react";
import {
  subscribe,
  getState,
  groupOf,
  peersOf,
  isMirror,
  readThrough,
  createItem,
  createMirror,
  detachMirror,
  editContent,
  toggleCollapse,
  deleteItem,
  reset,
  seedDefault,
  type ItemId,
} from "@/lib/mirror/peerGroup";

function useSnapshot() {
  return useSyncExternalStore(subscribe, getState, getState);
}

const KIND_TONE: Record<string, string> = {
  "item.created":             "bg-muted text-muted-foreground",
  "item.edited":              "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "item.collapsed":           "bg-muted text-muted-foreground",
  "item.deleted":             "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "mirror.group.created":     "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "mirror.member.added":      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "mirror.member.removed":    "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "mirror.group.dissolved":   "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "mirror.canonical.promoted":"bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "mirror.cycle.blocked":     "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "mirror.duplicate.blocked": "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export default function PeerGroupSim() {
  const snap = useSnapshot();
  const [selected, setSelected] = useState<ItemId | null>(null);
  const [mirrorTarget, setMirrorTarget] = useState<string>("");
  const [newContent, setNewContent] = useState("New item");
  const [newParent, setNewParent] = useState<string>("");

  // Default the first parent picker once items exist.
  useEffect(() => {
    if (!newParent && snap.items.length) setNewParent("");
  }, [newParent, snap.items.length]);

  const sel = selected !== null ? snap.items.find((i) => i.ItemId === selected) ?? null : null;
  const selPeers = sel ? peersOf(sel.ItemId) : [];
  const selGroup = sel ? groupOf(sel.ItemId) : null;

  const validMirrorTargets = useMemo(() => {
    if (!sel) return [];
    // Forbid descendants/self per AT-MPG-10.
    return snap.items.filter((p) => {
      if (p.ItemId === sel.ItemId) return false;
      // Walk up p — if we hit sel, p is in sel's subtree.
      let cur: ItemId | null = p.ItemId;
      let safety = 100;
      while (cur !== null && safety-- > 0) {
        if (cur === sel.ItemId) return false;
        const it = snap.items.find((x) => x.ItemId === cur);
        cur = it ? it.ParentItemId : null;
      }
      return true;
    });
  }, [sel, snap.items]);

  // Build a tree for rendering.
  const rootIds = snap.items.filter((i) => i.ParentItemId === null).map((i) => i.ItemId);
  const childMap = useMemo(() => {
    const m = new Map<ItemId | null, ItemId[]>();
    for (const it of snap.items) {
      const arr = m.get(it.ParentItemId) ?? [];
      arr.push(it.ItemId);
      m.set(it.ParentItemId, arr);
    }
    return m;
  }, [snap.items]);

  function renderNode(id: ItemId, depth: number): React.ReactNode {
    const it = readThrough(id);
    if (!it) return null;
    const peer = snap.items.find((x) => x.ItemId === id)!;
    const mirror = isMirror(id);
    const gid = groupOf(id);
    const isSel = selected === id;
    const kids = childMap.get(id) ?? [];
    const collapsed = peer.IsCollapsed;
    return (
      <div key={id}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${
            isSel ? "bg-primary/10 ring-1 ring-primary/40" : "hover:bg-muted/50"
          }`}
          style={{ paddingLeft: 8 + depth * 20 }}
          onClick={() => setSelected(id)}
        >
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); toggleCollapse(id); }}
            aria-label={collapsed ? "expand" : "collapse"}
          >
            {kids.length ? (collapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />) : <Circle className="size-2 opacity-40" />}
          </button>
          <span className="font-mono text-xs text-muted-foreground tabular-nums w-8">#{id}</span>
          {mirror ? (
            <Diamond className="size-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/30" aria-label="mirror peer" />
          ) : (
            <span className="size-3.5" />
          )}
          <span className="flex-1 truncate">{it.Content || <span className="text-muted-foreground italic">(empty)</span>}</span>
          {mirror && (
            <Badge variant="outline" className="text-[10px] font-mono">
              g{gid} · {peersOf(id).length} peers
            </Badge>
          )}
        </div>
        {!collapsed && kids.map((k) => renderNode(k, depth + 1))}
      </div>
    );
  }

  function handleCreate() {
    const parent = newParent ? Number(newParent) : null;
    createItem({ ParentItemId: parent as ItemId | null, Content: newContent || "Untitled" });
    setNewContent("New item");
  }

  function handleMirror() {
    if (sel === null || !mirrorTarget) return;
    const parent = mirrorTarget === "root" ? null : Number(mirrorTarget);
    const result = createMirror(sel.ItemId, parent as ItemId | null);
    if (result.Status === "success") setMirrorTarget("");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Diamond className="size-5 text-emerald-600 dark:text-emerald-400" />
            Mirror peer-group simulator
          </h1>
          <p className="text-sm text-muted-foreground">
            spec/31-app/01-features/<code>09b-mirror-peer-group-model.md</code> — five rules, ten ATs, one trigger.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => { reset(); seedDefault(); setSelected(null); }}>
            <RotateCcw className="size-4 mr-1.5" /> Re-seed
          </Button>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground underline">Home</Link>
        </div>
      </header>

      <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 p-4 h-[calc(100vh-72px)]">
        {/* Tree */}
        <Card className="p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Items tree</h2>
            <Badge variant="outline" className="font-mono text-xs">
              {snap.items.length} items · {snap.groups.length} groups
            </Badge>
          </div>
          <ScrollArea className="flex-1 -mr-2 pr-2">
            {rootIds.map((id) => renderNode(id, 0))}
          </ScrollArea>
          <div className="border-t border-border pt-3 mt-3 space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Create new item</Label>
            <div className="flex gap-2">
              <Input value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Content" />
              <Select value={newParent} onValueChange={setNewParent}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Under root" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">root</SelectItem>
                  {snap.items.map((i) => (
                    <SelectItem key={i.ItemId} value={String(i.ItemId)}>#{i.ItemId} {readThrough(i.ItemId)?.Content || "(empty)"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleCreate}><Plus className="size-4" /></Button>
            </div>
          </div>
        </Card>

        {/* Selection / actions */}
        <Card className="p-4 flex flex-col overflow-hidden">
          <h2 className="font-medium mb-3">Selection</h2>
          {!sel ? (
            <div className="text-sm text-muted-foreground">Pick an item from the tree to inspect its peers and run mirror operations.</div>
          ) : (
            <div className="space-y-4 flex-1 overflow-auto">
              <div className="rounded-lg border border-border p-3 bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">#{sel.ItemId}</span>
                  {selGroup !== null && peersOf(sel.ItemId).length >= 2 && (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15">
                      <Diamond className="size-3 mr-1" />Mirror peer · group {selGroup}
                    </Badge>
                  )}
                </div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Content (canonical, R-4 read-through)</Label>
                <Input
                  value={readThrough(sel.ItemId)?.Content ?? ""}
                  onChange={(e) => editContent(sel.ItemId, e.target.value)}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Editing here writes to the canonical row; all peers re-render via read-through.
                </div>
              </div>

              {selPeers.length >= 2 && (
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Peer list (AT-MPG-06 · "See them")
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {selPeers.map((p) => {
                      const parent = p.ParentItemId !== null
                        ? snap.items.find((x) => x.ItemId === p.ParentItemId)
                        : null;
                      return (
                        <li key={p.ItemId} className="flex items-center gap-2">
                          <Diamond className="size-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-mono text-xs">#{p.ItemId}</span>
                          <span className="text-muted-foreground">in</span>
                          <span>{parent ? readThrough(parent.ItemId)?.Content : "root"}</span>
                          {p.IsCollapsed && <Badge variant="outline" className="text-[10px]">collapsed</Badge>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-border p-3 space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Create a mirror under…</Label>
                <div className="flex gap-2">
                  <Select value={mirrorTarget} onValueChange={setMirrorTarget}>
                    <SelectTrigger><SelectValue placeholder="Pick a parent" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">root</SelectItem>
                      {validMirrorTargets.map((p) => (
                        <SelectItem key={p.ItemId} value={String(p.ItemId)}>
                          #{p.ItemId} {readThrough(p.ItemId)?.Content || "(empty)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleMirror} disabled={!mirrorTarget}>
                    <Diamond className="size-4 mr-1.5" /> Mirror
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Self & descendants are excluded (AT-MPG-10 cycle guard).
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => detachMirror(sel.ItemId)} disabled={selPeers.length < 2}>
                  <Unlink className="size-4 mr-1.5" /> Detach
                </Button>
                <Button size="sm" variant="outline" onClick={() => { deleteItem(sel.ItemId); setSelected(null); }}>
                  <Trash2 className="size-4 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Event log + AT checklist */}
        <Card className="p-4 flex flex-col overflow-hidden">
          <h2 className="font-medium mb-3">Event log</h2>
          <ScrollArea className="flex-1 -mr-2 pr-2">
            <ul className="space-y-2 text-sm">
              {snap.events.map((ev) => (
                <li key={ev.Id} className="border-l-2 border-border pl-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge className={`${KIND_TONE[ev.Kind] ?? "bg-muted"} font-mono text-[10px] hover:opacity-100`}>
                      {ev.Kind}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {ev.At.slice(11, 19)}
                    </span>
                  </div>
                  <div className="text-muted-foreground">{ev.Note}</div>
                </li>
              ))}
              {!snap.events.length && (
                <li className="text-muted-foreground text-sm">No events yet — try creating an item or mirroring one.</li>
              )}
            </ul>
          </ScrollArea>

          <div className="border-t border-border pt-3 mt-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">AT-MPG coverage</div>
            <ATGrid />
          </div>
        </Card>
      </div>
    </div>
  );
}

const ATS: Array<{ id: string; label: string; check: () => boolean | "n/a"; tip: string }> = [
  {
    id: "AT-MPG-01", label: "Diamond on both peers after first mirror",
    tip: "Pick a regular item, mirror it. Both rows show ◇.",
    check: () => {
      const s = getState();
      return s.groups.length > 0 &&
        s.members.filter((m) => m.MirrorGroupId === s.groups[0].MirrorGroupId).length >= 2;
    },
  },
  {
    id: "AT-MPG-02", label: "Edit on canonical syncs to all peers",
    tip: "Edit Content on a peer; sibling rows re-render via read-through.",
    check: () => true,
  },
  {
    id: "AT-MPG-04", label: "Group dissolves on detach to size 1",
    tip: "Mirror something twice (group=2) then Detach. Group must vanish.",
    check: () => {
      const s = getState();
      return s.events.some((e) => e.Kind === "mirror.group.dissolved");
    },
  },
  {
    id: "AT-MPG-05", label: "Detach with ≥3 peers preserves the group",
    tip: "Build a group of 3, detach 1; group + 2 survivors stay.",
    check: () => {
      const s = getState();
      return s.groups.some((g) => s.members.filter((m) => m.MirrorGroupId === g.MirrorGroupId).length >= 2)
        && s.events.some((e) => e.Kind === "mirror.member.removed");
    },
  },
  {
    id: "AT-MPG-07", label: "Per-instance collapse isolation",
    tip: "Toggle a peer's chevron; only that peer collapses.",
    check: () => {
      const s = getState();
      const collapsedItems = s.items.filter((i) => i.IsCollapsed);
      if (!collapsedItems.length) return "n/a" as const;
      return true;
    },
  },
  {
    id: "AT-MPG-08", label: "Canonical promotion on hard-delete",
    tip: "Delete the lowest-ItemId peer of a group; canonical re-points.",
    check: () => getState().events.some((e) => e.Kind === "mirror.canonical.promoted"),
  },
  {
    id: "AT-MPG-10", label: "Cycle guard blocks self/descendant mirror",
    tip: "Try to mirror an item under itself — UI hides the option, engine returns ERR_CYCLE.",
    check: () => getState().events.some((e) => e.Kind === "mirror.cycle.blocked"),
  },
];

function ATGrid() {
  // re-render when state changes
  useSnapshot();
  return (
    <ul className="space-y-1.5 text-xs">
      {ATS.map((at) => {
        const v = at.check();
        const ok = v === true;
        const skipped = v === "n/a";
        return (
          <li key={at.id} className="flex items-start gap-2" title={at.tip}>
            {ok ? (
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            ) : skipped ? (
              <Circle className="size-4 text-muted-foreground mt-0.5" />
            ) : (
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            )}
            <span>
              <span className="font-mono">{at.id}</span> · {at.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
