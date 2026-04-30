import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-3 · SSE transport" title="Live updates without polling" subtitle="One long-lived GET per browser tab. Server pushes ops as they commit.">
      <SqlBlock caption="HTTP/1.1 chunked Server-Sent Events. Heartbeat every 15s keeps proxies from timing out. On reconnect, client sends `Last-Event-ID` header so it doesn't miss events.">{`// GET /wf/v1/events
res.writeHead(200, {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  "Connection": "keep-alive",
  "X-Accel-Buffering": "no",   // disable nginx buffer
});

const sub = sseBus.subscribe(req.workspaceId, (evt) => {
  if (evt.actorUserId === req.user.userId) return; // don't echo own ops
  res.write(\`id: \${evt.activityLogId}\\n\`);
  res.write(\`event: op\\n\`);
  res.write(\`data: \${JSON.stringify(evt.op)}\\n\\n\`);
});

// catch up if client provides Last-Event-ID
const lastId = Number(req.headers["last-event-id"] ?? 0);
if (lastId > 0) {
  const missed = await appDb.query(
    \`SELECT ActivityLogId, PayloadJson FROM ActivityLog
      WHERE ActivityLogId > ? AND ActorUserId != ?
      ORDER BY ActivityLogId ASC LIMIT 1000\`,
    [lastId, req.user.userId]);
  for (const m of missed) {
    res.write(\`id: \${m.ActivityLogId}\\nevent: op\\ndata: \${m.PayloadJson}\\n\\n\`);
  }
}

const heartbeat = setInterval(() => res.write(": ping\\n\\n"), 15_000);
req.on("close", () => { sub.unsubscribe(); clearInterval(heartbeat); });`}</SqlBlock>
    </SlideLayout>
  );
}
