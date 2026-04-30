import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="O-4 · Dashboards" title="Sync deep-dive dashboard" subtitle="The 'something is wrong with sync' dashboard. Drill from rate → latency → errors → conflicts, broken down by op type.">
      <div className="mt-8 space-y-6 text-sm">
        <Section
          title="Rate panel — heatmap of sync_ops_total by op"
          desc="Confirms whether traffic shape changed. A sudden spike in 'move' ops at 04:00 usually means a backfill script."
          q={`sum by (op) (rate(sync_ops_total[1m]))`}
        />
        <Section
          title="Latency panel — per-op p50/p95/p99"
          desc="Splits the overall histogram by op. 'create' and 'update' should be < 50ms p99; 'move' can spike to 200ms during rebalance."
          q={`histogram_quantile(0.99, sum by (op, le) (rate(sync_request_duration_seconds_bucket[5m])))`}
        />
        <Section
          title="Error breakdown"
          desc="Stacked area by errCode. Look for: 'cycle' (mirror bugs), 'permission-denied' (share regression), 'lww-stale' (clock skew)."
          q={`sum by (errCode) (rate(sync_ops_total{outcome="error"}[5m]))`}
        />
        <Section
          title="Conflict rate"
          desc="LWW conflicts per second. Baseline is ~0.05/s; spikes >2/s indicate two clients fighting over the same field."
          q={`sum by (op) (rate(lww_conflicts_total[5m]))`}
        />
        <Section
          title="Batch size distribution"
          desc="If p99 batch size jumps from 5 to 500, somebody's client is in catch-up mode (offline replay) — not necessarily a problem."
          q={`histogram_quantile(0.99, sum by (le) (rate(sync_batch_size_bucket[5m])))`}
        />
      </div>
    </SlideLayout>
  );
}

function Section({ title, desc, q }: { title: string; desc: string; q: string }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="font-semibold text-foreground mb-1">{title}</div>
      <div className="text-muted-foreground mb-2">{desc}</div>
      <code className="text-xs text-foreground bg-muted/40 rounded px-2 py-1 inline-block">{q}</code>
    </div>
  );
}
