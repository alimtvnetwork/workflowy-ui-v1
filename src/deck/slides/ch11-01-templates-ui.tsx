import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 11 · Templates" title="Save a subtree, stamp it anywhere">
      <Wireframe>{`  STEP 1 · Snapshot              STEP 2 · Apply
  ───────────────────           ─────────────────────────
  ▾ Weekly Review               Pick template:  Weekly Review
    • Wins                          ↓
    • Blockers                  Choose target parent
    • Plan next week                ↓
    ⋮ → Save as template…       ⋮ → Apply template here
                                    ↓
  Template row stored:          New subtree appears,
   • Name                         deep-copied with fresh
   • Payload (JSON snapshot)      ItemIds.
   • NodeCount`}</Wireframe>
    </SlideLayout>
  );
}
