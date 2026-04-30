import { SlideLayout } from "../SlideLayout";


export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-3 · Admin" title="Inbox — URL state, cursor pagination, virtualization"
      subtitle="Filter values come from imported enums. Search hits Title only. State lives in the URL — refresh restores the exact view.">
      <div className="mt-6 grid grid-cols-[1.3fr_1fr] gap-8 items-start">
        <Wireframe>
          <div className="flex flex-col h-full">
            <div className="flex gap-2 p-2 border-b border-border bg-muted/40 text-xs">
              <span className="px-2 py-0.5 rounded bg-background border border-border">Status: New, Triaged</span>
              <span className="px-2 py-0.5 rounded bg-background border border-border">Type: Bug, Idea</span>
              <span className="px-2 py-0.5 rounded bg-background border border-border">Date: Apr 1–30</span>
              <span className="ml-auto px-2 py-0.5 rounded bg-background border border-border">q: mirror</span>
            </div>
            <div className="flex-1 divide-y divide-border text-xs">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <span className="font-mono text-muted-foreground">#{1234 - i}</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 text-[10px]">Bug</span>
                  <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">New</span>
                  <span className="flex-1 truncate">Mirror sync drops first edit after offline reconnect…</span>
                  <span className="text-muted-foreground">2h</span>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border text-center text-xs text-muted-foreground">Load more · cursor 1714485000000_1234</div>
          </div>
        </Wireframe>
        <div className="space-y-4 text-base">
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Filters</div>
            <p>Status, type, date-range, q (debounced 250ms), sort. All sync to URL params — deep-linkable.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Pagination</div>
            <p>Cursor: <code className="font-mono text-xs">SubmittedAtMillis_FeedbackReportId</code>. Page = 50. Virtualize past 250 client-side rows.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Mirror-first</div>
            <p>Loader reads <code>FeedbackReportMirror</code> first (≤16ms p95). Network only when cursor window uncached.</p>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
