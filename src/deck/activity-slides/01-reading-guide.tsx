import { SlideLayout } from "../SlideLayout";

export default function Guide() {
  return (
    <SlideLayout chapter="Reading guide" title="Why this deck exists"
      subtitle="An audit log is only useful if every mutation produces exactly one row, on time, with a valid payload. Anything less is worse than no log.">
      <div className="mt-8 grid grid-cols-2 gap-8 text-xl">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What this deck covers</div>
          <ul className="space-y-3 list-disc pl-6">
            <li>The dedicated <code>activity.db</code> + the <code>ActivityEvent</code> table</li>
            <li>The 8-value closed <code>EventType</code> enum + per-type Zod payloads</li>
            <li>The 5-stage capture pipeline (Intent → Capture → Persist → Replay → Broadcast)</li>
            <li>Mirror-first feed loaders, exhaustive row dispatcher, SSE invalidate-only</li>
            <li>30-day retention with cursor-pinned mirror compaction</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What this deck explicitly forbids</div>
          <ul className="space-y-3 list-disc pl-6">
            <li>Direct INSERTs into <code>ActivityEvent</code> outside <code>captureEvent</code></li>
            <li><code>new Date().toISOString()</code> inside action handlers</li>
            <li>Split mirror+queue writes (must be one IDB transaction)</li>
            <li><code>default:</code> case in the row-type dispatcher</li>
            <li>Recomputing <code>OccurredAt + 30d</code> in the purge WHERE clause</li>
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}
