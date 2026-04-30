import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 6 · Multi-select" title="Pick many, act once">
      <Wireframe>{`   ▢  • Item A
   ▣  • Item B   ← clicked
   ▣  • Item C   ← shift-clicked  (range select)
   ▣  • Item D
   ▢  • Item E

   Selection bar appears at bottom:
   ┌──────────────────────────────────────────┐
   │  3 items selected   [Move] [Mirror]      │
   │  [Duplicate] [Tag] [Complete] [Delete]   │
   └──────────────────────────────────────────┘

   Keyboard:
     Click            → select one
     Shift + Click    → range
     ⌘ + Click        → toggle individual
     Esc              → clear`}</Wireframe>
    </SlideLayout>
  );
}
