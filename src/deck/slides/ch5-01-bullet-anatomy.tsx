import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockOutline, Chip } from "../components/MockUI";
import { BehaviorCard } from "../components/BehaviorCard";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 5 · Bullet anatomy" title="Three things hide on every row">
      <div className="grid grid-cols-[1.1fr_1fr] gap-8">
        <MockWindow>
          <div className="p-8 bg-background min-h-[420px]">
            <MockOutline
              rows={[
                {
                  text: "The quick brown fox",
                  badges: (
                    <>
                      <Chip>☐</Chip>
                      <Chip tone="warn">📅 Today</Chip>
                      <Chip tone="primary">🪞</Chip>
                    </>
                  ),
                },
                { text: "Sibling row" },
                { text: "Another sibling", children: [{ text: "Nested child" }] },
              ]}
            />
            <div className="mt-8 space-y-1 text-sm text-muted-foreground">
              <div><span className="font-mono text-foreground">⋮</span> row menu — appears on hover or ⌘/</div>
              <div><span className="font-mono text-foreground">•</span> bullet — drag handle + zoom-in target</div>
              <div><span className="font-mono text-foreground">▶</span> expand/collapse — when item has children</div>
            </div>
          </div>
        </MockWindow>
        <BehaviorCard
          title="Hover reveals"
          items={[
            { trigger: "▶", result: "Expand/collapse triangle (when item has children)." },
            { trigger: "☐", result: "Task checkbox (when ItemTypeId = Task)." },
            { trigger: "📅", result: "Due date chip (when DueDate set)." },
            { trigger: "🪞", result: "Mirror badge (when MirrorOfItemId set)." },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
