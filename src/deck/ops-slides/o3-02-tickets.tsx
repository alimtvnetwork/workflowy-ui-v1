import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-3 · Alerts" title="Ticket-worthy alerts" subtitle="Things to look at, not things to wake up for. Routed to the team channel during business hours.">
      <SqlBlock caption="The split between page and ticket is binary on purpose: every alert lives in exactly one bucket. Reviewed quarterly — alerts that fired but never got actioned get demoted or deleted.">{`# Disk filling up — 30 days runway
- alert: DiskSpaceLow
  expr: |
    predict_linear(node_filesystem_avail_bytes{mountpoint="/var/lib/workflowy"}[7d], 30*86400)
      < 0
  for: 1h
  labels: { severity: ticket }

# DB file growing unusually fast
- alert: DbGrowthAnomalous
  expr: rate(db_size_bytes[6h]) > 1024 * 1024 * 5    # > 5 MB/h sustained
  for: 6h
  labels: { severity: ticket }

# LWW conflicts trending up — sync churn
- alert: LwwConflictsRising
  expr: |
    rate(lww_conflicts_total[1h])
      > 2 * avg_over_time(rate(lww_conflicts_total[1h])[7d:1h])
  for: 30m
  labels: { severity: ticket }

# Auth failure spike — credential stuffing?
- alert: BadPasswordSpike
  expr: rate(auth_login_total{outcome="bad_password"}[10m]) > 10
  for: 10m
  labels: { severity: ticket }

# SSE backpressure events — slow consumers
- alert: SseBackpressure
  expr: rate(sse_publish_total{outcome="backpressure"}[15m]) > 0.5
  for: 15m
  labels: { severity: ticket }

# Migration drift — should never happen but cheap to detect
- alert: MigrationDrift
  expr: workflowy_migration_current != workflowy_migration_target
  for: 5m
  labels: { severity: ticket }`}</SqlBlock>
    </SlideLayout>
  );
}
