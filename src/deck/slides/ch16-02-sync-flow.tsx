import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 16 · Sync flow" title="Online, offline, reconnect">
      <StepList
        steps={[
          { action: "Edit anything", result: "Op queued in IndexedDB outbox + applied optimistically" },
          { action: "Network OK → flush every 500ms", result: "POST /sync with ops + last cursor" },
          { action: "Offline → queue grows", result: "UI shows '⚠ Offline – changes will sync'" },
          { action: "Reconnect", result: "Outbox flushed in order; remote ops merged via LWW" },
          { action: "Server returns new cursor", result: "Client persists; next sync starts from there" },
        ]}
      />
    </SlideLayout>
  );
}
