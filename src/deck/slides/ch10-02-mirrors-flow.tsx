import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 10 · Mirrors" title="Create, detach, prevent cycles">
      <StepList
        steps={[
          { action: "⋮ → Mirror to… on any item", result: "Picker opens; choose target parent" },
          { action: "Mirror placeholder appears under target", result: "MirrorOfItemId = source ItemId" },
          { action: "Try to mirror an ancestor under itself", result: "Server rejects (cycle detection, C2)" },
          { action: "⋮ → Detach mirror", result: "Becomes a real copy (MirrorOfItemId = NULL)" },
          { action: "Source item deleted", result: "BrokenAt set on every mirror placeholder" },
        ]}
      />
    </SlideLayout>
  );
}
