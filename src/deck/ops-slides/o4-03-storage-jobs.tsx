import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="O-4 · Dashboards" title="Storage & jobs dashboard" subtitle="The 'will we run out of space / are jobs running' dashboard. Where the trash reaper, activity purge, and DB growth live.">
      <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
        <Panel
          title="DB file size — 30d trend"
          q={`db_size_bytes{db="app"}`}
          desc="Linear growth = healthy. Sudden step usually means an FTS rebuild or a missed VACUUM. Step DOWN means the reaper actually ran."
        />
        <Panel
          title="Disk free — host"
          q={`node_filesystem_avail_bytes{mountpoint="/var/lib/workflowy"}`}
          desc="Watch alongside DB size. Predictive alert (O-3.2) fires 30 days before we run out."
        />
        <Panel
          title="Job duration heatmap"
          q={`sum by (name, le) (rate(job_run_duration_seconds_bucket[1h]))`}
          desc="Trash reaper should sit < 30s; activity purge < 5min. If reaper crawls toward 5min, chunk size needs tuning."
        />
        <Panel
          title="Job last-success age"
          q={`time() - max by (name) (job_run_last_success_timestamp_seconds)`}
          desc="Should never exceed 2× the schedule interval. Single source of truth for 'is this job alive'."
        />
        <Panel
          title="Rows reaped — 7d"
          q={`increase(job_rows_affected_total{name="trash-reaper"}[7d])`}
          desc="Sanity check: should match the count of items soft-deleted 30 days ago. Discrepancy points to a permission bug in restore."
        />
        <Panel
          title="WAL checkpoint backlog"
          q={`db_wal_pages{db="app"}`}
          desc="WAL should checkpoint automatically. Backlog > 10k pages suggests a long-running read transaction is pinning the WAL."
        />
      </div>
    </SlideLayout>
  );
}

function Panel({ title, q, desc }: { title: string; q: string; desc: string }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="font-semibold text-foreground mb-1">{title}</div>
      <code className="text-xs text-foreground bg-muted/40 rounded px-2 py-1 inline-block mb-2 break-all">{q}</code>
      <div className="text-muted-foreground">{desc}</div>
    </div>
  );
}
