import { Link } from "react-router-dom";
import { slides as frontendSlides } from "@/deck/slides";
import { backendSlides } from "@/deck/backend-slides";
import { opsSlides } from "@/deck/ops-slides";

const Index = () => {
  const fePhases = countChapters(frontendSlides);
  const bePhases = countChapters(backendSlides);
  const opsPhases = countChapters(opsSlides);

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
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <DeckCard
            to="/deck"
            kicker="Frontend"
            title="Product walkthrough"
            blurb="Item model, views, sync UX, mirrors, templates, sharing, trash, settings, admin."
            stats={[
              { label: "Slides", value: frontendSlides.length },
              { label: "Chapters", value: fePhases },
            ]}
          />
          <DeckCard
            to="/backend-deck"
            kicker="Backend"
            title="Systems deep-dive"
            blurb="Process model, auth, sync protocol, item ops, mirrors, jobs, search, migrations, deployment."
            stats={[
              { label: "Slides", value: backendSlides.length },
              { label: "Phases", value: bePhases },
            ]}
          />
          <DeckCard
            to="/ops-deck"
            kicker="Operations"
            title="Run it in production"
            blurb="SLOs, metrics, alerts, dashboards, on-call rotation, incident playbooks."
            stats={[
              { label: "Slides", value: opsSlides.length },
              { label: "Phases", value: opsPhases },
            ]}
          />
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
            {" "}— then Cmd/Ctrl-P → Save as PDF.
          </div>
          <div>
            Presenter mode:{" "}
            <Link to="/presenter?deck=frontend" className="underline hover:text-foreground">frontend</Link>
            {" · "}<Link to="/presenter?deck=backend" className="underline hover:text-foreground">backend</Link>
            {" · "}<Link to="/presenter?deck=ops" className="underline hover:text-foreground">ops</Link>
            {" "}— current slide, next slide, speaker notes, and a timer.
          </div>
          <div>
            Reference implementation:{" "}
            <Link to="/api-playground" className="underline hover:text-foreground">applyOp playground</Link>
            {" "}— interactive items + op-journal in IndexedDB, mirrors the universal envelope.
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
