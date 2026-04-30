import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-3 · Cursors" title="Opaque cursors anchor every replay" subtitle="The client never inspects the cursor. The server can change its format any time.">
      <SqlBlock caption="Internally an ActivityLog id + a hash. The hash detects tampering and prevents replay across users. Stored in `SyncCursor` per user, also returned in every /sync ack.">{`// server-side cursor encoding (opaque to the client)
function encodeCursor(userId: number, lastActivityLogId: number): string {
  const payload = \`\${userId}:\${lastActivityLogId}\`;
  const sig = hmacSha256(SERVER_CURSOR_SECRET, payload).slice(0, 12);
  return base64url(\`\${payload}|\${sig}\`);
}

function decodeCursor(userId: number, cursor: string): number {
  const [payload, sig] = base64urlDecode(cursor).split("|");
  const expected = hmacSha256(SERVER_CURSOR_SECRET, payload).slice(0, 12);
  if (!constantTimeEq(sig, expected)) throw new SyncError("cursor_invalid");
  const [u, idStr] = payload.split(":");
  if (Number(u) !== userId) throw new SyncError("cursor_other_user");
  return Number(idStr);
}

// /sync handler — fetch remote ops since cursor
const sinceId = req.body.cursor ? decodeCursor(userId, req.body.cursor) : 0;
const remote = await appDb.query(
  \`SELECT ActivityLogId, PayloadJson FROM ActivityLog
    WHERE ActivityLogId > ? AND ActorUserId != ?
    ORDER BY ActivityLogId ASC LIMIT 500\`, [sinceId, userId]);

// after applying client ops, find the new max id and re-encode
const newMaxId = await appDb.queryOne(\`SELECT MAX(ActivityLogId) m FROM ActivityLog\`);
const newCursor = encodeCursor(userId, newMaxId.m ?? sinceId);
await rootDb.run(\`UPDATE SyncCursor SET Cursor = ?, UpdatedAt = datetime('now')
                   WHERE UserId = ?\`, [newCursor, userId]);`}</SqlBlock>
    </SlideLayout>
  );
}
