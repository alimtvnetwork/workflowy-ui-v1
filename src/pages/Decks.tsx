import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers, Presentation, Play, ChevronRight, Search, Box,
  Trash2, Activity, MessageSquare, Diamond, Camera, Database, Users, ShieldCheck, Settings,
} from "lucide-react";
import type { SlideMeta } from "@/deck/types";
import { slides as productSlides } from "@/deck/slides";
import { backendSlides } from "@/deck/backend-slides";
import { opsSlides } from "@/deck/ops-slides";
import { enforcementSlides } from "@/deck/enforcement-slides";
import { userSlides } from "@/deck/user-slides";
import { feedbackSlides } from "@/deck/feedback-slides";
import { activitySlides } from "@/deck/activity-slides";
import { searchSlides } from "@/deck/search-slides";
import { templateSlides } from "@/deck/template-slides";

interface DeckEntry {
  key: string;
  route: string;
  title: string;
  audience: string;
  blurb: string;
  Icon: typeof Presentation;
  slides: SlideMeta[];
  related: { label: string; route: string }[];
}

const DECKS: DeckEntry[] = [
  {
    key: "product",
    route: "/deck",
    title: "Product Walkthrough",
    audience: "Generalist · prod / design / eng",
    blurb: "End-to-end tour of the Workflowy-style outliner: item model, views, editing, search, today, sharing.",
    Icon: Presentation,
    slides: productSlides,
    related: [],
  },
  {
    key: "backend",
    route: "/backend-deck",
    title: "Backend & Data Model",
    audience: "Engineering deep-dive",
    blurb: "Split-DB anchor, PascalCase envelope, applyOp pipeline, queue worker, SSE fan-out, FTS5 search.",
    Icon: Database,
    slides: backendSlides,
    related: [
      { label: "applyOp playground", route: "/api-playground" },
      { label: "Sync simulator",    route: "/sync-simulator" },
    ],
  },
  {
    key: "ops",
    route: "/ops-deck",
    title: "Operations & Reliability",
    audience: "DevOps / SRE",
    blurb: "Daily reaper cron, retention policies, virtual-clock ops, monitoring, error budget.",
    Icon: Settings,
    slides: opsSlides,
    related: [
      { label: "Trash reaper", route: "/trash-reaper" },
    ],
  },
  {
    key: "enforcement",
    route: "/enforcement-deck",
    title: "Enforcement Model",
    audience: "Security · architecture",
    blurb: "Four-layer defence: client validation → API guards → DB constraints → audit log. 21 slides with gate citations.",
    Icon: ShieldCheck,
    slides: enforcementSlides,
    related: [],
  },
  {
    key: "user",
    route: "/user-deck",
    title: "User Management",
    audience: "Product · auth",
    blurb: "Roles, sessions, invitations, password lifecycle. Maps spec/36-user-management/.",
    Icon: Users,
    slides: userSlides,
    related: [],
  },
  {
    key: "feedback",
    route: "/feedback-deck",
    title: "Feedback Reports",
    audience: "Product · support",
    blurb: "Closed enums, transition matrix, 90-day PurgeAfter, admin triage. 22 slides.",
    Icon: MessageSquare,
    slides: feedbackSlides,
    related: [{ label: "Feedback sim", route: "/feedback" }],
  },
  {
    key: "activity",
    route: "/activity-deck",
    title: "Activity Feed",
    audience: "Eng · UX",
    blurb: "Single-chokepoint capture pipeline, 30-day retention, feed UI states. 22 slides.",
    Icon: Activity,
    slides: activitySlides,
    related: [{ label: "Activity feed sim", route: "/activity-feed" }],
  },
  {
    key: "search",
    route: "/search-deck",
    title: "Search & Ranking",
    audience: "Eng · UX",
    blurb: "Grammar (S-1) → ranking (S-2) → surface (S-3) → backend (S-4). 25 slides.",
    Icon: Search,
    slides: searchSlides,
    related: [{ label: "Search simulator", route: "/search-sim" }],
  },
];

const SIMS: { route: string; label: string; blurb: string; Icon: typeof Box }[] = [
  { route: "/api-playground",  label: "applyOp Playground",   blurb: "PascalCase envelopes against an IndexedDB op-journal.", Icon: Box },
  { route: "/sync-simulator",  label: "Sync Simulator",       blurb: "Latency + conflict resolver on top of applyOp.",        Icon: Activity },
  { route: "/trash-reaper",    label: "Trash Reaper",         blurb: "Virtual-clock daily cron per spec 11b.",                 Icon: Trash2 },
  { route: "/activity-feed",   label: "Activity Feed",        blurb: "30-day PurgeAfter capture pipeline (spec 34).",          Icon: Activity },
  { route: "/feedback",        label: "Feedback Reports",     blurb: "Transition matrix + 90-day retention (spec 33).",        Icon: MessageSquare },
  { route: "/search-sim",      label: "Search Simulator",     blurb: "Bucketed ranking + parser trace (spec 16).",             Icon: Search },
  { route: "/peer-group-sim",  label: "Mirror Peer-Group",    blurb: "Group dissolve + canonical promotion (spec 09b).",        Icon: Diamond },
  { route: "/template-sim",    label: "Template Snapshots",   blurb: "DFS clone, fresh UUIDs, divergence proof (spec 13b).",   Icon: Camera },
];

function summarizeChapters(slides: SlideMeta[]): { name: string; count: number }[] {
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const s of slides) {
    const c = s.chapter ?? "—";
    if (!counts.has(c)) order.push(c);
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return order.map((n) => ({ name: n, count: counts.get(n) ?? 0 }));
}

export default function Decks() {
  const totals = useMemo(() => {
    const slideTotal = DECKS.reduce((a, d) => a + d.slides.length, 0);
    return { decks: DECKS.length, slides: slideTotal, sims: SIMS.length };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Layers className="w-6 h-6" /> Deck Index
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {totals.decks} decks · {totals.slides} slides · {totals.sims} runnable simulators
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/"><Button variant="ghost" size="sm">Home</Button></Link>
            <Link to="/presenter"><Button variant="outline" size="sm"><Play className="w-4 h-4 mr-1" /> Presenter</Button></Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Decks section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Presentation className="w-5 h-5" /> Decks
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {DECKS.map((d) => {
              const chapters = summarizeChapters(d.slides);
              return (
                <Card key={d.key} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-muted">
                        <d.Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{d.title}</h3>
                        <p className="text-[11px] text-muted-foreground">{d.audience}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{d.slides.length} slides</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{d.blurb}</p>
                  <ScrollArea className="h-[140px] border border-border rounded">
                    <div className="p-2 space-y-0.5">
                      {chapters.map((c) => (
                        <div key={c.name} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-muted">
                          <span className="truncate">{c.name}</span>
                          <Badge variant="secondary" className="text-[10px] h-4">{c.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link to={d.route}>
                      <Button size="sm" variant="default" className="h-7 text-xs">
                        <Play className="w-3 h-3 mr-1" /> Open deck
                      </Button>
                    </Link>
                    <Link to={`/presenter?deck=${d.key}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Presenter</Button>
                    </Link>
                    {d.related.map((r) => (
                      <Link key={r.route} to={r.route}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                          {r.label} <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Simulators section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Box className="w-5 h-5" /> Simulators
          </h2>
          <p className="text-sm text-muted-foreground">
            Client-side reference implementations. All in <code className="text-xs">src/lib/</code>; final backend = SQLite + WordPress plugin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {SIMS.map((s) => (
              <Link key={s.route} to={s.route}>
                <Card className="p-3 h-full hover:border-primary transition-colors space-y-1.5">
                  <div className="flex items-center gap-2">
                    <s.Icon className="w-4 h-4" />
                    <span className="font-semibold text-sm">{s.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.blurb}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/70">{s.route}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-4 text-xs text-muted-foreground text-center">
        Spec source of truth: <code>spec/31-app/</code> · <code>spec/32-ui-design/</code> · <code>spec/33-feedback-report/</code> · <code>spec/34-activity-feed/</code> · <code>spec/35-enforcement-rules/</code> · <code>spec/36-user-management/</code>
      </footer>
    </div>
  );
}
