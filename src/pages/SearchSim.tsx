import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search as SearchIcon, RotateCcw, AlertTriangle } from "lucide-react";
import { search, type ScoredItem, type ParsedToken } from "@/lib/search/searchEngine";
import { SEED_ITEMS } from "@/lib/search/seedCorpus";

const PRESETS: { label: string; q: string; note: string }[] = [
  { label: "Free text",       q: "search ranking",     note: "Hits exact-whole, exact-substring, all-in-order, all-any-order, some — across 5 buckets." },
  { label: "Filter only",     q: "is:todo",            note: "AT-SR: filter-only queries score 60 for every passing row; tiebreak by UpdatedAt desc." },
  { label: "Negation",        q: "ranking -algorithm", note: "Items containing 'algorithm' are filtered out before scoring." },
  { label: "Date keyword",    q: "today",              note: "Standalone keyword resolves against UpdatedAt in local TZ." },
  { label: "Show trashed",    q: "is:trashed ranking", note: "Default-excluded rows opt back in via is:trashed (AT-SR-04)." },
  { label: "Mirror filter",   q: "is:mirror",          note: "Each peer-group instance ranks independently (AT-SR-03)." },
  { label: "Has note",        q: "has:note ranking",   note: "Combines a metadata filter with free-text scoring." },
  { label: "Unsupported",     q: "in:abc123 ranking",  note: "Recognised key but flagged — needs server-side scope resolution." },
];

const BUCKET_LABEL: Record<number, string> = {
  5: "150",
  4: "80–149",
  3: "60–79",
  2: "40–59",
  1: "20–39",
  0: "1–19",
};

export default function SearchSim() {
  const [query, setQuery] = useState("search ranking");
  const trace = useMemo(() => search(SEED_ITEMS, query), [query]);
  const visible = trace.Buckets.Ranked.slice(0, trace.Cap);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <SearchIcon className="w-5 h-5" /> Search Simulator
          </h1>
          <p className="text-sm text-muted-foreground">
            Reference implementation of{" "}
            <code className="text-xs">spec/31-app/01-features/16-search-ranking.md</code>
            {" + "}
            <code className="text-xs">spec/32-ui-design/06-workflowy-ui/02-search/06-query-grammar.md</code>.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Link to="/"><Button variant="ghost" size="sm">Home</Button></Link>
          <Link to="/api-playground"><Button variant="ghost" size="sm">Playground</Button></Link>
          <Button variant="outline" size="sm" onClick={() => setQuery("search ranking")}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4 p-6">
        {/* LEFT — query, presets, parsed tokens, bucket distribution */}
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <Label className="text-sm">Query</Label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. search ranking, is:todo, today, -draft"
              className="font-mono"
            />
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  variant={query === p.q ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setQuery(p.q)}
                  title={p.note}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="text-sm font-semibold flex items-center justify-between">
              Parsed tokens
              <span className="text-xs font-normal text-muted-foreground">
                {trace.Query.Tokens.length} token{trace.Query.Tokens.length === 1 ? "" : "s"}
              </span>
            </div>
            {trace.Query.Tokens.length === 0 ? (
              <p className="text-xs text-muted-foreground">Type something to see the parse tree.</p>
            ) : (
              <div className="space-y-1.5">
                {trace.Query.Tokens.map((t, i) => <TokenRow key={i} t={t} />)}
              </div>
            )}
          </Card>

          <Card className="p-4 space-y-3">
            <div className="text-sm font-semibold">Filter trace</div>
            <div className="text-xs text-muted-foreground">
              {trace.TotalItems} corpus rows · {trace.ExcludedByFilter} excluded · {trace.Buckets.Ranked.length} scored
            </div>
            {trace.ExcludeReasons.size > 0 && (
              <div className="space-y-1">
                {[...trace.ExcludeReasons.entries()].map(([reason, n]) => (
                  <div key={reason} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{reason}</span>
                    <span className="font-mono tabular-nums">{n}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4 space-y-3">
            <div className="text-sm font-semibold">Bucket distribution</div>
            <p className="text-xs text-muted-foreground">
              §16.1 — relevance bucket DESC, then <code>UpdatedAt</code> DESC inside each bucket.
            </p>
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1, 0].map((b) => {
                const arr = trace.Buckets.Buckets.get(b) ?? [];
                const pct = trace.Buckets.Ranked.length > 0
                  ? Math.round((arr.length / trace.Buckets.Ranked.length) * 100)
                  : 0;
                return (
                  <div key={b} className="flex items-center gap-2 text-xs">
                    <span className="w-16 font-mono text-muted-foreground">B{b} · {BUCKET_LABEL[b]}</span>
                    <div className="flex-1 h-3 rounded bg-muted overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-mono tabular-nums">{arr.length}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT — ranked results */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-sm font-semibold">
                Ranked results
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {trace.Buckets.Ranked.length} hit{trace.Buckets.Ranked.length === 1 ? "" : "s"}
                  {trace.Buckets.Ranked.length > trace.Cap && ` · capped at ${trace.Cap} (I-SR-04)`}
                </span>
              </div>
            </div>
            <ScrollArea className="h-[640px] pr-3">
              {visible.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No matches. Empty queries deliberately return nothing (AT-SR edge case).
                </div>
              ) : (
                <div className="space-y-2">
                  {visible.map((s, i) => <ResultRow key={s.Item.Id} s={s} rank={i + 1} />)}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </main>
    </div>
  );
}

function TokenRow({ t }: { t: ParsedToken }) {
  const variant: "default" | "secondary" | "outline" | "destructive" =
    t.Kind === "unsupported" ? "destructive" : t.Negated ? "outline" : "secondary";
  return (
    <div className="flex items-start gap-2 text-xs">
      <Badge variant={variant} className="font-mono shrink-0">
        {t.Negated && "−"}{t.Kind}
        {t.Key && t.Key !== t.Kind ? `:${t.Key}` : ""}
      </Badge>
      <div className="flex-1">
        <div className="font-mono break-all">{t.Raw}</div>
        {t.Issue && (
          <div className="text-destructive flex items-center gap-1 mt-0.5">
            <AlertTriangle className="w-3 h-3" /> {t.Issue}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultRow({ s, rank }: { s: ScoredItem; rank: number }) {
  const best = s.Fields.reduce((m, f) => (f.Score > m.Score ? f : m), s.Fields[0]);
  return (
    <div className="border border-border rounded-md p-3 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono tabular-nums text-muted-foreground w-6 pt-0.5">#{rank}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{s.Item.Content}</div>
          {s.Item.Note && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.Item.Note}</div>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="default" className="font-mono text-[10px]">B{s.Bucket} · {s.Score}</Badge>
            <Badge variant="outline" className="font-mono text-[10px]">{best.Field}: {best.Kind}</Badge>
            <Badge variant="outline" className="font-mono text-[10px]">×{best.Weight}</Badge>
            {s.Item.IsCompleted && <Badge variant="secondary" className="text-[10px]">complete</Badge>}
            {s.Item.PeerGroupId && <Badge variant="secondary" className="text-[10px]">mirror</Badge>}
            {s.Item.Tags.includes("template") && <Badge variant="secondary" className="text-[10px]">template</Badge>}
            {s.Item.Tags.includes("starred") && <Badge variant="secondary" className="text-[10px]">starred</Badge>}
            {s.Item.TrashedAt && <Badge variant="destructive" className="text-[10px]">trashed</Badge>}
          </div>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums whitespace-nowrap pt-0.5">
          {s.Item.UpdatedAt.slice(0, 10)}
        </span>
      </div>
    </div>
  );
}
