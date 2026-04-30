import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 9 · Board view" title="A BoardProject renders its children as columns">
      <Wireframe>{`  ▣  Q3 Roadmap   (ItemTypeId = BoardProject)
  ────────────────────────────────────────────────────────────────
  ┌── Todo ─────┐  ┌── Doing ───┐  ┌── Done ────┐  ┌── + Column ─┐
  │ • Land DS   │  │ • Hire eng │  │ ☑ Onboard  │  │             │
  │ • Q3 OKRs   │  │ • Refactor │  │ ☑ Launch   │  │             │
  │ • Pricing   │  │            │  │            │  │             │
  │ + Add card  │  │ + Add card │  │ + Add card │  │             │
  └─────────────┘  └────────────┘  └────────────┘  └─────────────┘

  • Each column = a child Item (ItemTypeId = BoardColumn)
  • Each card  = a grandchild Item (any type)
  • Drag a card → updates ParentItemId + FractionalIndex`}</Wireframe>
    </SlideLayout>
  );
}
