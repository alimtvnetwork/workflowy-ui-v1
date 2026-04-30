import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-7 · Jobs" title="Job runner architecture" subtitle="One in-process scheduler, no external queue. Jobs are plain async functions registered with a cron-like spec; a single SQLite row enforces single-instance execution.">
      <SqlBlock caption="`job_runs` is the audit trail. The leader-lease row in `job_leases` lets a future multi-node deploy add coordination without rewriting the API.">{`-- Schema (app DB)
CREATE TABLE job_leases (
  jobName    TEXT PRIMARY KEY,
  holderId   TEXT NOT NULL,            -- process UUID
  expiresAt  TEXT NOT NULL
);
CREATE TABLE job_runs (
  id         INTEGER PRIMARY KEY,
  jobName    TEXT NOT NULL,
  startedAt  TEXT NOT NULL,
  finishedAt TEXT,
  status     TEXT CHECK (status IN ('ok','error','skipped')),
  error      TEXT,
  rowsAffected INTEGER
);
CREATE INDEX idx_job_runs_name_started ON job_runs(jobName, startedAt DESC);

interface JobSpec {
  name: string;
  schedule: string;          // "*/5 * * * *"  — node-cron syntax
  run: (ctx: JobCtx) => Promise<{ rowsAffected: number }>;
}

const JOBS: JobSpec[] = [trashReaperJob, activityPurgeJob, sseHeartbeatJob, indexRebalanceJob];

function start() {
  for (const j of JOBS) cron.schedule(j.schedule, () => withLease(j, runOnce));
}

async function withLease(job: JobSpec, body: (j: JobSpec) => Promise<void>) {
  const acquired = db.prepare(\`
    INSERT INTO job_leases(jobName, holderId, expiresAt) VALUES (?,?,?)
    ON CONFLICT(jobName) DO UPDATE SET holderId=excluded.holderId, expiresAt=excluded.expiresAt
      WHERE expiresAt < CURRENT_TIMESTAMP\`)
    .run(job.name, PROCESS_ID, isoPlus(60_000)).changes > 0;
  if (!acquired) return logRun(job, "skipped");
  try { await body(job); } finally { releaseLease(job.name); }
}`}</SqlBlock>
    </SlideLayout>
  );
}
