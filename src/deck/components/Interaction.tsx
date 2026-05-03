import type { ReactNode } from "react";

/**
 * Before → action → After visualization.
 * Each pane is a rendered UI snapshot; the middle column describes the trigger in plain English.
 */
export function Interaction({
  before,
  action,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: ReactNode;
  action: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
      <Pane label={beforeLabel}>{before}</Pane>
      <div className="flex flex-col items-center justify-center px-2 max-w-[260px]">
        <div className="text-3xl text-muted-foreground mb-3">→</div>
        <div className="text-base text-foreground text-center leading-snug">{action}</div>
      </div>
      <Pane label={afterLabel}>{after}</Pane>
    </div>
  );
}

function Pane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex-1 rounded-xl border border-border bg-muted/20 p-4">{children}</div>
    </div>
  );
}
