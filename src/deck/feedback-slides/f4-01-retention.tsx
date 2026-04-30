import { SlideLayout } from "../SlideLayout";

const CONSTS = [
  { name: "RETENTION_DAYS", value: "90", note: "Configurable per seedable-config; bounded [30, 365]" },
  { name: "RETENTION_BOUNDS", value: "[30, 365]", note: "Floor protects audit; ceiling prevents indefinite storage" },
  { name: "PURGE_INTERVAL", value: "daily 00:30 UTC", note: "+15 min offset from activity-feed purge — avoids lock contention" },
  { name: "PURGE_BATCH_SIZE", value: "2,000 rows / tx", note: "Lower than activity-feed (5k) — each row may dereference a blob" },
  { name: "GDPR_DEADLINE_HOURS", value: "72", note: "EU GDPR Art. 17 'without undue delay' — hard cap" },
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-4 · Retention" title="Five closed constants — no ad-hoc deletes"
      subtitle="Any code path that deletes a FeedbackReport row outside PurgeJob or DeleteMyFeedback fails CI.">
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left text-base">
          <thead className="bg-muted/60 text-sm">
            <tr>
              <th className="px-5 py-3 w-72">Constant</th>
              <th className="px-5 py-3 w-48">Value</th>
              <th className="px-5 py-3">Rationale</th>
            </tr>
          </thead>
          <tbody>
            {CONSTS.map((c) => (
              <tr key={c.name} className="border-t border-border align-top">
                <td className="px-5 py-3 font-mono text-sm">{c.name}</td>
                <td className="px-5 py-3 font-mono text-sm text-foreground">{c.value}</td>
                <td className="px-5 py-3 text-muted-foreground text-sm">{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-RETENTION-90D</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-RETENTION-BOUNDS</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RE-NO-AD-HOC-DELETE</span>
      </div>
    </SlideLayout>
  );
}
