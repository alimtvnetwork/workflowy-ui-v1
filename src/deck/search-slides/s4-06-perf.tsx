import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-4 · Backend" title="Performance budget — sub-300 ms on 5 000 items, P95 ≤ 150 ms server-side"
      subtitle="The 5-bucket coarse-grain strategy is the perf strategy. No full BM25, no learned reranker, no client re-sort.">
      <div className="mt-6 grid grid-cols-3 gap-5">
        <div className="rounded-xl border border-border p-6 bg-card text-center">
          <div className="text-5xl font-semibold text-primary mb-2">300<span className="text-2xl"> ms</span></div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">End-to-end SLA</div>
          <p className="text-sm text-muted-foreground">User keystroke → first row painted, on a 5 000-item dataset.</p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card text-center">
          <div className="text-5xl font-semibold text-primary mb-2">150<span className="text-2xl"> ms</span></div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Server P95</div>
          <p className="text-sm text-muted-foreground">EP-SEARCH-QUERY round trip on workspaces ≤ 100 k items.</p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card text-center">
          <div className="text-5xl font-semibold text-primary mb-2">150<span className="text-2xl"> ms</span></div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">FE typing debounce</div>
          <p className="text-sm text-muted-foreground">No request fires until the user pauses for 150 ms.</p>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-border p-5 bg-card text-base text-muted-foreground">
        <strong>Levers if budget breaks:</strong> add a workspace-scoped FTS5 prefix index, drop bucket count from 5 → 4, or precompute snippets at write time. Adding BM25 is explicitly off-table for MVP.
      </div>
    </SlideLayout>
  );
}
