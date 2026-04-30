import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-2 · Submit" title="`submitFeedback` — single egress, optimistic, atomic"
      subtitle="Sole writer of FeedbackReportMirror. Mirror + queue write happen in one IDB transaction.">
      <div className="mt-6">
        <StepList steps={[
          { action: "Parse FeedbackInputSchema (throws on invalid)", result: "client-side validation matches server-side Zod" },
          { action: "Capture diagnostics from injected deps", result: "no implicit globals; testable" },
          { action: "Generate optimistic FeedbackReportId (opt_-prefixed)", result: "UI navigates immediately" },
          { action: "Open IDB tx over [FeedbackReportMirror, Queue]", result: "atomic mirror + queue insert" },
          { action: "Return optimisticId — function returns < 50ms p95", result: "queue worker handles network egress" },
        ]} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-SF-SOLE-WRITER</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-SF-ATOMIC-MIRROR-QUEUE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-SF-OPTIMISTIC-BUDGET</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-SF-NO-INLINE-FETCH</span>
      </div>
    </SlideLayout>
  );
}
