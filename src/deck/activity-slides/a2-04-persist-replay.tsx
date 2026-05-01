import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-2 · Capture" title="Stages 3 & 4 — Persist and Replay"
      subtitle="One queue. One server endpoint. Server re-validates because the client is not a trust boundary.">
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Stage 3 — Persist (queue worker)</div>
          <ul className="space-y-3 text-base list-disc pl-6">
            <li>Single FIFO queue per ADR-0023 — <strong>no parallel "activity queue"</strong>.</li>
            <li>Drains and POSTs <code>/activity/event</code> with the canonical PascalCase envelope.</li>
            <li>Successful reply stamps the local mirror row with the server-issued <code>ActivityEventId</code>.</li>
            <li>UI may render the draft optimistically before the stamp arrives.</li>
          </ul>
          <div className="mt-4">
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-xs">G-34-CP-SINGLE-QUEUE</span>
          </div>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Stage 4 — Replay (server REST)</div>
          <ul className="space-y-3 text-base list-disc pl-6">
            <li>Re-validates <code>Payload</code> against <code>PayloadSchemaForType</code> (PHP equivalent).</li>
            <li>Re-computes <code>PurgeAfter</code> server-side — matches client because both use the same <code>OccurredAt</code>.</li>
            <li>INSERT uses <code>ON CONFLICT (ActorUserId, EventType, TargetItemId, OccurredAt) DO NOTHING</code> — retries collapse to one row.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-xs">G-34-CP-SERVER-REVALIDATE</span>
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-xs">G-34-CP-IDEMPOTENT-INSERT</span>
          </div>
        </div>
      </div>
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-4 text-xs font-mono">
{`CREATE UNIQUE INDEX UX_ActivityEvent_Idempotency
  ON ActivityEvent (ActorUserId, EventType, TargetItemId, OccurredAt);`}
      </pre>
    </SlideLayout>
  );
}
