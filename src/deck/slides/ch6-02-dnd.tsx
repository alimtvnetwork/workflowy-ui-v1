import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 6 · Drag & Drop" title="Move by dragging the bullet">
      <StepList
        steps={[
          { action: "Press on a bullet •", result: "Row lifts (ghost preview follows the cursor)" },
          { action: "Drag over another row", result: "Drop indicator: line above (sibling) or pill (child)" },
          { action: "Hold ⌥ while dropping", result: "Creates a Mirror instead of moving the original" },
          { action: "Drop on a column header in Board view", result: "Re-parents the card into that column" },
          { action: "Drop into the sidebar", result: "Adds a Favorite (or Mirror with ⌥)" },
        ]}
      />
    </SlideLayout>
  );
}
