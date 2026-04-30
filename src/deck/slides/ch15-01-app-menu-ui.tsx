import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 15 · App menu (⋮)" title="Themes, fonts, density, settings">
      <Wireframe>{`   ⋮  navbar app menu
   ┌──────────────────────────────────────┐
   │  Theme                ◐  Light / Dark│
   │  Font                 Aa  Sans / Serif/ Mono │
   │  Density              ⇕  Cosy / Compact      │
   │  Fractal conversations  [toggle]              │
   │  ─────────────────────────────────────       │
   │  ⚙  Settings                                  │
   │  👥 User management   (admin only)            │
   │  📨 Send feedback                              │
   │  ⎋  Sign out                                   │
   └──────────────────────────────────────────────┘

  • Light + Dark only at launch (named palettes deferred).
  • Choices persist on User row (Theme, Font, Density).`}</Wireframe>
    </SlideLayout>
  );
}
