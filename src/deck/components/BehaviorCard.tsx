import type { ReactNode } from "react";

type Behavior = {
  trigger: string;       // e.g. "On click", "When user types /"
  result: ReactNode;     // plain English outcome
  detail?: ReactNode;    // optional secondary line
};

/**
 * Plain-English behavior list. Replaces code blocks on UI/feature slides.
 */
export function BehaviorCard({ title, items }: { title?: string; items: Behavior[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {title && <div className="text-xl font-semibold text-foreground mb-4">{title}</div>}
      <ul className="space-y-4">
        {items.map((b, i) => (
          <li key={i} className="grid grid-cols-[180px_1fr] gap-4 items-baseline">
            <span className="text-sm font-mono text-primary">{b.trigger}</span>
            <div>
              <div className="text-foreground">{b.result}</div>
              {b.detail && <div className="text-sm text-muted-foreground mt-1">{b.detail}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
