import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 3 · Zoom in / out" title="The bullet is the navigation">
      <StepList
        steps={[
          { action: "Click any bullet • on the page", result: "That Item becomes the page root (focused)" },
          { action: "Breadcrumb updates with full ancestor chain", result: "Click any segment to zoom out to that ancestor" },
          { action: "Press ⌘← / ⌘→", result: "Browser-history-style back / forward through zooms" },
          { action: "URL updates to /item/:id", result: "Shareable; refresh keeps you focused on the same node" },
        ]}
      />
    </SlideLayout>
  );
}
