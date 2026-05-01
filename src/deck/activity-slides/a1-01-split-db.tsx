import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-1 · Schema" title="Why activity.db is its own SQLite file"
      subtitle="FR-6 — split-DB pattern. A high-write append-only table next to the user's tree would slow every editor read.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Three reasons</div>
          <ul className="space-y-3 text-lg list-disc pl-6">
            <li><strong>Write contention.</strong> Every mutation appends one row. Co-locating with <code>Item</code> would lock the tree on every edit.</li>
            <li><strong>Different retention.</strong> Items live until trashed; events purge after 30 days. Two cron schedules, two DBs.</li>
            <li><strong>Backup separation.</strong> Audit logs may need legal retention; user data may need GDPR delete. Decouple the files.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Forbidden</div>
          <ul className="space-y-3 text-lg list-disc pl-6">
            <li>Cross-DB JOIN between <code>Item</code> and <code>ActivityEvent</code> (split-DB invariant, ADR-0019).</li>
            <li>Storing events as <code>Item</code> rows with <code>ItemType=Activity</code> (alias-bridge violation, <code>G-04-NO-DDL-PLURALS</code>).</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-04</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">spec/05-split-db-architecture/</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">ADR-0019</span>
      </div>
    </SlideLayout>
  );
}
