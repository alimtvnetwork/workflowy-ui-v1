import { SlideLayout } from "../SlideLayout";

const ROWS: [string, string, string, string][] = [
  ["RETENTION_DAYS",          "30",                 "Mirrors trash-retention parity",          "G-34-RP-RETENTION-30D"],
  ["PURGE_INTERVAL",          "daily (00:15 UTC)",  "Off-peak, aligns with WP-Cron defaults",  "G-34-RP-PURGE-DAILY"],
  ["PURGE_BATCH_SIZE",        "5,000 rows / tx",    "Keeps SQLite write-lock <250 ms p95",     "G-34-RP-BATCH-CAP"],
  ["MIRROR_COMPACT_INTERVAL", "on each SSE batch",  "Piggy-backs an open IDB tx — no extra wakeups", "G-34-RP-MIRROR-PIGGYBACK"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-4 · Retention" title="Four closed constants — build-time, indexed"
      subtitle="Retention is not a runtime config. The number 30 lives in code, indexed by PurgeAfter, enforced by CI.">
      <table className="mt-6 w-full text-base border border-border rounded-lg overflow-hidden">
        <thead className="bg-muted/30">
          <tr>
            <th className="text-left px-3 py-2 font-medium">Constant</th>
            <th className="text-left px-3 py-2 font-medium">Value</th>
            <th className="text-left px-3 py-2 font-medium">Rationale</th>
            <th className="text-left px-3 py-2 font-medium">Gate</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([k, v, r, g]) => (
            <tr key={k} className="border-t border-border">
              <td className="px-3 py-2 font-mono text-primary">{k}</td>
              <td className="px-3 py-2 font-mono">{v}</td>
              <td className="px-3 py-2 text-muted-foreground">{r}</td>
              <td className="px-3 py-2 font-mono text-xs">{g}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-base text-muted-foreground">
        Reading <code>RETENTION_DAYS</code> from a runtime config is forbidden
        by <code>G-34-RP-NO-AD-HOC-DELETE</code>. Two reasons: testability
        (boundary cases need a known value) and audit (changing retention is
        an ADR, not a config flip).
      </p>
    </SlideLayout>
  );
}
