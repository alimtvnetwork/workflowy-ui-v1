import { useState } from "react";
import { ChevronLeft, ChevronRight, Grid3x3, Maximize, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScaledSlide } from "./ScaledSlide";
import { slides } from "./slides";
import { useDeckNav } from "./useDeckNav";

export function DeckShell() {
  const { index, setIndex, next, prev, grid, setGrid } = useDeckNav(slides.length);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(document.documentElement.classList.contains("dark"));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const Current = slides[index].Component;

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground">
      {/* Toolbar */}
      <header className="h-14 shrink-0 border-b border-border flex items-center gap-2 px-4">
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen((s) => !s)}>
          {sidebarOpen ? "Hide thumbnails" : "Show thumbnails"}
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" onClick={prev} aria-label="Previous slide">
          <ChevronLeft />
        </Button>
        <span className="text-sm tabular-nums text-muted-foreground min-w-[80px] text-center">
          {index + 1} / {slides.length}
        </span>
        <Button variant="ghost" size="icon" onClick={next} aria-label="Next slide">
          <ChevronRight />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" onClick={() => setGrid((g) => !g)} aria-label="Grid view">
          <Grid3x3 />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label="Fullscreen">
          <Maximize />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme">
          {dark ? <Sun /> : <Moon />}
        </Button>
      </header>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {sidebarOpen && (
          <aside className="w-64 shrink-0 border-r border-border overflow-y-auto p-3 space-y-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                className={`w-full text-left rounded-md border p-3 transition-colors ${
                  i === index
                    ? "border-primary bg-accent"
                    : "border-border hover:bg-muted/60"
                }`}
              >
                <div className="text-xs text-muted-foreground">{i + 1} · {s.chapter}</div>
                <div className="text-sm font-medium text-foreground line-clamp-2">{s.title}</div>
              </button>
            ))}
          </aside>
        )}

        <main className="flex-1 relative overflow-hidden bg-muted/30">
          <ScaledSlide>
            <Current />
          </ScaledSlide>
        </main>
      </div>

      {/* Grid overlay */}
      {grid && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
          <div className="sticky top-0 h-14 flex items-center px-4 border-b border-border bg-background">
            <div className="font-medium">All slides</div>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={() => setGrid(false)} aria-label="Close grid">
              <X />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-6 p-6">
            {slides.map((s, i) => {
              const Thumb = s.Component;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setIndex(i);
                    setGrid(false);
                  }}
                  className="group text-left"
                >
                  <div className="relative aspect-video rounded-lg border border-border overflow-hidden bg-background group-hover:border-primary transition-colors">
                    <ScaledSlide>
                      <Thumb />
                    </ScaledSlide>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{i + 1} · {s.chapter}</div>
                  <div className="text-sm font-medium text-foreground line-clamp-1">{s.title}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
