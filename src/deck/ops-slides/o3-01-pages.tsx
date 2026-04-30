import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-3 · Alerts" title="Page-worthy alerts" subtitle="Five alerts that wake someone up. Everything else is a ticket. If an alert isn't actionable at 3am, it doesn't belong here.">
      <SqlBlock caption="Burn rate alerts (last two) follow the Google SRE multi-window pattern: short window catches fast burns, long window confirms it's not a blip.">{`# 1. Sync availability — fast burn
- alert: SyncErrorRateHigh
  expr: |
    sum(rate(sync_ops_total{outcome="error"}[5m]))
      / sum(rate(sync_ops_total[5m])) > 0.05
  for: 5m
  labels: { severity: page }
  annotations:
    summary: "Sync error rate above 5% for 5 minutes"
    runbook: "ops-deck slide O-5.2"

# 2. Health check failing
- alert: HealthzDown
  expr: probe_success{job="workflowy-healthz"} == 0
  for: 2m
  labels: { severity: page }

# 3. DB busy spike — single-writer is overwhelmed
- alert: SqliteBusySpike
  expr: rate(db_busy_total[2m]) > 5
  for: 5m
  labels: { severity: page }

# 4. SLO budget burn (2h window, ≥14× burn)
- alert: SyncLatencyBudgetBurnFast
  expr: |
    (
      histogram_quantile(0.99, sum(rate(sync_request_duration_seconds_bucket[2h])) by (le))
        > 0.25
    ) and (
      histogram_quantile(0.99, sum(rate(sync_request_duration_seconds_bucket[5m])) by (le))
        > 0.25
    )
  for: 5m
  labels: { severity: page }

# 5. Background job not running
- alert: JobStalled
  expr: time() - max(job_run_last_success_timestamp_seconds) by (name) > 3600 * 2
  for: 10m
  labels: { severity: page }`}</SqlBlock>
    </SlideLayout>
  );
}
