import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ScaledSlide } from "@/deck/ScaledSlide";
import { slides as frontendSlides } from "@/deck/slides";
import { backendSlides } from "@/deck/backend-slides";
import { opsSlides } from "@/deck/ops-slides";
import { enforcementSlides } from "@/deck/enforcement-slides";
import { attachNotes } from "@/deck/notes";
import {
  clearOverride,
  exportOverridesAsJson,
  getAllOverrides,
  getOverride,
  importOverridesFromJson,
  setOverride,
} from "@/deck/noteOverrides";
import type { SlideMeta } from "@/deck/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DECKS: Record<string, { title: string; slides: SlideMeta[]; audience: string }> = {
  frontend:    { title: "Frontend Deck",     slides: attachNotes(frontendSlides),    audience: "deck" },
  backend:     { title: "Backend Deck",      slides: attachNotes(backendSlides),     audience: "backend-deck" },
  ops:         { title: "Operations",        slides: attachNotes(opsSlides),         audience: "ops-deck" },
  enforcement: { title: "Enforcement Rules", slides: attachNotes(enforcementSlides), audience: "enforcement-deck" },
};

export default function Presenter() {
  const [params, setParams] = useSearchParams();
  const q = params.get("deck");
  const which = q === "backend" || q === "ops" || q === "enforcement" ? q : "frontend";
  const { title, slides } = DECKS[which];

  const [index, setIndex] = useState(() => Number(params.get("i") ?? 0));
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importDraft, setImportDraft] = useState("");
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [, forceTick] = useState(0);

  // Sync index → URL (so refresh keeps position)
  useEffect(() => {
    const p = new URLSearchParams(params);
    p.set("i", String(index));
    setParams(p, { replace: true });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setIndex((i) => Math.min(slides.length - 1, i + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Home") setIndex(0);
      else if (e.key === "End") setIndex(slides.length - 1);
      else if (e.key === "t" || e.key === "T") setRunning((r) => !r);
      else if (e.key === "r" || e.key === "R") { setElapsed(0); setRunning(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  const cur = slides[index];
  const nxt = slides[index + 1];
  const Cur = cur.Component;
  const Nxt = nxt?.Component;

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <header className="h-12 shrink-0 border-b border-border flex items-center gap-4 px-4 text-sm">
        <strong>{title} — Presenter</strong>
        <span className="text-muted-foreground tabular-nums">
          {index + 1} / {slides.length}
        </span>
        <div className="flex-1" />
        <button
          onClick={() => setRunning((r) => !r)}
          className="px-2 py-1 rounded bg-muted hover:bg-muted/70"
        >
          {running ? "⏸ Pause" : "▶ Start"} timer
        </button>
        <span className="font-mono tabular-nums w-16 text-right">{fmt(elapsed)}</span>
        <button
          onClick={() => { setElapsed(0); setRunning(false); }}
          className="px-2 py-1 rounded bg-muted hover:bg-muted/70"
        >
          Reset
        </button>
        <button
          onClick={() => {
            const json = exportOverridesAsJson();
            const count = Object.keys(getAllOverrides()).length;
            navigator.clipboard?.writeText(json);
            alert(`Copied ${count} note override(s) to clipboard as JSON.`);
          }}
          className="px-2 py-1 rounded bg-muted hover:bg-muted/70"
          title="Copy all per-slide note overrides to clipboard"
        >
          Export edits
        </button>
        <Link to={`/${DECKS[which].audience}`}
              className="text-muted-foreground hover:text-foreground underline ml-2">
          Open audience view →
        </Link>
      </header>

      <div className="flex-1 grid grid-cols-[2fr_1fr] gap-4 p-4 min-h-0">
        {/* Left column: current slide + notes */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="relative flex-1 min-h-0 rounded-lg border border-border bg-muted/20 overflow-hidden">
            <ScaledSlide><Cur /></ScaledSlide>
          </div>
          <NotesPanel slide={cur} />
        </div>

        {/* Right column: next slide + nav */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Next up</div>
          <div className="relative aspect-video rounded-lg border border-border bg-muted/20 overflow-hidden">
            {Nxt ? <ScaledSlide><Nxt /></ScaledSlide> : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                — End of deck —
              </div>
            )}
          </div>
          {nxt && (
            <div className="text-sm">
              <div className="text-xs text-muted-foreground">{nxt.chapter}</div>
              <div className="font-medium">{nxt.title}</div>
            </div>
          )}
          <div className="mt-auto text-xs text-muted-foreground space-y-1">
            <div><kbd className="px-1 py-0.5 rounded bg-muted">←</kbd> / <kbd className="px-1 py-0.5 rounded bg-muted">→</kbd> navigate</div>
            <div><kbd className="px-1 py-0.5 rounded bg-muted">T</kbd> start/pause timer · <kbd className="px-1 py-0.5 rounded bg-muted">R</kbd> reset</div>
            <div><kbd className="px-1 py-0.5 rounded bg-muted">Home</kbd> / <kbd className="px-1 py-0.5 rounded bg-muted">End</kbd> jump</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function NotesPanel({ slide }: { slide: SlideMeta }) {
  const baseline = slide.notes ?? "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [override, setOverrideState] = useState<string | undefined>(() => getOverride(slide.id));
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Reset local state whenever the slide changes
  useEffect(() => {
    setEditing(false);
    setOverrideState(getOverride(slide.id));
  }, [slide.id]);

  const displayed = useMemo(() => override ?? baseline, [override, baseline]);
  const hasOverride = override !== undefined;

  function startEdit() {
    setDraft(displayed);
    setEditing(true);
    setTimeout(() => taRef.current?.focus(), 0);
  }
  function save() {
    setOverride(slide.id, draft);
    setOverrideState(draft);
    setEditing(false);
  }
  function cancel() {
    setEditing(false);
  }
  function reset() {
    clearOverride(slide.id);
    setOverrideState(undefined);
    setEditing(false);
  }

  return (
    <div className="h-56 shrink-0 rounded-lg border border-border bg-card p-5 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Speaker notes · {slide.chapter} · {slide.title}
          {hasOverride && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-primary/15 text-primary normal-case tracking-normal">
              edited
            </span>
          )}
        </div>
        <div className="flex gap-1.5 text-xs">
          {!editing ? (
            <>
              <button onClick={startEdit} className="px-2 py-0.5 rounded bg-muted hover:bg-muted/70">
                Edit
              </button>
              {hasOverride && (
                <button onClick={reset} className="px-2 py-0.5 rounded bg-muted hover:bg-muted/70">
                  Reset
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={save} className="px-2 py-0.5 rounded bg-primary text-primary-foreground hover:opacity-90">
                Save
              </button>
              <button onClick={cancel} className="px-2 py-0.5 rounded bg-muted hover:bg-muted/70">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          ref={taRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); save(); }
            if (e.key === "Escape") { e.preventDefault(); cancel(); }
          }}
          className="flex-1 resize-none rounded border border-border bg-background p-3 text-[15px] leading-relaxed font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Speaker notes for this slide…"
        />
      ) : displayed ? (
        <pre className="flex-1 overflow-y-auto whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground m-0">
          {displayed}
        </pre>
      ) : (
        <div className="flex-1 text-muted-foreground italic text-sm">
          No notes for this slide. Click <strong>Edit</strong> to add one (id <code>{slide.id}</code>).
        </div>
      )}
    </div>
  );
}
