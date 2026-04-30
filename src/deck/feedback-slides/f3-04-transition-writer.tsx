import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-3 · Admin" title="`transitionFeedback` — sole writer of `Status`"
      subtitle="CI import-graph check enforces it. The transition matrix is the SSOT — no second copy in the UI layer.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`async function transitionFeedback({
  feedbackReportId, fromStatus, toStatus, note
}: TransitionInput): Promise<FeedbackReport> {
  // 1. Validate against SSOT before ANY write
  if (!ALLOWED_TRANSITIONS[fromStatus].includes(toStatus)) {
    throw new InvalidTransitionError(fromStatus, toStatus);
  }

  // 2. Atomic mirror + queue write
  await idb.tx(['FeedbackReportMirror', 'Queue'], 'readwrite', async (tx) => {
    const current = await tx.objectStore('FeedbackReportMirror').get(feedbackReportId);
    if (current.Status !== fromStatus) throw new StaleStatusError();   // optimistic concurrency

    const resolvedAt = TERMINAL.has(toStatus) ? clock.nowIso() : current.ResolvedAt;
    tx.objectStore('FeedbackReportMirror').put({ ...current, Status: toStatus, ResolvedAt: resolvedAt });
    tx.objectStore('Queue').add({ Verb: 'feedback.transition',
      Payload: { FeedbackReportId: feedbackReportId, FromStatus: fromStatus, ToStatus: toStatus, Note: note },
      EnqueuedAt: clock.nowIso() });
  });
}`}
      </pre>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-SOLE-TRANSITION-WRITER</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-TRANSITION-FROM-SSOT</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-OPTIMISTIC-CONCURRENCY</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-RESOLVED-AT-ON-TERMINAL</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-ATOMIC-MIRROR-QUEUE</span>
      </div>
    </SlideLayout>
  );
}
