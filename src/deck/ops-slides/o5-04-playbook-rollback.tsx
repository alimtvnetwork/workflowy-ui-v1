import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-5 · Playbooks" title="Playbook: Bad deploy rollback" subtitle="Triggered by deploy-correlated alerts (sync errors, latency, 5xx). Roll back the binary first, investigate after.">
      <SqlBlock caption="The atomic-swap deploy (backend B-10.3) keeps the previous binary at /opt/workflowy/previous/. Rollback is one symlink swap + restart. Practice this quarterly.">{`# 1. Verify rollback is the right call
#    Did errors start within 5 min of the last restart?
systemctl show workflowy.service -p ActiveEnterTimestamp
#    Yes → roll back. No → this is a different incident, see O-5.2.

# 2. Take a backup of the CURRENT DB before rolling back
#    This preserves any data written under the bad version, in case the
#    rollback fails and we need to forward-debug.
cp /var/lib/workflowy/app.sqlite \\
   /var/lib/workflowy/backups/app-rollback-$(date +%s).sqlite

# 3. Swap the binary symlink
ls -l /opt/workflowy/current /opt/workflowy/previous
#    'current' → release-2026.04.30-a1b2c3
#    'previous' → release-2026.04.29-9f8e7d
ln -sfn /opt/workflowy/previous /opt/workflowy/current

# 4. Restart
systemctl restart workflowy.service
journalctl -u workflowy.service -f
#    Watch for "server.ready" log line. /ready should turn green within 10s.

# 5. Did the previous version run a migration the new one needed?
#    Check user_version vs target:
sqlite3 /var/lib/workflowy/app.sqlite "PRAGMA user_version;"
#    If the bad release applied a forward-only migration, the rollback
#    will refuse to start (mismatch). Two options:
#      a) Roll FORWARD with a hotfix — preferred for migration-related issues.
#      b) Restore DB from the pre-deploy backup (see O-5.5) AND rollback binary.

# 6. Confirm recovery
#    SyncErrorRateHigh should clear within 5-10 min.
#    Post in #incidents: "rolled back to <version>, monitoring."

# 7. Hold off on re-deploying for at least 1h
#    Don't push a forward-fix in the heat. Let the on-call breathe, write
#    the postmortem ticket, then plan the fix for the next business day.`}</SqlBlock>
    </SlideLayout>
  );
}
