import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 8 · How it works" title="Dates flow from a single column">
      <StepList
        steps={[
          { action: "Type a date in any item (e.g. 'tomorrow')", result: "Parser sets Item.DueDate" },
          { action: "Open Today view", result: "Lists items where DueDate = today (user timezone)" },
          { action: "Click a calendar day", result: "Filtered list of items due that day" },
          { action: "Drag an item between days", result: "Updates DueDate atomically" },
          { action: "Press ⌘⇧N", result: "Quick Add modal — title + optional date → appends to Inbox" },
        ]}
      />
    </SlideLayout>
  );
}
