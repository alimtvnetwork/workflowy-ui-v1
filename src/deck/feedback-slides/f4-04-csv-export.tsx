import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-4 · Retention" title="CSV export — streamed, formula-injection safe"
      subtitle="No .xlsx (would buffer in memory). No JSON bulk dump. No screenshot URLs (signed URLs would leak).">
      <div className="mt-6 grid grid-cols-[1fr_1fr] gap-8 items-start">
        <div>
          <div className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Column order (closed)</div>
          <ol className="space-y-1 font-mono text-base list-decimal pl-6">
            <li>FeedbackReportId</li>
            <li>SubmittedAt</li>
            <li>FeedbackType</li>
            <li>Status</li>
            <li>Title</li>
            <li>Body</li>
            <li>SubmittedByUserId</li>
            <li>ResolvedAt</li>
            <li>DiagnosticsJson</li>
          </ol>
        </div>
        <div className="space-y-4 text-sm">
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Streaming</div>
            <p>Row-by-row via PHP <code>fputcsv</code> to <code>php://output</code>. Never buffered. Usable for 100k+ rows.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Formula-injection defense</div>
            <p>First cell of every row prefixed with <code>'</code> if raw value starts with <code>=</code>, <code>+</code>, <code>-</code>, <code>@</code>, <code>\t</code>, <code>\r</code>.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Rate limit</div>
            <p>1 export per Admin per minute. Filename: <code className="font-mono text-xs">feedback-YYYY-MM-DD.csv</code> (closed).</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-EXPORT-STREAMED</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-EXPORT-RFC4180</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-EXPORT-FORMULA-SAFE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-EXPORT-RATE-LIMIT</span>
      </div>
    </SlideLayout>
  );
}
