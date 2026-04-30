import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 7 · Search" title="How it works">
      <StepList
        steps={[
          { action: "Press ⌘K (or click 🔍 in navbar)", result: "Popover opens, focused" },
          { action: "Type a query", result: "Debounced 150ms; results split into Items / Tags / Commands" },
          { action: "Use #tag, @user, due:today operators", result: "Server narrows the result set" },
          { action: "Press ⏎", result: "Navigate to the item (zoom in)" },
          { action: "Press ⌘⇧S on a query", result: "Saves it as a Saved Search (sidebar shortcut)" },
        ]}
      />
    </SlideLayout>
  );
}
