import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-7 · Jobs" title="SSE fan-out" subtitle="A single in-memory hub holds one Set of writers per workspace. Sync writes call `publish(workspaceId, op)`; the hub serializes once and writes to every live socket.">
      <SqlBlock caption="Backpressure: per-socket bounded queue (256 ops). Slow consumers are dropped with a `reconnect` event so they catch up via the cursor sync API instead of stalling the hub.">{`type Subscriber = {
  res: ServerResponse;
  queue: Op[];
  lastEventId: number;
};
const hub = new Map<WorkspaceId, Set<Subscriber>>();

function subscribe(ws: WorkspaceId, sub: Subscriber) {
  let set = hub.get(ws);
  if (!set) { set = new Set(); hub.set(ws, set); }
  set.add(sub);
  sub.res.on("close", () => { set!.delete(sub); if (set!.size === 0) hub.delete(ws); });
}

function publish(ws: WorkspaceId, op: Op) {
  const subs = hub.get(ws); if (!subs) return;
  const frame = \`id: \${op.serverSeq}\\nevent: op\\ndata: \${JSON.stringify(op)}\\n\\n\`;
  for (const sub of subs) {
    if (sub.queue.length >= 256) {
      sub.res.write("event: reconnect\\ndata: backpressure\\n\\n");
      sub.res.end();   // client reconnects via cursor sync
      continue;
    }
    sub.queue.push(op);
    sub.res.write(frame);
  }
}

// Heartbeat job — keeps proxies from idling sockets out.
const sseHeartbeatJob: JobSpec = {
  name: "sse-heartbeat", schedule: "*/15 * * * * *",   // every 15s
  async run() {
    let n = 0;
    for (const subs of hub.values())
      for (const s of subs) { s.res.write(": ping\\n\\n"); n++; }
    return { rowsAffected: n };
  },
};`}</SqlBlock>
    </SlideLayout>
  );
}
