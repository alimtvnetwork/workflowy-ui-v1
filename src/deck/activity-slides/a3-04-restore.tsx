import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-3 · Feed UI" title="Restore — the only write the feed surface can do"
      subtitle="And it doesn't write to ActivityEvent directly. It triggers an editor action, which flows through captureEvent.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`function ItemDeletedRow({ event }: { event: ActivityEvent }) {
  const canRestore = isWithin30Days(event.OccurredAt);
  return (
    <Row>
      <RowSummary>{event.ActorUserId} deleted {event.TargetItemId}</RowSummary>
      {canRestore && <RestoreItemButton itemId={event.TargetItemId} />}
    </Row>
  );
}

// Button calls a normal editor action. Action calls captureEvent.
// captureEvent emits ItemRestored. Feed re-renders via SSE invalidate.
function RestoreItemButton({ itemId }: { itemId: ItemId }) {
  return <button onClick={() => restoreItem({ itemId })}>Restore</button>;
}`}
      </pre>
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Hidden, not disabled</div>
          <p className="text-base text-muted-foreground">
            When <code>OccurredAt + 30d ≤ now()</code> the trash row no longer
            exists. The button MUST be hidden — not disabled — so a determined
            user can't right-click → inspect → trigger it. Defense in depth.
          </p>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Audit of the audit</div>
          <p className="text-base text-muted-foreground">
            Every restore itself emits an <code>ActivityEvent</code>{" "}
            (<code>EventType: ItemRestored</code>) so the chain stays
            inspectable. Silent restores are forbidden by{" "}
            <code>AT-ACTIVITYFEED-12</code>.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-UI-RESTORE-VIA-CAPTURE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-UI-RESTORE-WINDOW</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-12</span>
      </div>
    </SlideLayout>
  );
}
