import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 19 · Activity Feed" title="Who did what, when">
      <Wireframe>{`  /admin/activity                                   [filter ▾]
  ─────────────────────────────────────────────────────────
  10:42  alice    moved      "Q3 OKRs" → Work
  10:39  bob      created    "Daily standup"
  10:35  alice    completed  "Pay rent"
  10:30  carol    shared     "Roadmap" with bob (Editor)
  10:14  system   reaped     43 items (>30d in trash)
  09:58  bob      restored   "Old draft"
  ─────────────────────────────────────────────────────────
  Source: ActivityLog (append-only).  Retention: 90 days
  then archived to cold storage. Purge job runs nightly.`}</Wireframe>
    </SlideLayout>
  );
}
