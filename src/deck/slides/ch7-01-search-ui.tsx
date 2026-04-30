import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 7 · Search" title="Command palette + content search" subtitle="One popover. Press ⌘K from anywhere.">
      <Wireframe>{`        ┌──── Search popover (⌘K) ─────────────────────────────┐
        │  🔍  q3 roa|                                          │
        ├───────────────────────────────────────────────────────┤
        │  RECENT                                               │
        │   • Q3 Roadmap            Home › Work                 │
        │  ITEMS                                                │
        │   • Ship onboarding v2    Q3 Roadmap        ⏎         │
        │   • Q3 Hiring plan        Work                        │
        │  TAGS                                                 │
        │   #q3-planning            12 items                    │
        │  COMMANDS                                             │
        │   ＋ New item in Inbox    ⌘⇧N                         │
        │   ☾ Toggle theme                                      │
        └───────────────────────────────────────────────────────┘
   ↑/↓ navigate · ⏎ open · ⌘⏎ open in new zoom · Esc close`}</Wireframe>
    </SlideLayout>
  );
}
