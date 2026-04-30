import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-2 · Metrics" title="Logs & traces" subtitle="Structured JSON logs to stdout, captured by journald. Spans correlated by request id; tracing optional but the IDs are always there.">
      <SqlBlock caption="Every log line carries reqId, userId (if authed), and route. journalctl can grep by any of them. Errors include a stack and a hash so duplicates collapse in the dashboard.">{`// log shape — every line is one JSON object
{
  "ts": "2026-04-30T11:32:14.812Z",
  "level": "info" | "warn" | "error",
  "msg": "sync.applied",
  "reqId": "01HW7K2X9V8...",          // ULID, propagated via X-Request-Id
  "userId": 4421,
  "workspaceId": 99,
  "route": "POST /sync",
  "durationMs": 47,
  "opCount": 3,
  "conflicts": 0
}

// Error lines also include:
{
  "errKind": "ConflictError",
  "errCode": "cycle",
  "stack": "...",
  "errHash": "sha1(errKind + errCode + topFrame)"   // for dedupe in dashboard
}

# journalctl recipes
journalctl -u workflowy.service -f                        # live tail
journalctl -u workflowy.service -p err --since "1h ago"   # errors only
journalctl -u workflowy.service | jq -c 'select(.reqId=="01HW7K2X9V8...")'

# OpenTelemetry (optional, off by default)
OTEL_EXPORTER_OTLP_ENDPOINT=https://otel.example.com  ./server
# Spans: http.request → sync.apply → db.transaction → hook.fts / hook.activity / hook.sse`}</SqlBlock>
    </SlideLayout>
  );
}
