import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-5 · Playbooks" title="Playbook: SQLite busy / DB locked" subtitle="Triggered by SqliteBusySpike. Single-writer SQLite means one stuck transaction blocks everything.">
      <SqlBlock caption="The root cause is almost always either (a) a long-running read that's pinning the WAL, or (b) two processes opening the same file. Find which, then act.">{`# 1. Confirm only one process holds the DB
lsof /var/lib/workflowy/app.sqlite
#    Should show ONE pid (the workflowy.service process). If you see two,
#    you have a rogue manual session or a runaway backup. Kill the extra.

# 2. Identify long-running queries from the app
#    The app logs any query > 100ms with msg="db.slow". Tail and grep:
journalctl -u workflowy.service --since "10min ago" \\
  | jq -c 'select(.msg=="db.slow")'
#    Look for the same statement repeating. Usually a missing index after
#    a recent migration — see backend B-9.3 for the query-plan check.

# 3. Inspect WAL state
sqlite3 /var/lib/workflowy/app.sqlite "PRAGMA wal_checkpoint(TRUNCATE);"
#    Returns (busy, log_pages, checkpointed). If 'busy' = 1, a reader is
#    pinning the WAL. The reader is inside the app — restart will release it.

# 4. Mitigation: graceful restart
systemctl reload-or-restart workflowy.service
#    The unit's ExecStartPre takes a backup first. Drop in latency for ~3s,
#    no data loss because every accepted op is already committed.

# 5. If lsof shows zero processes but /alive returns 503
#    The process crashed but systemd hasn't restarted yet. Check:
systemctl status workflowy.service
journalctl -u workflowy.service -n 200 --no-pager
#    Look for SIGABRT or out-of-memory. If OOM: increase MemoryMax= and
#    investigate the leak from /metrics → process_resident_memory_bytes.

# 6. Worst case: DB file actually corrupt
sqlite3 /var/lib/workflowy/app.sqlite "PRAGMA integrity_check;"
#    If this returns anything other than 'ok', restore from latest hourly
#    backup (see O-5.5). Page the lead before you do this.`}</SqlBlock>
    </SlideLayout>
  );
}
