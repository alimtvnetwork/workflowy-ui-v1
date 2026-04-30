import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-3 · Offline replay" title="The client outbox" subtitle="IndexedDB-backed FIFO. Optimistic UI, exactly-once server apply.">
      <SqlBlock caption="`clientOpId` is a UUIDv7 generated at the moment of edit. The server stores it in ActivityLog.PayloadJson and rejects duplicates — so retrying a flaky network never double-applies.">{`// client-side outbox (browser, IndexedDB)
async function enqueue(op: Op) {
  op.clientOpId ??= uuidv7();           // monotonically increasing
  await idb.put("outbox", op);
  applyOptimistically(op);              // update local React state
  void flushSoon();                     // debounced 200ms
}

async function flushSoon() {
  if (flushing || !navigator.onLine) return;
  flushing = true;
  try {
    while (true) {
      const ops = await idb.getAll("outbox", { limit: 200 });
      if (ops.length === 0) break;

      const cursor = await idb.get("meta", "cursor");
      const ack = await fetch("/wf/v1/sync", {
        method: "POST",
        body: JSON.stringify({ ops, cursor }),
      }).then(r => {
        if (!r.ok) throw new SyncError(r.status);
        return r.json();
      });

      await idb.tx("rw", ["outbox", "meta"], async (tx) => {
        for (const op of ops) await tx.delete("outbox", op.clientOpId);
        await tx.put("meta", { key: "cursor", value: ack.newCursor });
      });

      applyRemote(ack.remoteOps);
      reportConflicts(ack.conflicts);
    }
  } catch (e) {
    backoff();                          // exponential, jittered, max 30s
  } finally {
    flushing = false;
  }
}

window.addEventListener("online", flushSoon);`}</SqlBlock>
    </SlideLayout>
  );
}
