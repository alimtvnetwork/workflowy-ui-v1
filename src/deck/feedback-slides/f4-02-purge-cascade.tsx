import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-4 · Retention" title="Daily purge — cascade order is fixed"
      subtitle="Reverse order leaves orphan note rows or dangling blob refs. Each batch runs under PRAGMA locking_mode = EXCLUSIVE.">
      <div className="mt-6 grid grid-cols-[1.1fr_1fr] gap-8 items-start">
        <StepList steps={[
          { action: "SELECT FeedbackReportId, ScreenshotBlobRef WHERE PurgeAfter <= cutoffIso LIMIT 2000", result: "uses IX_FeedbackReport_PurgeAfter — never recompute SubmittedAt + 90d" },
          { action: "blobStorage.dereference(ScreenshotBlobRef) for each", result: "storage layer handles GC on its own schedule" },
          { action: "DELETE FROM FeedbackReportNote WHERE FeedbackReportId IN (…)", result: "cascade admin notes" },
          { action: "DELETE FROM FeedbackReport WHERE FeedbackReportId IN (…)", result: "feedback rows deleted last" },
          { action: "Emit Telemetry { FeedbackPurgeRun, Purged, BlobsDereferenced, … }", result: "via standard sink — error_log() / var_dump() forbidden" },
        ]} />
        <div className="space-y-4 text-sm">
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Failure semantics</div>
            <p>A failed batch MUST NOT advance the cursor — next run picks up at the same <code>PurgeAfter</code> boundary. No partial commits.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Idempotent rerun</div>
            <p>Re-running within the same minute is a no-op. Also CLI-invocable: <code className="font-mono text-xs">wp workflowy feedback purge --dry-run</code></p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-CASCADE-ORDER</span>
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-USE-PURGE-AFTER-COL</span>
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-NO-PARTIAL-COMMIT</span>
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-CLI-DRY-RUN</span>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
