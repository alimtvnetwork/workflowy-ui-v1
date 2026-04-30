import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 2 · App Shell" title="The frame around every page">
      <Wireframe caption="Top: Navbar. Left: Sidebar (offcanvas). Center: Page area. Right: collapsible panel.">{`┌────────────────────────────────────────────────────────────────────────────┐
│ ☰  WorkFlowy   Home › Work › Q3 Roadmap          🔍   ＋   ⓘ   👤  ⋮     │  ← Navbar
├──────────────┬─────────────────────────────────────────────┬───────────────┤
│ ★ Today      │                                             │  Handbook     │
│ ☐ Inbox      │   ▾ Q3 Roadmap                              │  Hotkeys      │
│ ✎ Drafts     │     • Ship onboarding v2                    │  What's New   │
│ @ Mentions   │     • Hire 2 engineers                      │               │
│ 📅 Calendar  │     • Land design system                    │   (toggle ⓘ)  │
│ 🗑 Trash     │                                             │               │
│ ＋ New node  │                                             │               │
└──────────────┴─────────────────────────────────────────────┴───────────────┘`}</Wireframe>
    </SlideLayout>
  );
}
