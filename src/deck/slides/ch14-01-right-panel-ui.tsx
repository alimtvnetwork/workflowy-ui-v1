import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 14 · Right-side panel" title="Handbook, hotkeys, what's new">
      <Wireframe>{`  Toggle with ⓘ in navbar →
  ┌──────────────── Right panel (collapsible) ────────────────┐
  │  [ Handbook ]  [ Hotkeys ]  [ What's New ]                │
  ├───────────────────────────────────────────────────────────┤
  │  HANDBOOK                                                 │
  │   ▾ Getting started                                       │
  │     • The bullet                                          │
  │     • Zooming                                             │
  │   ▾ Power moves                                           │
  │     • Mirrors                                             │
  │     • Templates                                           │
  │                                                           │
  │  (English only at launch · structure + content)           │
  └───────────────────────────────────────────────────────────┘`}</Wireframe>
    </SlideLayout>
  );
}
