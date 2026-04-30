import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-4 · Retention" title="`DeleteMyFeedback(userId)` — atomic, hashed, logged without content"
      subtitle="Soft-delete is forbidden. PII can't sit in a 'DeletedAt' column. The audit log captures counts, not content.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-xs font-mono leading-relaxed text-foreground overflow-x-auto">
{`deleteMyFeedback(userId, reason: 'AccountDeletion' | 'GdprRequest', requestedAt):
  BEGIN TRANSACTION
    auditRows = SELECT FeedbackReportId, SubmittedAt, FeedbackType, Status
                FROM FeedbackReport WHERE SubmittedByUserId = :userId;
    forEach row WHERE ScreenshotBlobRef IS NOT NULL:
      blobStorage.dereference(row.ScreenshotBlobRef);
    DELETE FROM FeedbackReportNote
      WHERE FeedbackReportId IN (SELECT FeedbackReportId FROM FeedbackReport WHERE SubmittedByUserId = :userId);
    DELETE FROM FeedbackReport WHERE SubmittedByUserId = :userId;
    INSERT INTO GdprDeletionLog (UserId, DeletedAt, ReportCount, Reason, RequestedAt)
      VALUES (:userId, :now, count(auditRows), :reason, :requestedAt);
  COMMIT
  emit Telemetry { Event: 'FeedbackGdprDelete', UserId: hash(:userId), ReportCount, Reason }`}
      </pre>
      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div className="rounded-lg border border-primary/40 p-4">
          <div className="text-xs uppercase tracking-wider text-primary mb-2">✓ Required</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Single SQLite tx — all-or-nothing</li>
            <li>Hash userId before telemetry</li>
            <li>Idempotent — second invocation returns ReportsDeleted: 0</li>
            <li>Two callers only: account-delete cascade, admin <code className="text-xs">/forget</code></li>
          </ul>
        </div>
        <div className="rounded-lg border border-destructive/40 p-4">
          <div className="text-xs uppercase tracking-wider text-destructive mb-2">✗ Forbidden</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Soft-delete via DeletedAt column</li>
            <li>Rate-limiting GDPR delete (legal obligation)</li>
            <li>Storing Title/Body/Diagnostics in GdprDeletionLog</li>
            <li>Requiring confirmation again at the data layer</li>
          </ul>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-GDPR-72H</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-GDPR-ATOMIC</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-GDPR-HASH-USERID</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-GDPR-LOG-NO-CONTENT</span>
        <span className="px-2 py-1 rounded bg-muted text-muted-foreground font-mono">AT-FEEDBACKREPORT-14</span>
      </div>
    </SlideLayout>
  );
}
