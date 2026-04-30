import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="O-5 · Playbooks" title="Playbook: Sync errors spiking" subtitle="Triggered by SyncErrorRateHigh. Most common cause: a bad deploy or a single user with corrupt local state.">
      <SqlBlock caption="Don't roll back blindly — confirm it's deploy-correlated first. If error rate maps to one userId, mitigate that user (force-resync) before touching the binary.">{`# 1. Confirm the alert
#    Open dashboard O-4.2, look at "Error breakdown" panel, note the errCode.
journalctl -u workflowy.service -p err --since "15min ago" | jq -c '.errCode' | sort | uniq -c

# 2. Is it deploy-correlated?
systemctl show workflowy.service -p ActiveEnterTimestamp
#    If errors started within 5 min of last restart → likely the deploy.
#    Roll back: see O-5.4.

# 3. Is it one user?
journalctl -u workflowy.service -p err --since "15min ago" \\
  | jq -c '.userId' | sort | uniq -c | sort -rn | head
#    If one userId dominates (>80%): force-resync that user.

# 4. Force-resync a user (mitigation)
sqlite3 /var/lib/workflowy/app.sqlite \\
  "UPDATE sessions SET revokedAt = datetime('now') WHERE userId = ?;"
#    Their next request gets 401 → client clears outbox → fresh sync from cursor=null.

# 5. errCode = "cycle" or "missing-parent"?
#    Mirror or move bug in the latest deploy. Rollback first, investigate after.
#    See backend deck B-5.2 for cycle handling, B-4.1 for move atomicity.

# 6. errCode = "lww-stale"?
#    Likely client clock skew. Check distribution of clock offsets:
journalctl -u workflowy.service --since "1h ago" \\
  | jq -c 'select(.msg=="sync.applied") | .clientClockOffsetMs' \\
  | awk '{s+=$1*$1; n++} END{print "rms_ms =", sqrt(s/n)}'
#    If rms > 5000, push a client release that uses server time (Date header).

# 7. Still spiking after mitigation?
#    Escalate to secondary. Open #incidents thread. Consider partial degradation:
#    set MAX_OPS_PER_BATCH=10 via env var + restart to shed load.`}</SqlBlock>
    </SlideLayout>
  );
}
