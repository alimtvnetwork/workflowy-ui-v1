import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockOutline, Chip } from "../components/MockUI";
import { BehaviorCard } from "../components/BehaviorCard";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 6 · Multi-select" title="Pick many, act once">
      <div className="grid grid-cols-[1.1fr_1fr] gap-8">
        <MockWindow>
          <div className="p-8 bg-background min-h-[440px] relative">
            <MockOutline
              rows={[
                { text: "Item A" },
                { text: "Item B", highlight: true },
                { text: "Item C", highlight: true },
                { text: "Item D", highlight: true },
                { text: "Item E" },
              ]}
            />
            {/* Selection bar */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-2 rounded-full border border-border bg-card shadow-2xl px-4 py-2">
              <Chip tone="primary">3 selected</Chip>
              <span className="w-px h-5 bg-border" />
              {["Move", "Mirror", "Duplicate", "Tag", "Complete", "Delete"].map((b) => (
                <button key={b} className="px-3 py-1 text-sm rounded hover:bg-muted text-foreground">
                  {b}
                </button>
              ))}
            </div>
          </div>
        </MockWindow>
        <BehaviorCard
          title="Keyboard"
          items={[
            { trigger: "Click", result: "Select one" },
            { trigger: "Shift + Click", result: "Range select" },
            { trigger: "⌘ + Click", result: "Toggle individual" },
            { trigger: "Esc", result: "Clear selection" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
