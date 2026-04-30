import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Trash2, RotateCcw } from "lucide-react";
import {
  type ActivityEvent,
  type EventType,
  clearActivity,
  getFeed,
  purgeExpired,
  subscribeActivity,
} from "@/lib/applyOp/activity";

const EVENT_VARIANT: Record<EventType, "default" | "secondary" | "destructive" | "outline"> = {
  ItemCreated: "default",
  ItemUpdated: "secondary",
  ItemMoved: "outline",
  ItemDeleted: "destructive",
  ItemRestored: "default",
  ItemMirrored: "secondary",
  BoardColumnReordered: "outline",
  TemplateApplied: "outline",
};

export default function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<EventType | "all">("all");
  const [pageFilter, setPageFilter] = useState<string>("all");
  const [purgedCount, setPurgedCount] = useState<number | null>(null);

  const refresh = async () => setEvents(await getFeed({ limit: 200 }));

  useEffect(() => {
    void refresh();
    return subscribeActivity(() => { void refresh(); });
  }, []);

  const pageIds = Array.from(new Set(events.map((e) => e.PageItemId))).sort();
  const byPage = pageFilter === "all" ? events : events.filter((e) => e.PageItemId === pageFilter);
  const filtered = filter === "all" ? byPage : byPage.filter((e) => e.EventType === filter);
  const types: EventType[] = [
    "ItemCreated", "ItemUpdated", "ItemMoved",
    "ItemDeleted", "ItemRestored", "ItemMirrored",
  ];

  return (
    <div className="min-h-screen bg-background p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" /> Activity Feed
          </h1>
          <p className="text-sm text-muted-foreground">
            Reference impl of <code>spec/34-activity-feed/</code> — single-chokepoint capture, 30-day PurgeAfter, page-scoped feed.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Events flow in automatically when you mutate items via the{" "}
            <Link to="/api-playground" className="underline hover:text-foreground">playground</Link> or{" "}
            <Link to="/sync-simulator" className="underline hover:text-foreground">sync simulator</Link>.
          </p>
        </div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
      </header>

      <Card className="p-4 mb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">Page:</span>
          <Button
            size="sm"
            variant={pageFilter === "all" ? "default" : "outline"}
            onClick={() => setPageFilter("all")}
          >
            All pages ({pageIds.length})
          </Button>
          {pageIds.map((pid) => {
            const count = events.filter((e) => e.PageItemId === pid).length;
            return (
              <Button
                key={pid}
                size="sm"
                variant={pageFilter === pid ? "default" : "outline"}
                onClick={() => setPageFilter(pid)}
                className="font-mono"
              >
                {pid.slice(0, 6)} ({count})
              </Button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">Type:</span>
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({byPage.length})
          </Button>
          </Button>
          {types.map((t) => {
            const count = events.filter((e) => e.EventType === t).length;
            return (
              <Button
                key={t}
                size="sm"
                variant={filter === t ? "default" : "outline"}
                onClick={() => setFilter(t)}
              >
                {t} ({count})
              </Button>
            );
          })}
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => { setPurgedCount(await purgeExpired()); void refresh(); }}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Purge expired
            </Button>
            <Button size="sm" variant="ghost" onClick={async () => { await clearActivity(); void refresh(); }}>
              <RotateCcw className="w-3 h-3 mr-1" /> Clear
            </Button>
          </div>
        </div>
        {purgedCount !== null && (
          <p className="text-xs text-muted-foreground mt-2">
            Last purge removed <span className="font-mono">{purgedCount}</span> expired events.
          </p>
        )}
      </Card>

      <Card className="p-4">
        <ScrollArea className="h-[60vh] pr-2">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No events yet. Mutate something in the playground to see them appear here.
            </p>
          )}
          <ul className="space-y-2">
            {filtered.map((e) => {
              const purgeIn = Math.max(
                0,
                Math.round((new Date(e.PurgeAfter).getTime() - Date.now()) / 86400_000),
              );
              return (
                <li key={e.ActivityEventId} className="rounded border border-border p-3 text-xs space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="font-mono">#{e.ActivityEventId}</Badge>
                    <Badge variant={EVENT_VARIANT[e.EventType]}>{e.EventType}</Badge>
                    <span className="text-muted-foreground">user {e.ActorUserId}</span>
                    <span className="font-mono text-muted-foreground">target {e.TargetItemId.slice(0, 6)}</span>
                    <span className="font-mono text-muted-foreground">page {e.PageItemId.slice(0, 6)}</span>
                    {e.Reversible === 0 && <Badge variant="outline">irreversible</Badge>}
                    <span className="ml-auto text-muted-foreground">
                      {new Date(e.OccurredAt).toLocaleTimeString()} · purge in {purgeIn}d
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-[10px] text-muted-foreground bg-muted/40 rounded p-2 mt-1">
{e.PayloadJson}
                  </pre>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </Card>
    </div>
  );
}
