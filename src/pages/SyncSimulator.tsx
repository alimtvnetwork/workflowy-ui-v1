import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { applyOp, listItems, resetPlayground } from "@/lib/applyOp";
import type { Item } from "@/lib/applyOp/types";
import { syncQueue, type QueuedOp, type ResolutionStrategy } from "@/lib/applyOp/syncQueue";
import { virtualClock, type ClockState } from "@/lib/applyOp/virtualClock";
import { toast } from "sonner";
import { Plus, RotateCcw, Zap, AlertTriangle, Clock, Check, X, Play, Pause } from "lucide-react";

const statusColor: Record<QueuedOp["Status"], "default" | "secondary" | "destructive" | "outline"> = {
  queued: "secondary",
  "in-flight": "outline",
  applied: "default",
  conflict: "destructive",
  failed: "destructive",
};

export default function SyncSimulator() {
  const [items, setItems] = useState<Item[]>([]);
  const [queue, setQueue] = useState<QueuedOp[]>([]);
  const [latency, setLatency] = useState(syncQueue.latencyMs);
  const [armConflict, setArmConflict] = useState(syncQueue.injectConflictForNext);
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<string>("");
  const [editText, setEditText] = useState("");

  async function refresh() {
    const i = await listItems({ includeTrashed: false });
    setItems(i.Results);
  }

  useEffect(() => {
    refresh();
    return syncQueue.subscribe((snap) => {
      setQueue(snap);
      void refresh();
    });
  }, []);

  // Coalesced "N changes restored" toast — spec 14b §14b.4. When more than 3
  // local edits are silently overwritten within a 2s window, suppress the
  // per-event noise and surface a single rollup toast instead.
  useEffect(() => {
    let buffer: { ItemId: string; At: number }[] = [];
    let flushTimer: ReturnType<typeof setTimeout> | null = null;
    const WINDOW_MS = 2000;
    const THRESHOLD = 3;

    const flush = () => {
      flushTimer = null;
      if (buffer.length === 0) return;
      if (buffer.length > THRESHOLD) {
        const distinct = new Set(buffer.map((b) => b.ItemId)).size;
        toast.warning(`${buffer.length} changes restored`, {
          description: `Local edits to ${distinct} item${distinct === 1 ? "" : "s"} were overwritten by remote versions. Undo to recover.`,
        });
      } else {
        // Below threshold — emit individual notices so users still see them.
        buffer.forEach(() => toast.info("Local edit overwritten by remote"));
      }
      buffer = [];
    };

    return syncQueue.subscribeLoss((ev) => {
      buffer.push({ ItemId: ev.ItemId, At: Date.now() });
      if (flushTimer) clearTimeout(flushTimer);
      flushTimer = setTimeout(flush, WINDOW_MS);
    });
  }, []);

  useEffect(() => { syncQueue.latencyMs = latency; }, [latency]);
  useEffect(() => { syncQueue.injectConflictForNext = armConflict; }, [armConflict]);

  const [clock, setClock] = useState<ClockState>(virtualClock.getState());
  const [virtualDay, setVirtualDay] = useState(virtualClock.virtualDay());
  useEffect(() => {
    const unsubState = virtualClock.subscribe((s) => {
      setClock(s);
      setVirtualDay(virtualClock.virtualDay());
    });
    const unsubReap = virtualClock.subscribeReap((run) => {
      if (run.RowsDeleted > 0) {
        toast.info(`Reaper auto-tick — purged ${run.RowsDeleted} row(s)`);
      }
    });
    return () => { unsubState(); unsubReap(); };
  }, []);

  async function handleResolve(q: QueuedOp, strategy: ResolutionStrategy) {
    await syncQueue.resolve(q.QueueId, strategy);
    toast.success(`Resolved with ${strategy}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Sync Simulator</h1>
          <p className="text-sm text-muted-foreground">
            Wraps <code>applyOp</code> with latency + conflict injection. Models{" "}
            <code className="text-xs">spec/31-app/01-features/14-concurrency-and-sync</code>.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant={clock.Running ? "default" : "outline"} className="font-mono text-xs">
            <Clock className="w-3 h-3 mr-1" /> day +{virtualDay}
            {clock.AutoReap && <span className="ml-1">· reap</span>}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => virtualClock.setState({ Running: !clock.Running, AutoReap: true })}
            title="Start/pause virtual clock with auto-reaper"
          >
            {clock.Running ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {clock.Running ? "Pause clock" : "Run clock"}
          </Button>
          <Link to="/"><Button variant="ghost" size="sm">Home</Button></Link>
          <Link to="/api-playground"><Button variant="ghost" size="sm">Playground</Button></Link>
          <Button variant="outline" size="sm"
            onClick={async () => { syncQueue.clear(); await resetPlayground(); virtualClock.reset(); await refresh(); toast.info("Reset"); }}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 p-6">
        {/* LEFT: controls + items */}
        <div className="space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <Label className="text-sm">Network latency: <span className="font-mono">{latency} ms</span></Label>
              <Slider min={0} max={6000} step={100} value={[latency]} onValueChange={(v) => setLatency(v[0])} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Every queued op waits this long before applying.</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" /> Arm conflict on next update
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mutates the item remotely the moment you enqueue, forcing a conflict.
                </p>
              </div>
              <Switch checked={armConflict} onCheckedChange={setArmConflict} />
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold mb-3">Items ({items.length})</h2>
            <form
              className="flex gap-2 mb-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!content.trim()) return;
                // Create goes through the queue too.
                await syncQueue.enqueue("items.create", { ParentId: null, Content: content, ItemType: "Bullet" });
                setContent("");
              }}
            >
              <Input placeholder="New item…" value={content} onChange={(e) => setContent(e.target.value)} />
              <Button type="submit" size="icon"><Plus className="w-4 h-4" /></Button>
            </form>

            <ScrollArea className="h-[40vh] pr-2">
              <ul className="space-y-1.5">
                {items.map((it) => (
                  <li key={it.Id} className="rounded border border-border px-2 py-1.5 text-sm">
                    {editId === it.Id ? (
                      <div className="flex gap-2">
                        <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="h-8" />
                        <Button size="sm" onClick={async () => {
                          await syncQueue.enqueue("items.update", { Id: it.Id, Content: editText });
                          setEditId(""); setEditText("");
                        }}>Queue</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditId(""); setEditText(""); }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="flex-1">{it.Content}</span>
                        <code className="text-[10px] text-muted-foreground">{it.Id.slice(0, 6)}</code>
                        <Button size="sm" variant="outline" onClick={() => { setEditId(it.Id); setEditText(it.Content); }}>
                          Edit
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-sm text-muted-foreground italic">No items.</li>
                )}
              </ul>
            </ScrollArea>
          </Card>
        </div>

        {/* RIGHT: queue */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Op Queue ({queue.length})
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Conflicts are detected by comparing the snapshot taken at enqueue time vs the current
            persisted item just before commit. Resolutions: <code>lww</code>, <code>keep-local</code>,{" "}
            <code>keep-remote</code>.
          </p>
          <ScrollArea className="h-[75vh] pr-2">
            <ul className="space-y-2">
              {queue.length === 0 && (
                <li className="text-sm text-muted-foreground italic">Queue is empty. Edit or create an item.</li>
              )}
              {queue.slice().reverse().map((q) => (
                <li key={q.QueueId} className="rounded border border-border p-3 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">#{q.LocalSeq}</Badge>
                    <Badge variant={statusColor[q.Status]}>{q.Status}</Badge>
                    <Badge variant="outline">{q.Kind}</Badge>
                    <span className="text-muted-foreground ml-auto">
                      {new Date(q.EnqueuedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-[10px] text-muted-foreground bg-muted/40 rounded p-2">
{JSON.stringify(q.Payload, null, 2)}
                  </pre>

                  {q.Status === "queued" && (
                    <Button size="sm" variant="outline" onClick={() => syncQueue.flushNow(q.QueueId)}>
                      <Zap className="w-3 h-3 mr-1" /> Flush now
                    </Button>
                  )}

                  {q.Status === "conflict" && q.ConflictRemote && (
                    <div className="space-y-2 border-t border-border pt-2">
                      <div className="text-destructive font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Conflict detected
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded bg-muted/40 p-2">
                          <div className="text-[10px] uppercase text-muted-foreground mb-1">Local (yours)</div>
                          <div>{q.ConflictLocal?.Content ?? "—"}</div>
                        </div>
                        <div className="rounded bg-muted/40 p-2">
                          <div className="text-[10px] uppercase text-muted-foreground mb-1">Remote</div>
                          <div>{q.ConflictRemote.Content}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => handleResolve(q, "lww")}>
                          <Check className="w-3 h-3 mr-1" /> Last-write-wins
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleResolve(q, "keep-local")}>
                          Keep local
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleResolve(q, "keep-remote")}>
                          Keep remote
                        </Button>
                      </div>
                    </div>
                  )}

                  {q.Resolution && q.Status === "applied" && (
                    <div className="text-[10px] text-muted-foreground">
                      Resolved with <code>{q.Resolution}</code>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>
      </main>
    </div>
  );
}
