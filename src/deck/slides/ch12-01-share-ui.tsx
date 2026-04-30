import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 12 · Share dialog" title="Invite people or publish a link">
      <Wireframe>{`  ┌──── Share "Q3 Roadmap" ────────────────────────────────┐
  │                                                         │
  │  Invite by email:                                       │
  │  [ alice@acme.com           ]   [Editor ▾]   [Invite]   │
  │                                                         │
  │  People with access                                     │
  │   👤 you             Owner                              │
  │   👤 alice@acme.com  Editor   ⋮                         │
  │   👤 bob@acme.com    Viewer   ⋮                         │
  │                                                         │
  │  Public link:  ◯ Off   ● View only   ○ Can edit         │
  │   https://wf.app/p/aBc123XyZ           [Copy]           │
  │                                                         │
  └─────────────────────────────────────────────────────────┘`}</Wireframe>
    </SlideLayout>
  );
}
