import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-3 · Feed UI" title="The row dispatcher is exhaustive — no `default:`"
      subtitle="One <ActivityRow> component per EventType. The Record<EventType, …> bound makes the compiler enforce coverage.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`const RowByType: Record<EventType, FC<{ event: ActivityEvent }>> = {
  ItemCreated:          ItemCreatedRow,
  ItemUpdated:          ItemUpdatedRow,
  ItemMoved:            ItemMovedRow,
  ItemDeleted:          ItemDeletedRow,
  ItemRestored:         ItemRestoredRow,
  ItemMirrored:         ItemMirroredRow,
  BoardColumnReordered: BoardColumnReorderedRow,
  TemplateApplied:      TemplateAppliedRow,
};

function ActivityRow({ event }: { event: ActivityEvent }) {
  const Row = RowByType[event.EventType];   // exhaustive — TS catches gaps
  return <Row event={event} />;
}`}
      </pre>
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Why no default:</div>
          <p className="text-base text-muted-foreground">
            A <code>default:</code> case would silently render new
            <code> EventType</code>s as "unknown event". The team would ship a
            new event type, forget the row component, and never notice. The
            dispatcher catches it at compile time instead.
          </p>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Virtualization</div>
          <p className="text-base text-muted-foreground">
            Lists ≥1000 rows MUST use <code>&lt;DataList virtualized&gt;</code>{" "}
            per ADR-0017. A naive map over thousands of rows would blow the
            scroll budget on the first paint.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-UI-EXHAUSTIVE-DISPATCHER</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-11</span>
      </div>
    </SlideLayout>
  );
}
