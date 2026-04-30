import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Trash2, Play, FastForward, RotateCcw } from "lucide-react";
import { applyOp, listItems } from "@/lib/applyOp";
import type { Item } from "@/lib/applyOp/types";
import { runReaper, type ReaperRun } from "@/lib/applyOp/reaper";
import { itemsStore } from "@/lib/applyOp/db";
import { virtualClock, type ClockState } from "@/lib/applyOp/virtualClock";
import { Switch } from "@/components/ui/switch";

export default function TrashReaper() {
  const [items, setItems] = useState<Item[]>([]);
  const [runs, setRuns] = useState<ReaperRun[]>([]);
  const [retentionDays, setRetentionDays] = useState(30);
  const [batchSize, setBatchSize] = useState(1000);
  const [virtualOffsetDays, setVirtualOffsetDays] = useState(0);

  const [clock, setClock] = useState<ClockState>(virtualClock.getState());

  const refresh = async () => {
    const env = await listItems({ includeTrashed: true });
    setItems(env.Results);
  };
  useEffect(() => { void refresh(); }, []);

  useEffect(() => {
    const offState = virtualClock.subscribe(setClock);
    const offReap = virtualClock.subscribeReap((run) => {
      setRuns((r) => [run, ...r]);
      void refresh();
    });
    return () => { offState(); offReap(); };
  }, []);

  const nowMs = Date.now() + virtualOffsetDays * 86400_000;
  const cutoffIso = new Date(nowMs - retentionDays * 86400_000).toISOString();
  const eligibleCount = items.filter((i) => i.TrashedAt && i.TrashedAt < cutoffIso).length;

  const trashed = useMemo(() => items.filter((i) => i.TrashedAt), [items]);

  async function seedTrashedItem(daysAgo: number) {
    const env = await applyOp("items.create", {
      ParentId: null,
      Content: `Trashed ${daysAgo}d ago`,
      ItemType: "Bullet",
    });
    const created = env.Results[0];
    if (!created) return;
    const trashedAt = new Date(Date.now() - daysAgo * 86400_000).toISOString();
    await itemsStore.put({ ...created, TrashedAt: trashedAt });
    await refresh();
  }

  async function reap() {
    const run = await runReaper({ RetentionDays: retentionDays, BatchSize: batchSize, NowMs: nowMs });
    setRuns((r) => [run, ...r]);
    await refresh();
  }

  async function advanceAndReap() {
    setVirtualOffsetDays((d) => d + 1);
    // Run on the next frame so config picks up the new offset.
    setTimeout(() => { void reap(); }, 0);
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Trash Reaper</h1>
          <p className="text-sm text-muted-foreground">
            Daily cron sim per <code>spec/31-app/01-features/11b-trash-reaper.md</code> — hard-delete + peer-group dissolution.
          </p>
        </div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 space-y-4">
          <h2 className="text-sm font-medium">Config</h2>

          <div className="space-y-2">
            <Label className="text-xs">Retention (days): <span className="font-mono">{retentionDays}</span></Label>
            <Slider value={[retentionDays]} min={1} max={60} step={1} onValueChange={([v]) => setRetentionDays(v)} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Batch size: <span className="font-mono">{batchSize}</span></Label>
            <Slider value={[batchSize]} min={1} max={1000} step={1} onValueChange={([v]) => setBatchSize(v)} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">
              Virtual clock offset: <span className="font-mono">+{virtualOffsetDays}d</span>
              <span className="text-muted-foreground ml-2">(sim "today" = real today + N days)</span>
            </Label>
            <Slider value={[virtualOffsetDays]} min={0} max={60} step={1} onValueChange={([v]) => setVirtualOffsetDays(v)} />
          </div>

          <div className="rounded border border-border bg-muted/30 p-3 text-xs space-y-1">
            <div>Cutoff: <span className="font-mono">{cutoffIso}</span></div>
            <div>Eligible to reap: <Badge variant={eligibleCount > 0 ? "destructive" : "secondary"}>{eligibleCount}</Badge></div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={reap}><Play className="w-4 h-4 mr-1" /> Run reaper</Button>
            <Button variant="outline" onClick={advanceAndReap}>
              <FastForward className="w-4 h-4 mr-1" /> +1 day & run
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setRuns([]); setVirtualOffsetDays(0); }}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset sim
            </Button>
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <Label className="text-xs">Seed trashed items (for demo)</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 15, 29, 31, 45].map((d) => (
                <Button key={d} size="sm" variant="outline" onClick={() => seedTrashedItem(d)}>
                  +{d}d ago
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Trash ({trashed.length})
            </h2>
          </div>
          <ScrollArea className="h-72 pr-2">
            <ul className="space-y-1.5">
              {trashed.length === 0 && (
                <li className="text-sm text-muted-foreground italic">No trashed items. Seed some above.</li>
              )}
              {trashed.map((it) => {
                const ageDays = it.TrashedAt
                  ? Math.floor((nowMs - new Date(it.TrashedAt).getTime()) / 86400_000)
                  : 0;
                const eligible = it.TrashedAt && it.TrashedAt < cutoffIso;
                return (
                  <li key={it.Id} className="flex items-center gap-2 text-xs rounded border border-border p-2">
                    <Badge variant={eligible ? "destructive" : "secondary"}>{ageDays}d</Badge>
                    <span className="truncate flex-1">{it.Content}</span>
                    <span className="font-mono text-muted-foreground">{it.Id.slice(0, 6)}</span>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h2 className="text-sm font-medium mb-3">ReaperRuns log ({runs.length})</h2>
          <ScrollArea className="h-72 pr-2">
            {runs.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No runs yet. Hit "Run reaper".</p>
            )}
            <ul className="space-y-2">
              {runs.map((r) => (
                <li key={r.Id} className="rounded border border-border p-3 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={r.RowsDeleted > 0 ? "destructive" : "secondary"}>
                      {r.RowsDeleted} deleted
                    </Badge>
                    <Badge variant="outline">{r.DurationMs}ms</Badge>
                    {r.DissolvedGroups.length > 0 && (
                      <Badge variant="outline">{r.DissolvedGroups.length} groups dissolved</Badge>
                    )}
                    <span className="text-muted-foreground ml-auto font-mono">{r.RanAt}</span>
                  </div>
                  {r.DeletedIds.length > 0 && (
                    <div className="text-muted-foreground font-mono break-all">
                      {r.DeletedIds.slice(0, 8).map((id) => id.slice(0, 6)).join(", ")}
                      {r.DeletedIds.length > 8 && ` … +${r.DeletedIds.length - 8} more`}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
