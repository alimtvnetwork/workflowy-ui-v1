import { Link } from "react-router-dom";
import { slides as frontendSlides } from "@/deck/slides";
import { backendSlides } from "@/deck/backend-slides";
import { opsSlides } from "@/deck/ops-slides";
import { enforcementSlides } from "@/deck/enforcement-slides";
import { userSlides } from "@/deck/user-slides";
import { feedbackSlides } from "@/deck/feedback-slides";
import { activitySlides } from "@/deck/activity-slides";
import { searchSlides } from "@/deck/search-slides";
import { templateSlides } from "@/deck/template-slides";

const Index = () => {
  const fePhases = countChapters(frontendSlides);
  const bePhases = countChapters(backendSlides);
  const opsPhases = countChapters(opsSlides);
  const enfPhases = countChapters(enforcementSlides);
  const usrPhases = countChapters(userSlides);
  const fbPhases = countChapters(feedbackSlides);
  const actPhases = countChapters(activitySlides);
  const srPhases = countChapters(searchSlides);
  const tplPhases = countChapters(templateSlides);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-8 py-20">
        <header className="mb-16">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            WorkFlowy · Spec Decks
          </div>
          <h1 className="text-5xl font-semibold tracking-tight mb-4">
            Two decks, one product.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Walkthroughs of the WorkFlowy clone — what users see, and how the
            server makes it true. Each slide is sourced from the spec under
            <code className="text-foreground mx-1">spec/</code>.
          </p>
          <div className="mt-4">
            <Link to="/decks" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-muted text-sm">
              Browse all decks & simulators →
            </Link>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <DeckCard to="/deck" kicker="Frontend" title="Product walkthrough"
            blurb="Item model, views, sync UX, mirrors, templates, sharing, trash, settings, admin."
            stats={[{ label: "Slides", value: frontendSlides.length }, { label: "Chapters", value: fePhases }]} />
          <DeckCard to="/backend-deck" kicker="Backend" title="Systems deep-dive"
            blurb="Process model, auth, sync protocol, item ops, mirrors, jobs, search, migrations, deployment."
            stats={[{ label: "Slides", value: backendSlides.length }, { label: "Phases", value: bePhases }]} />
          <DeckCard to="/ops-deck" kicker="Operations" title="Run it in production"
            blurb="SLOs, metrics, alerts, dashboards, on-call rotation, incident playbooks."
            stats={[{ label: "Slides", value: opsSlides.length }, { label: "Phases", value: opsPhases }]} />
          <DeckCard to="/enforcement-deck" kicker="Enforcement" title="Make CI fail before review"
            blurb="The four-layer enforcement model: compile-time generics, Zod runtime, ESLint authoring, boundary chokepoints."
            stats={[{ label: "Slides", value: enforcementSlides.length }, { label: "Phases", value: enfPhases }]} />
          <DeckCard to="/user-deck" kicker="User Mgmt" title="Who you are. What you can do."
            blurb="Settings, password & MFA, login state machine, tokens, RBAC helpers, role escalation, admin UI, audit."
            stats={[{ label: "Slides", value: userSlides.length }, { label: "Phases", value: usrPhases }]} />
          <DeckCard to="/feedback-deck" kicker="Feedback" title="One inbox. Closed enums. 90-day reaper."
            blurb="Dedicated feedback.db, transition matrix as SSOT, single-egress submit, atomic GDPR delete, streamed CSV export."
            stats={[{ label: "Slides", value: feedbackSlides.length }, { label: "Phases", value: fbPhases }]} />
          <DeckCard to="/activity-deck" kicker="Activity" title="One chokepoint. 8 events. 30-day reaper."
            blurb="Dedicated activity.db, 5-stage capture pipeline, mirror-first feed loader, exhaustive row dispatcher, cursor-pinned mirror compaction."
            stats={[{ label: "Slides", value: activitySlides.length }, { label: "Phases", value: actPhases }]} />
          <DeckCard to="/search-deck" kicker="Search" title="One grammar. Five buckets. Sub-300 ms."
            blurb="Closed EBNF grammar with 12 keys, deterministic relevance-then-recency ranking, FTS5 per App-DB, no client re-rank, 250-cap viewport."
            stats={[{ label: "Slides", value: searchSlides.length }, { label: "Phases", value: srPhases }]} />
          <DeckCard to="/template-deck" kicker="Templates" title="One stamp. Zero links. Forever divergent."
            blurb="Snapshot semantics: DFS clone with mirror flatten and trash exclusion, fresh UUIDs on apply, ownership rewrite, ten ATs."
            stats={[{ label: "Slides", value: templateSlides.length }, { label: "Phases", value: tplPhases }]} />
        </div>

        <footer className="mt-20 pt-8 border-t border-border text-sm text-muted-foreground space-y-2">
          <div>
            Use <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground">←</kbd>
            {" / "}
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground">→</kbd> inside
            a deck to navigate. Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground">Esc</kbd> to
            open the slide index.
          </div>
          <div>
            PDF export:{" "}
            <Link to="/print?deck=frontend" className="underline hover:text-foreground">frontend</Link>
            {" · "}<Link to="/print?deck=backend" className="underline hover:text-foreground">backend</Link>
            {" · "}<Link to="/print?deck=ops" className="underline hover:text-foreground">ops</Link>
            {" · "}<Link to="/print?deck=enforcement" className="underline hover:text-foreground">enforcement</Link>
            {" · "}<Link to="/print?deck=user" className="underline hover:text-foreground">user</Link>
            {" · "}<Link to="/print?deck=feedback" className="underline hover:text-foreground">feedback</Link>
            {" · "}<Link to="/print?deck=activity" className="underline hover:text-foreground">activity</Link>
            {" · "}<Link to="/print?deck=search" className="underline hover:text-foreground">search</Link>
            {" · "}<Link to="/print?deck=template" className="underline hover:text-foreground">template</Link>
            {" "}— then Cmd/Ctrl-P → Save as PDF.
          </div>
          <div>
            Presenter mode:{" "}
            <Link to="/presenter?deck=frontend" className="underline hover:text-foreground">frontend</Link>
            {" · "}<Link to="/presenter?deck=backend" className="underline hover:text-foreground">backend</Link>
            {" · "}<Link to="/presenter?deck=ops" className="underline hover:text-foreground">ops</Link>
            {" · "}<Link to="/presenter?deck=enforcement" className="underline hover:text-foreground">enforcement</Link>
            {" · "}<Link to="/presenter?deck=user" className="underline hover:text-foreground">user</Link>
            {" · "}<Link to="/presenter?deck=feedback" className="underline hover:text-foreground">feedback</Link>
            {" · "}<Link to="/presenter?deck=activity" className="underline hover:text-foreground">activity</Link>
            {" · "}<Link to="/presenter?deck=search" className="underline hover:text-foreground">search</Link>
            {" · "}<Link to="/presenter?deck=template" className="underline hover:text-foreground">template</Link>
            {" "}— current slide, next slide, speaker notes, and a timer.
          </div>
          <div>
            Reference implementation:{" "}
            <Link to="/api-playground" className="underline hover:text-foreground">applyOp playground</Link>
            {" · "}<Link to="/sync-simulator" className="underline hover:text-foreground">sync simulator</Link>
            {" · "}<Link to="/trash-reaper" className="underline hover:text-foreground">trash reaper</Link>
            {" · "}<Link to="/activity-feed" className="underline hover:text-foreground">activity feed</Link>
            {" · "}<Link to="/feedback" className="underline hover:text-foreground">feedback</Link>
            {" · "}<Link to="/search-sim" className="underline hover:text-foreground">search</Link>
            {" · "}<Link to="/peer-group-sim" className="underline hover:text-foreground">peer-group</Link>
            {" · "}<Link to="/template-sim" className="underline hover:text-foreground">templates</Link>
            {" "}— interactive items + op-journal in IndexedDB, plus latency + conflict resolution.
          </div>
        </footer>
      </div>
    </main>
  );
};

function DeckCard({
  to, kicker, title, blurb, stats,
}: {
  to: string;
  kicker: string;
  title: string;
  blurb: string;
  stats: { label: string; value: number }[];
}) {
  return (
    <Link
      to={to}
      className="group block rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary"
    >
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
        {kicker}
      </div>
      <h2 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
        {title} →
      </h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">{blurb}</p>
      <div className="flex gap-8">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-2xl font-semibold text-foreground">{s.value}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </Link>
  );
}

function countChapters(slides: { chapter: string }[]) {
  return new Set(slides.map((s) => s.chapter)).size;
}

export default Index;
