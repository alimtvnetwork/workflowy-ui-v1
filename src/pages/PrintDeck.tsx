import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { slides as frontendSlides } from "@/deck/slides";
import { backendSlides } from "@/deck/backend-slides";
import { opsSlides } from "@/deck/ops-slides";
import type { SlideMeta } from "@/deck/types";

const DECKS: Record<string, { title: string; slides: SlideMeta[] }> = {
  frontend: { title: "WorkFlowy — Frontend Deck", slides: frontendSlides },
  backend:  { title: "WorkFlowy — Backend Deck",  slides: backendSlides },
  ops:      { title: "WorkFlowy — Operations",    slides: opsSlides },
};

export default function PrintDeck() {
  const [params] = useSearchParams();
  const q = params.get("deck");
  const which = q === "backend" || q === "ops" ? q : "frontend";
  const { title, slides } = DECKS[which];

  useEffect(() => { document.title = title + " — Print"; }, [title]);

  return (
    <>
      <style>{`
        @page { size: 1920px 1080px; margin: 0; }
        @media print {
          html, body { background: white !important; margin: 0; padding: 0; }
          .print-toolbar { display: none !important; }
          .print-page { page-break-after: always; break-after: page; box-shadow: none !important; border: none !important; margin: 0 !important; }
          .print-page:last-child { page-break-after: auto; break-after: auto; }
        }
        .print-page {
          width: 1920px;
          height: 1080px;
          position: relative;
          overflow: hidden;
          background: hsl(var(--background));
          margin: 24px auto;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .print-shell {
          /* Scale-to-screen for on-screen preview, no scaling for print */
          transform: scale(var(--print-scale, 1));
          transform-origin: top center;
          width: 1920px;
        }
        @media print { .print-shell { transform: none; } }
      `}</style>

      <div className="print-toolbar sticky top-0 z-50 bg-background border-b border-border px-6 py-3 flex items-center gap-4 text-sm">
        <strong className="text-foreground">{title}</strong>
        <span className="text-muted-foreground">{slides.length} slides</span>
        <div className="flex-1" />
        <a href={which === "frontend" ? "/print?deck=backend" : "/print?deck=frontend"}
           className="text-muted-foreground hover:text-foreground underline">
          Switch to {which === "frontend" ? "backend" : "frontend"} deck
        </a>
        <button onClick={() => window.print()}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90">
          Print / Save as PDF
        </button>
      </div>

      <PrintScaler>
        {slides.map((s, i) => {
          const C = s.Component;
          return (
            <div key={s.id} className="print-page">
              <C />
              <div className="absolute bottom-4 right-6 text-xs text-muted-foreground tabular-nums">
                {i + 1} / {slides.length}
              </div>
            </div>
          );
        })}
      </PrintScaler>
    </>
  );
}

/**
 * Scales the 1920px-wide stack down to viewport width on screen.
 * Print CSS resets the scale so each page prints at native size.
 */
function PrintScaler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const update = () => {
      const scale = Math.min(1, (window.innerWidth - 32) / 1920);
      document.documentElement.style.setProperty("--print-scale", String(scale));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return <div className="print-shell">{children}</div>;
}
