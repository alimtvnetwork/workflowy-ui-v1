import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-2 · Capture" title="Stage 2 — captureEvent (the chokepoint)"
      subtitle="Validate. Compute PurgeAfter. Mirror + queue in ONE IDB transaction. Atomic or not at all.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`export async function captureEvent(intent: ActivityIntent): Promise<void> {
  // 1. Validate payload against per-type Zod schema
  const payloadSchema = PayloadSchemaForType[intent.EventType];
  const payload = payloadSchema.parse(intent.Payload);   // throws → no IDB write

  // 2. Compute PurgeAfter at capture time (per 01-event-schema.md)
  const purgeAfter = isoPlusDays(intent.OccurredAt, 30);

  // 3. Write mirror + queue in ONE IDB transaction (ADR-0023)
  await idb.transaction(
    ['ActivityEventMirror', 'Queue'],
    'readwrite',
    async (tx) => {
      const draft = {
        ...intent,
        Payload:    payload,
        PurgeAfter: purgeAfter,
        Reversible: isReversible(intent.EventType),
      };
      await tx.objectStore('ActivityEventMirror').add(draft);
      await tx.objectStore('Queue').add({
        Endpoint: 'POST /activity/event',
        Body:     draft,
      });
    },
  );
}`}
      </pre>
      <p className="mt-6 text-base text-muted-foreground">
        Atomicity matters. A crash between the mirror write and the queue
        enqueue would create a phantom local event with no server replica —
        the feed would lie. SQLite gives us this for free; we just have to use
        it.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-CP-ATOMIC-WRITE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-CP-VALIDATE-BEFORE-WRITE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-06</span>
      </div>
    </SlideLayout>
  );
}
