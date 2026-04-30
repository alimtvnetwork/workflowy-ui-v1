import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="B-10 · Deployment" title="Runbook" subtitle="The full path from green CI to running production. Single binary, single host, two SQLite files. No orchestrator required.">
      <StepList
        items={[
          {
            title: "1. Build",
            body: "`bun run build` produces `dist/server.js` (bundled) and copies `migrations/`. CI artifact is a single tarball ~14 MB including the SQLite native binding.",
          },
          {
            title: "2. Pre-flight on the host",
            body: "`server --check` runs migrations against a copy of the live DB, verifies query plans against `tests/query-plans/`, and exits non-zero on drift. Never run migrations blindly.",
          },
          {
            title: "3. Atomic swap",
            body: "systemd unit `workflowy.service` uses `ExecStartPre=cp data/app.sqlite data/backups/app-$(date +%s).sqlite`, then `ExecStart=node dist/server.js`. Rollback = stop service, restore latest backup, start old binary.",
          },
          {
            title: "4. Health & SLOs",
            body: "`/healthz` returns 200 only after migrations applied AND FTS index reachable. `/metrics` exposes Prometheus counters: sync_ops_total, sse_subscribers, job_run_duration_seconds. Alert if p99 sync latency > 250 ms over 5 min.",
          },
          {
            title: "5. Backups",
            body: "`sqlite3 app.sqlite \".backup data/backups/app-hourly.sqlite\"` runs hourly via the same JobSpec runner (B-7). Daily upload to object storage with 30-day retention. Restore drill quarterly.",
          },
          {
            title: "6. Incident playbook",
            body: "Symptom → first action: SSE clients disconnecting → check `sse_subscribers` gauge & restart hub. Sync 409 spike → inspect `lww_conflicts_total` by op type. DB locked → confirm only one process holds `app.sqlite` (lsof).",
          },
        ]}
      />
    </SlideLayout>
  );
}
