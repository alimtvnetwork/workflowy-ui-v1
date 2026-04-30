import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-1 · Storage" title="Two closed enums — coordinated migration only"
      subtitle="Adding a value requires an ADR + migration + Zod-schema bump in the same PR.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <div>
          <div className="text-sm uppercase tracking-wider text-muted-foreground mb-3">FeedbackType (4)</div>
          <ul className="space-y-2 text-lg">
            <li><span className="font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-400">Bug</span> Something is broken</li>
            <li><span className="font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400">Idea</span> Feature request</li>
            <li><span className="font-mono px-2 py-0.5 rounded bg-pink-500/15 text-pink-700 dark:text-pink-400">Praise</span> Positive feedback</li>
            <li><span className="font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-400">Question</span> Usage / support</li>
          </ul>
        </div>
        <div>
          <div className="text-sm uppercase tracking-wider text-muted-foreground mb-3">FeedbackStatus (6)</div>
          <ul className="space-y-2 text-lg">
            <li><span className="font-mono px-2 py-0.5 rounded bg-muted">New</span> default at insert</li>
            <li><span className="font-mono px-2 py-0.5 rounded bg-muted">Triaged</span> reviewed by admin</li>
            <li><span className="font-mono px-2 py-0.5 rounded bg-muted">InProgress</span> work begun</li>
            <li><span className="font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">Resolved</span> terminal · sets ResolvedAt</li>
            <li><span className="font-mono px-2 py-0.5 rounded bg-muted">WontFix</span> terminal</li>
            <li><span className="font-mono px-2 py-0.5 rounded bg-muted">Duplicate</span> terminal</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 rounded-lg border border-border p-5 text-base">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Forbidden</div>
        <p>Free-text status values "for now". Hardcoded enum lists in JSX. Two duplicate transition matrices (the UI imports the SSOT from <code>feedback.types.ts</code>).</p>
      </div>
    </SlideLayout>
  );
}
