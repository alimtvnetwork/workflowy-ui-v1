import { useMemo, useState } from "react";
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
  FileText, Camera, Upload, RotateCcw, AlertTriangle, CheckCircle2,
  Trash2, Diamond, ChevronRight,
} from "lucide-react";
import {
  applyTemplate, createTemplate, mutateTemplatePayload, seedFixture,
  type Item, type Template, type TemplatePayload, type SnapshotTrace, type ApplyTrace,
} from "@/lib/template/templateEngine";

interface LogEntry {
  id: number;
  kind: string;
  text: string;
  tone: string;
}

let _logId = 0;
const newLogId = () => (_logId += 1);

const KIND_TONE: Record<string, string> = {
  "snapshot.taken":        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "snapshot.flatten":      "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "snapshot.exclude":      "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "snapshot.error":        "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "apply.success":         "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "apply.error":           "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "template.edit":         "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "instance.edit":         "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "divergence.confirmed":  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};

function ItemRow({ item, depth, allItems, highlight }: {
  item: Item; depth: number; allItems: Item[]; highlight?: Set<string>;
}) {
  const kids = allItems.filter((c) => c.ParentId === item.Id);
  const trashed = !!item.TrashedAt;
  const isMirror = !!item.IsMirror;
  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded text-sm ${
          highlight?.has(item.Id) ? "bg-violet-500/10" : ""
        } ${trashed ? "opacity-50 line-through" : ""}`}
        style={{ paddingLeft: depth * 16 + 8 }}
      >
        {isMirror ? <Diamond className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3 text-muted-foreground" />}
        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{item.ItemType}</Badge>
        <span className="font-mono text-xs text-muted-foreground">{item.Id}</span>
        <span className="flex-1 truncate">{item.Title}</span>
        <span className="text-[10px] text-muted-foreground">{item.OwnerId}</span>
      </div>
      {kids.map((k) => (
        <ItemRow key={k.Id} item={k} depth={depth + 1} allItems={allItems} highlight={highlight} />
      ))}
    </div>
  );
}

function PayloadTree({ node, depth = 0 }: { node: TemplatePayload["Root"]; depth?: number }) {
  return (
    <div>
      <div
        className="flex items-center gap-2 py-0.5 text-xs"
        style={{ paddingLeft: depth * 14 }}
      >
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{node.ItemType}</Badge>
        <span className="font-mono text-muted-foreground">{node.Id}</span>
        <span>{node.Title}</span>
      </div>
      {node.Children.map((c) => <PayloadTree key={c.Id} node={c} depth={depth + 1} />)}
    </div>
  );
}

export default function TemplateSim() {
  const initial = useMemo(() => seedFixture(), []);
  const [items, setItems] = useState<Item[]>(initial.items);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [snapshotRoot, setSnapshotRoot] = useState<string>(initial.rootId);
  const [snapshotName, setSnapshotName] = useState<string>("Sprint Template");
  const [targetParent, setTargetParent] = useState<string>(initial.targetId);
  const [applyOwner, setApplyOwner] = useState<string>("bob");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastTrace, setLastTrace] = useState<SnapshotTrace | null>(null);
  const [lastApply, setLastApply] = useState<ApplyTrace | null>(null);
  const [highlight, setHighlight] = useState<Set<string>>(new Set());

  const tpl = templates.find((t) => t.Id === selectedTemplate);
  const tplPayload: TemplatePayload | null = tpl ? JSON.parse(tpl.PayloadJson) : null;

  function pushLog(kind: string, text: string) {
    setLog((l) => [{ id: newLogId(), kind, text, tone: KIND_TONE[kind] ?? "bg-muted text-muted-foreground" }, ...l].slice(0, 30));
  }

  function reset() {
    const seed = seedFixture();
    setItems(seed.items);
    setTemplates([]);
    setSelectedTemplate("");
    setSnapshotRoot(seed.rootId);
    setTargetParent(seed.targetId);
    setLog([]);
    setLastTrace(null);
    setLastApply(null);
    setHighlight(new Set());
  }

  function doSnapshot() {
    const r = createTemplate(items, snapshotRoot, snapshotName, "alice");
    if ("Error" in r) {
      pushLog("snapshot.error", `${r.Error.Code} ${r.Error.Status}: ${r.Error.Message}`);
      setLastTrace(null);
      return;
    }
    setTemplates((ts) => [...ts, r.Template]);
    setSelectedTemplate(r.Template.Id);
    setLastTrace(r.Trace);
    pushLog("snapshot.taken", `${r.Template.Name} — ${r.Trace.NodeCount} nodes captured`);
    if (r.Trace.FlattenedMirrors.length > 0) {
      pushLog("snapshot.flatten", `Flattened mirror(s): ${r.Trace.FlattenedMirrors.join(", ")} (AT-APP-TSNAP-02)`);
    }
    if (r.Trace.ExcludedTrashed.length > 0) {
      pushLog("snapshot.exclude", `Excluded trashed: ${r.Trace.ExcludedTrashed.join(", ")} (AT-APP-TSNAP-03)`);
    }
  }

  function doApply() {
    if (!tpl) return;
    const r = applyTemplate(tpl, targetParent, applyOwner, items);
    if ("Error" in r) {
      pushLog("apply.error", `${r.Error.Code} ${r.Error.Status}: ${r.Error.Message}`);
      return;
    }
    setItems((curr) => [...curr, ...r.Result.NewItems]);
    setLastApply(r.Trace);
    setHighlight(new Set(r.Result.NewItems.map((i) => i.Id)));
    pushLog("apply.success",
      `Inserted ${r.Trace.CountInserted} fresh rows under ${targetParent}, owner=${applyOwner} (AT-TPL-01/05)`);
  }

  function editTemplateTitle() {
    if (!tpl) return;
    const updated = mutateTemplatePayload(tpl, (p) => {
      p.Root.Title = p.Root.Title + " ✎";
    });
    setTemplates((ts) => ts.map((t) => (t.Id === tpl.Id ? updated : t)));
    pushLog("template.edit", `Edited template root title — instances unaffected`);
    pushLog("divergence.confirmed", `AT-TPL-02: source-template edits do NOT propagate`);
  }

  function editFirstInstance() {
    if (!lastApply) return;
    const firstNewId = Object.values(lastApply.IdMap)[0];
    setItems((curr) => curr.map((i) => i.Id === firstNewId
      ? { ...i, Title: i.Title + " ✎ (instance edit)" }
      : i,
    ));
    pushLog("instance.edit", `Edited instance ${firstNewId} — template payload unaffected`);
    pushLog("divergence.confirmed", `AT-TPL-03: instance edits do NOT propagate back`);
  }

  function trashFirstInstance() {
    if (!lastApply) return;
    const firstNewId = Object.values(lastApply.IdMap)[0];
    setItems((curr) => curr.map((i) => i.Id === firstNewId
      ? { ...i, TrashedAt: new Date().toISOString() }
      : i,
    ));
    pushLog("instance.edit", `Trashed instance ${firstNewId} — independent lifecycle (11b)`);
  }

  // Item picker options (only live items can be roots/targets)
  const liveItems = items.filter((i) => !i.TrashedAt);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5" /> Template Snapshot Simulator
          </h1>
          <p className="text-sm text-muted-foreground">
            Reference implementation of{" "}
            <code className="text-xs">spec/31-app/01-features/13b-templates-snapshot-semantics.md</code>{" "}
            — covers AT-TPL-01..05 + AT-APP-TSNAP-01..05.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Link to="/"><Button variant="ghost" size="sm">Home</Button></Link>
          <Link to="/peer-group-sim"><Button variant="ghost" size="sm">Peer-group</Button></Link>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr_1fr] gap-4 p-6">
        {/* LEFT — Live items + snapshot controls */}
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Live workspace items</Label>
              <Badge variant="outline" className="text-[10px]">{liveItems.length} live · {items.length - liveItems.length} trashed</Badge>
            </div>
            <ScrollArea className="h-[280px] border border-border rounded">
              <div className="p-1">
                {items.filter((i) => i.ParentId === null).map((root) => (
                  <ItemRow key={root.Id} item={root} depth={0} allItems={items} highlight={highlight} />
                ))}
              </div>
            </ScrollArea>
          </Card>

          <Card className="p-4 space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Camera className="w-4 h-4" /> 1 · Take snapshot (CreateTemplateSnapshot)
            </Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Source root</Label>
                <Select value={snapshotRoot} onValueChange={setSnapshotRoot}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {liveItems.map((i) => (
                      <SelectItem key={i.Id} value={i.Id} className="text-xs font-mono">
                        {i.Id} — {i.Title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Template name</Label>
                <Input className="h-8" value={snapshotName} onChange={(e) => setSnapshotName(e.target.value)} />
              </div>
              <Button size="sm" className="w-full" onClick={doSnapshot}>
                <Camera className="w-4 h-4 mr-1" /> Stamp snapshot
              </Button>
            </div>
            {lastTrace && (
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                <div>NodeCount: <span className="font-mono">{lastTrace.NodeCount}</span></div>
                <div>Included: <span className="font-mono">{lastTrace.IncludedIds.length}</span></div>
                <div className="text-amber-700 dark:text-amber-300">
                  Flattened mirrors: {lastTrace.FlattenedMirrors.length || "—"}
                </div>
                <div className="text-amber-700 dark:text-amber-300">
                  Excluded trashed: {lastTrace.ExcludedTrashed.length || "—"}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* MIDDLE — Templates + payload tree */}
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <Label className="text-sm font-semibold">Stored templates ({templates.length})</Label>
            {templates.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No templates yet — stamp one from the left.</p>
            ) : (
              <div className="space-y-1">
                {templates.map((t) => (
                  <button
                    key={t.Id}
                    onClick={() => setSelectedTemplate(t.Id)}
                    className={`w-full text-left p-2 rounded border text-xs ${
                      selectedTemplate === t.Id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t.Name}</span>
                      <Badge variant="outline" className="text-[10px]">{t.Id}</Badge>
                    </div>
                    <div className="text-muted-foreground text-[10px] mt-0.5">
                      author={t.AuthorOwnerId} · payload={t.PayloadJson.length}b
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {tplPayload && (
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Payload tree (immutable JSON)</Label>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={editTemplateTitle}>
                  Edit template root
                </Button>
              </div>
              <ScrollArea className="h-[260px] border border-border rounded p-2">
                <PayloadTree node={tplPayload.Root} />
              </ScrollArea>
              <div className="text-[10px] text-muted-foreground font-mono">
                v{tplPayload.Version} · {tplPayload.NodeCount} nodes · taken {tplPayload.TakenAt.slice(11, 19)}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT — Apply + divergence demo + log */}
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Upload className="w-4 h-4" /> 2 · Apply template (ApplyTemplate)
            </Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Target parent</Label>
                <Select value={targetParent} onValueChange={setTargetParent}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {liveItems.map((i) => (
                      <SelectItem key={i.Id} value={i.Id} className="text-xs font-mono">
                        {i.Id} — {i.Title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Instantiating user (auth.uid)</Label>
                <Select value={applyOwner} onValueChange={setApplyOwner}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">alice (template author)</SelectItem>
                    <SelectItem value="bob">bob (different user — proves AT-TPL-05)</SelectItem>
                    <SelectItem value="carol">carol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" className="w-full" disabled={!tpl} onClick={doApply}>
                <Upload className="w-4 h-4 mr-1" /> Apply (DFS clone, fresh UUIDs)
              </Button>
            </div>
            {lastApply && (
              <div className="text-xs space-y-1 pt-2 border-t border-border">
                <div className="text-muted-foreground">Inserted {lastApply.CountInserted} rows. ID re-stamping:</div>
                <ScrollArea className="h-[80px]">
                  <div className="font-mono text-[10px] space-y-0.5">
                    {Object.entries(lastApply.IdMap).map(([oldId, newId]) => (
                      <div key={oldId}>
                        <span className="text-muted-foreground">{oldId}</span>
                        <span className="mx-1">→</span>
                        <span className="text-primary">{newId}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Card>

          <Card className="p-4 space-y-2">
            <Label className="text-sm font-semibold">3 · Prove divergence</Label>
            <p className="text-xs text-muted-foreground">
              After applying, mutate either side to confirm the no-link invariant (§1).
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="text-xs" disabled={!tpl} onClick={editTemplateTitle}>
                <CheckCircle2 className="w-3 h-3 mr-1" /> Edit template
              </Button>
              <Button size="sm" variant="outline" className="text-xs" disabled={!lastApply} onClick={editFirstInstance}>
                <CheckCircle2 className="w-3 h-3 mr-1" /> Edit instance
              </Button>
              <Button size="sm" variant="outline" className="text-xs col-span-2" disabled={!lastApply} onClick={trashFirstInstance}>
                <Trash2 className="w-3 h-3 mr-1" /> Trash instance (11b independence)
              </Button>
            </div>
          </Card>

          <Card className="p-4 space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Activity log
            </Label>
            <ScrollArea className="h-[240px]">
              <div className="space-y-1 pr-2">
                {log.length === 0 && <p className="text-xs text-muted-foreground italic">No activity yet.</p>}
                {log.map((e) => (
                  <div key={e.id} className={`text-xs px-2 py-1 rounded ${e.tone}`}>
                    <span className="font-mono text-[10px] opacity-70 mr-2">{e.kind}</span>
                    {e.text}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-3 text-xs text-muted-foreground">
        Spec anchors: §1 Decision · §2 Instantiation algorithm · §3 AT-TPL-01..05 · Depth Coverage AT-APP-TSNAP-01..05.
      </footer>
    </div>
  );
}
