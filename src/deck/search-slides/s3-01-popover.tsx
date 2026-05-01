import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-3 · Surface" title="The popover is one portal, anchored at app root"
      subtitle="Sibling of EditorBoundary, never a child. ⌘K opens; Esc closes; ↑/↓/⏎ navigate.">
      <Wireframe>{`        ┌──── Search popover (⌘K) ─────────────────────────────┐
        │  🔍  is:todo @alice this-week|             ✕ ⚙ ?       │
        │      [is:todo] [@alice] [this-week]                    │
        ├───────────────────────────────────────────────────────┤
        │  Filters:  All  Items  Tags  People  Recent           │
        ├───────────────────────────────────────────────────────┤
        │  RESULTS · 12 items (250-cap viewport)                │
        │   ◉ Refactor onboarding flow      Q3 › Bugs   100     │
        │   • Ship invoice fix              Work       80       │
        │   • Update docs                   Inbox      60       │
        │   • …                                                 │
        ├───────────────────────────────────────────────────────┤
        │  ↑/↓ navigate · ⏎ open · ⌘⏎ open in zoom · Esc close │
        └───────────────────────────────────────────────────────┘`}</Wireframe>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">data-testid="search-overlay"</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">React-Router v7 loader</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">@tanstack/react-virtual</span>
      </div>
    </SlideLayout>
  );
}
