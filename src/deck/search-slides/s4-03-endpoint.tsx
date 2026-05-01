import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-4 · Backend" title="EP-SEARCH-QUERY — one endpoint, six error codes"
      subtitle="GET /search at wp-json/workflowy/v1/search. Read-only. Never emits SSE. P95 ≤ 150 ms for ≤ 100k items.">
      <div className="mt-6">
        <EndpointTable endpoints={[
          { method: "GET", path: "/search?Q=…&Scope=…&Types=…&Limit≤50&Cursor=…", purpose: "Run a query against the caller's accessible workspaces" },
        ]} />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Required / optional params</div>
          <ul className="space-y-2 text-base font-mono">
            <li><strong>Q</strong> — required, 1–256 chars</li>
            <li>Scope — optional node ID</li>
            <li>Types — optional ItemType filter</li>
            <li>IncludeTrashed — boolean</li>
            <li>Limit — ≤ 50, default 25</li>
            <li>Cursor — opaque pagination token</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Error codes</div>
          <ul className="space-y-2 text-sm font-mono">
            <li><span className="text-destructive">ERR_QUERY_TOO_SHORT</span> — 400 (Q &lt; 1)</li>
            <li><span className="text-destructive">ERR_QUERY_TOO_LONG</span> — 400 (Q &gt; 256)</li>
            <li><span className="text-destructive">ERR_FORBIDDEN</span> — 403 (Scope unreadable)</li>
            <li><span className="text-destructive">ERR_LIMIT_EXCEEDED</span> — 400 (Limit &gt; 50)</li>
            <li><span className="text-destructive">ERR_INTERNAL</span> — 500 (FTS / I/O failure)</li>
            <li><span className="text-destructive">ERR_RATE_LIMITED</span> — 429 (&gt; 30/min)</li>
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}
