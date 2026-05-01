import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-4 · Retention" title="Mirror compaction — clamped by open cursors"
      subtitle="The IDB mirror is purged piggy-backed on each SSE batch. The cutoff is clamped to the oldest open feed cursor.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`cutoffIso       = clock.nowIso() − 30 days
openCursors     = ActivityFeedStore.getOpenCursors()
oldestPinnedIso = openCursors.minBy(c => c.cursorIso) ?? cutoffIso
effectiveCutoff = min(cutoffIso, oldestPinnedIso)

idb.tx('ActivityEventMirror', 'readwrite', tx => {
  const idx   = tx.objectStore('ActivityEventMirror').index('PurgeAfter');
  const range = IDBKeyRange.upperBound(effectiveCutoff);
  for await (const cursor of idx.iterate(range)) {
    cursor.delete();
  }
});`}
      </pre>
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Why pin to the oldest cursor?</div>
          <p className="text-base text-muted-foreground">
            Deleting a row referenced by an open paginated cursor would punch a
            hole in the descending sort. Next page-fetch would skip rows. The
            clamp guarantees that as long as a cursor exists, its events
            survive.
          </p>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Local-only — no FIFO</div>
          <p className="text-base text-muted-foreground">
            Mirror compaction MUST NOT enqueue any "delete on server too"
            mutation. The server purge is authoritative; client compaction is
            cleanup. <code>G-34-RP-MIRROR-NO-FIFO</code>.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-RP-CURSOR-PIN</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-RP-MIRROR-INDEX-ONLY</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-16</span>
      </div>
    </SlideLayout>
  );
}
