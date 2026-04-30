import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="O-4 · Dashboards" title="Overview dashboard" subtitle="The first dashboard to open during an incident. Nine panels, one screen, no scrolling.">
      <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
        {[
          { title: "Sync RPS",          q: "sum(rate(sync_ops_total[1m]))",                    hint: "stat · last 1h" },
          { title: "Sync error %",      q: "sum(rate(sync_ops_total{outcome=\"error\"}[5m])) / sum(rate(sync_ops_total[5m]))", hint: "stat · 5m" },
          { title: "Sync p99 latency",  q: "histogram_quantile(0.99, sum(rate(sync_request_duration_seconds_bucket[5m])) by (le))", hint: "graph · last 6h" },
          { title: "SSE subscribers",   q: "sum(sse_subscribers)",                              hint: "stat · live" },
          { title: "DB busy / s",       q: "rate(db_busy_total[1m])",                           hint: "graph · last 1h" },
          { title: "Job lag (max)",     q: "max(time() - job_run_last_success_timestamp_seconds) by (name)", hint: "table" },
          { title: "Active sessions",   q: "session_active",                                    hint: "stat" },
          { title: "DB size on disk",   q: "db_size_bytes",                                     hint: "graph · last 30d" },
          { title: "5xx rate",          q: "sum(rate(http_requests_total{status=~\"5..\"}[5m]))", hint: "stat" },
        ].map((p) => (
          <div key={p.title} className="border border-border rounded-lg p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.hint}</div>
            <div className="text-base font-semibold text-foreground mt-1 mb-2">{p.title}</div>
            <code className="text-xs text-muted-foreground break-all leading-relaxed">{p.q}</code>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        Time range default: last 6h. Auto-refresh: 30s. Variables: <code className="text-foreground">$env</code> (prod / staging).
      </div>
    </SlideLayout>
  );
}
