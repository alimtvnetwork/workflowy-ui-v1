import { SlideLayout } from "../SlideLayout";

export default function Guide() {
  return (
    <SlideLayout chapter="Reading guide" title="Why this deck exists"
      subtitle="Feedback looks small. Done wrong it becomes a PII leak, an unbounded blob store, and a GDPR liability.">
      <div className="mt-8 grid grid-cols-2 gap-8 text-xl">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What this deck covers</div>
          <ul className="space-y-3 list-disc pl-6">
            <li>The dedicated <code>feedback.db</code> and the singular <code>FeedbackReport</code> table</li>
            <li>Two closed enums + a 6×6 transition matrix held in one TS const</li>
            <li>Single-egress submission, single-writer transition, mirror+queue atomicity</li>
            <li>The 90-day reaper and the 72-hour GDPR delete</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What this deck explicitly forbids</div>
          <ul className="space-y-3 list-disc pl-6">
            <li>Free-text status / type values that "we'll add later"</li>
            <li>Markdown rendering of submitter <code>Body</code></li>
            <li>Soft-delete columns hiding PII on disk</li>
            <li>Any code path mutating <code>Status</code> outside <code>transitionFeedback</code></li>
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}
