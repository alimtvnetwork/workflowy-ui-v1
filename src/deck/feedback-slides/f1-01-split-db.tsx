import { SlideLayout } from "../SlideLayout";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-1 · Storage" title="Dedicated `feedback.db` — never co-located with items"
      subtitle="Per the split-DB pattern. Different retention, different access roles, different blast radius.">
      <div className="mt-6">
        <DbTable tables={[
          { table: "items.db", columns: ["Item", "Mirror", "Share", "PeerGroup"], note: "User content. Mirrored offline. Per-user RLS." },
          { table: "feedback.db", columns: ["FeedbackReport", "FeedbackReportNote", "GdprDeletionLog"], note: "Admin-only read. 90-day retention. Singular table names." },
        ]} />
      </div>
      <div className="mt-8 rounded-lg border border-border p-5 text-base">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Why the split matters</div>
        <p>If feedback rows live next to items, the daily reaper either touches the items table (bad) or the items reaper touches feedback (also bad). Two databases = two purge jobs = no shared locks, no shared tx failure modes.</p>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-primary/15 text-primary font-mono">G-33-DM-PK-AUTOINCREMENT</span>
          <span className="px-2 py-0.5 rounded bg-primary/15 text-primary font-mono">AT-FEEDBACKREPORT-06</span>
        </div>
      </div>
    </SlideLayout>
  );
}
