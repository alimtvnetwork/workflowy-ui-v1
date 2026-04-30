import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-5 · Playbooks" title="Playbook: Restore from backup" subtitle="The 'last resort' playbook. Used for DB corruption, ransomware-style incidents, or accidental DELETE. Practice quarterly so you trust it.">
      <SqlBlock caption="Backups: hourly snapshot via `sqlite3 .backup` (kept 48h locally), daily upload to object storage (kept 30 days). Quarterly drill: restore to a staging host and run /healthz against it.">{`# 1. Stop the service — no writes during restore
systemctl stop workflowy.service

# 2. Pick the backup
ls -lh /var/lib/workflowy/backups/
#    Hourly: app-2026-04-30T11.sqlite
#    Daily : app-2026-04-29.sqlite
#    Older : aws s3 ls s3://workflowy-backups/

#    Pull from S3 if needed:
aws s3 cp s3://workflowy-backups/app-2026-04-15.sqlite /tmp/restore.sqlite

# 3. Verify integrity of the candidate before swapping
sqlite3 /tmp/restore.sqlite "PRAGMA integrity_check;"
#    Must return 'ok'. If not, try the next one back.

# 4. Snapshot the broken DB (in case we need to forensic later)
mv /var/lib/workflowy/app.sqlite /var/lib/workflowy/app.sqlite.broken-$(date +%s)
mv /var/lib/workflowy/app.sqlite-wal /var/lib/workflowy/app.sqlite-wal.broken 2>/dev/null
mv /var/lib/workflowy/app.sqlite-shm /var/lib/workflowy/app.sqlite-shm.broken 2>/dev/null

# 5. Swap in the restored DB
cp /tmp/restore.sqlite /var/lib/workflowy/app.sqlite
chown workflowy:workflowy /var/lib/workflowy/app.sqlite
chmod 640 /var/lib/workflowy/app.sqlite

# 6. Run a dry-start to confirm migrations apply cleanly
sudo -u workflowy /opt/workflowy/current/server --check
#    Exits 0 if migrations + query-plan checks pass. Non-zero → STOP, escalate.

# 7. Start the service
systemctl start workflowy.service
journalctl -u workflowy.service -f
#    Wait for "server.ready". /healthz green.

# 8. Communicate
#    Public status update. Estimated data loss = (now - backup timestamp).
#    Post the timestamp explicitly so users know what they need to redo.

# 9. Keep the .broken files for at least 30 days
#    Forensic + chance to reconcile any data the user re-entered with what
#    was in the broken DB at the time of the incident.`}</SqlBlock>
    </SlideLayout>
  );
}
