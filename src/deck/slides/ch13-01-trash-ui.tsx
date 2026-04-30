import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 13 · Trash" title="Soft-delete, then a 30-day grace period">
      <Wireframe>{`  🗑  Trash                                  [Empty trash]
  ─────────────────────────────────────────────────────────
  Deleted          Item                       Restore
  ─────────────────────────────────────────────────────────
  2 hours ago      • Old meeting notes        ↺  Restore
  Yesterday        ▾ Archived sprint          ↺  Restore
                     (12 child items)
  3 days ago       ☐ Draft email              ↺  Restore
  29 days ago      • Stale idea               ↺  Restore   ← reaper soon

  • Restore puts the item (and subtree) back at its original parent.
  • After 30 days the daily reaper hard-deletes the row.`}</Wireframe>
    </SlideLayout>
  );
}
