import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockNavbar, MockOutline } from "../components/MockUI";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 4 · Editor" title="Inside an editable row">
      <MockWindow className="mx-auto max-w-[1300px]">
        <MockNavbar breadcrumb="Home › Q3 Roadmap" />
        <div className="p-10 bg-background min-h-[460px] relative">
          {/* Floating toolbar */}
          <div className="absolute left-32 top-16 flex items-center gap-1 rounded-lg border border-border bg-card shadow-xl px-3 py-2 text-sm">
            <button className="px-2 py-1 rounded hover:bg-muted font-bold">B</button>
            <button className="px-2 py-1 rounded hover:bg-muted italic">I</button>
            <button className="px-2 py-1 rounded hover:bg-muted underline">U</button>
            <button className="px-2 py-1 rounded hover:bg-muted line-through">S</button>
            <span className="w-px h-5 bg-border mx-1" />
            <button className="px-2 py-1 rounded hover:bg-muted">H1</button>
            <button className="px-2 py-1 rounded hover:bg-muted">H2</button>
            <button className="px-2 py-1 rounded hover:bg-muted">H3</button>
            <span className="w-px h-5 bg-border mx-1" />
            <button className="px-2 py-1 rounded hover:bg-muted">A▾</button>
            <button className="px-2 py-1 rounded hover:bg-muted">⬛▾</button>
            <button className="px-2 py-1 rounded hover:bg-muted font-mono">{"</>"}</button>
            <button className="px-2 py-1 rounded hover:bg-muted">❝</button>
            <button className="px-2 py-1 rounded hover:bg-muted">🔗</button>
          </div>
          <div className="mt-32">
            <MockOutline
              rows={[
                {
                  text: (
                    <span>
                      The <span className="bg-primary/30">quick brown fox</span> jumps over the lazy dog
                      <span className="inline-block w-0.5 h-5 bg-primary align-middle ml-0.5 animate-pulse" />
                    </span>
                  ),
                },
              ]}
            />
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div><span className="text-foreground font-mono">⋮</span> — row menu (Move, Mirror, Share, Delete…)</div>
            <div><span className="text-foreground font-mono">•</span> — bullet (drag handle / click to zoom)</div>
            <div><span className="text-foreground">Selection</span> — floating toolbar appears</div>
          </div>
        </div>
      </MockWindow>
    </SlideLayout>
  );
}
