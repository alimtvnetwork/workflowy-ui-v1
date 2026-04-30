import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-2 · Metrics" title="Prometheus surface" subtitle="One /metrics endpoint. Counters and histograms only — gauges only for things genuinely point-in-time.">
      <SqlBlock caption="Naming convention: subsystem_thing_unit. All histograms expose _bucket, _sum, _count for rate() and histogram_quantile().">{`# Sync (B-3) — request lifecycle
sync_ops_total{op="create|update|move|delete|...", outcome="ok|conflict|error"}  # counter
sync_request_duration_seconds_bucket{le="0.05|0.1|0.25|0.5|1|2.5|5|+Inf"}        # histogram
sync_batch_size_bucket{le="1|5|10|50|100|500"}                                    # histogram
lww_conflicts_total{op}                                                           # counter

# SSE (B-7.4) — push transport
sse_subscribers{workspace_bucket="0-10|10-100|100+"}                              # gauge
sse_publish_total{outcome="ok|backpressure|dropped"}                              # counter
sse_socket_age_seconds_bucket                                                     # histogram

# Background jobs (B-7)
job_run_total{name, status="ok|error|skipped"}                                    # counter
job_run_duration_seconds_bucket{name}                                             # histogram
job_rows_affected_total{name}                                                     # counter

# DB (B-1, B-9)
db_query_duration_seconds_bucket{db="app|templates", op="read|write"}             # histogram
db_busy_total{db}                                                                 # counter — SQLITE_BUSY retries
db_size_bytes{db}                                                                 # gauge — file size on disk

# Auth (B-2)
auth_login_total{outcome="ok|bad_password|locked|unknown_user"}                   # counter
session_active{}                                                                   # gauge

# HTTP edge
http_requests_total{route, status}
http_request_duration_seconds_bucket{route}`}</SqlBlock>
    </SlideLayout>
  );
}
