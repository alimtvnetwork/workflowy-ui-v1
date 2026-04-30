import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-2 · Metrics" title="Health checks" subtitle="Three endpoints. Used by load balancer, deploy script, and uptime monitors respectively. Different semantics on purpose.">
      <SqlBlock caption="Don't merge these. /healthz is for orchestration (lie quickly if unsure); /ready gates traffic; /alive proves the process is running but says nothing about correctness.">{`// GET /alive — process liveness, no I/O
//   200 always, while the event loop is responsive
//   Used by systemd Watchdog= timer
{ "status": "alive", "pid": 4421, "uptime_s": 18234 }

// GET /ready — ready to serve real traffic
//   Returns 503 until: migrations applied AND DB reachable AND FTS index valid
//   Load balancer uses this to gate /sync, /events
{
  "status": "ready",
  "migrations": { "current": 17, "target": 17 },
  "db": { "app": "ok", "templates": "ok" },
  "fts": "ok"
}

// GET /healthz — composite "everything I can check is fine"
//   200 only if /ready PLUS recent successful job runs PLUS sse hub healthy
//   External uptime monitor hits this every 30 s
{
  "status": "ok",
  "checks": {
    "db_app":         { "ok": true, "lastWriteSec": 4 },
    "db_templates":   { "ok": true },
    "fts":            { "ok": true, "rowCount": 184_221 },
    "jobs":           { "ok": true, "lastRunMaxAgeSec": 67 },
    "sse_hub":        { "ok": true, "subscribers": 142 },
    "session_table":  { "ok": true }
  }
}`}</SqlBlock>
    </SlideLayout>
  );
}
