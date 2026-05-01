import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-4 · Retention" title="The server purge — batched, exclusive, idempotent"
      subtitle="One job. PRAGMA EXCLUSIVE on the tx. 5,000 rows per batch. Filter by the indexed PurgeAfter column.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`function PurgeJob.run() {
  cutoffIso  = clock.nowIso() − 30 days     // injected clock per ADR-0027
  totalPurged = 0
  loop:
    rows = SELECT ActivityEventId
           FROM ActivityEvent
           WHERE PurgeAfter <= :cutoffIso   // uses IX_ActivityEvent_PurgeAfter
           ORDER BY ActivityEventId ASC
           LIMIT 5000;
    if rows.empty: break
    BEGIN EXCLUSIVE TRANSACTION
      DELETE FROM ActivityEvent WHERE ActivityEventId IN (rows);
    COMMIT
    totalPurged += rows.length
  emit Telemetry { Event: "ActivityPurgeRun", Purged: totalPurged, CutoffIso }
}`}
      </pre>
      <div className="mt-8 grid grid-cols-3 gap-4 text-base">
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Idempotent</div>
          <p className="text-sm text-muted-foreground">Re-running within the same minute = zero rows deleted, no error, no cursor advance.</p>
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">CLI dry-run</div>
          <p className="text-sm text-muted-foreground"><code>wp workflowy activity purge --dry-run</code> — no writes, returns the count.</p>
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">No partial commits</div>
          <p className="text-sm text-muted-foreground">A failed batch leaves the cutoff cursor unchanged. Next run resumes from the same boundary.</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-RP-USE-PURGE-AFTER-COL</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-RP-EXCLUSIVE-LOCK</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-14</span>
      </div>
    </SlideLayout>
  );
}
