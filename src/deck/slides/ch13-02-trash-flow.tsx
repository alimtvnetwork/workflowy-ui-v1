import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 13 · Restore & reaper" title="Lifecycle of a deleted item">
      <StepList
        steps={[
          { action: "Delete an item (⋮ → Delete or selection bar)", result: "DeletedAt = now; row hidden from outline" },
          { action: "Open Trash → click ↺ Restore", result: "DeletedAt cleared; subtree reappears under original parent" },
          { action: "Original parent is also deleted", result: "Restore puts it back at Home root" },
          { action: "30 days pass with no restore", result: "Daily reaper job hard-deletes the row (C3)" },
          { action: "Click Empty trash", result: "All deleted rows hard-deleted immediately (confirm dialog)" },
        ]}
      />
    </SlideLayout>
  );
}
