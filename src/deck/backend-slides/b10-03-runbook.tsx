import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="B-10 · Deployment" title="Runbook" subtitle="The full path from green CI to running production. Single binary, single host, two SQLite files. No orchestrator required.">
      <StepList
        steps={[
          { action: "Build",            result: "`bun run build` → `dist/server.js` + bundled migrations. CI artifact is one ~14 MB tarball with the SQLite native binding." },
          { action: "Pre-flight",       result: "`server --check` runs migrations on a copy of the live DB and verifies query plans against `tests/query-plans/`. Exits non-zero on drift." },
          { action: "Atomic swap",      result: "systemd `ExecStartPre` snapshots `app.sqlite` to `data/backups/app-$(date +%s).sqlite`, then starts the new binary. Rollback = stop, restore, start old binary." },
          { action: "Health & SLOs",    result: "`/healthz` 200 only after migrations + FTS reachable. `/metrics` exposes sync_ops_total, sse_subscribers, job_run_duration. Alert on p99 sync > 250 ms / 5 min." },
          { action: "Backups",          result: "`sqlite3 .backup` runs hourly via the same JobSpec runner. Daily upload to object storage, 30-day retention, quarterly restore drill." },
          { action: "Incident playbook",result: "SSE drops → restart hub. Sync 409 spike → check `lww_conflicts_total` by op. DB locked → confirm only one process holds `app.sqlite` (lsof)." },
        ]}
      />
    </SlideLayout>
  );
}
