import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="B-3 · Sync sequence" title="A round-trip in detail">
      <Wireframe size={17}>{`  Client                       Server                     App DB
  ──────                       ──────                     ──────
  outbox = [op1, op2, op3]
  cursor = "cur-A"
                                                                   tx BEGIN
  POST /sync ──────────────▶  decodeCursor(cur-A) ────────────────▶ check
  { ops, cursor }              │                                    │
                               for each op:
                                 idempotency: seen clientOpId?
                                   yes → skip
                                 fetch ItemFieldStamp
                                 lwwApply(...) → keep | overwrite
                                 if overwrite:
                                   UPDATE Item / INSERT Mirror / ...
                                   UPSERT ItemFieldStamp
                                   INSERT ActivityLog (returns id)
                               fetch remote ops (ActivityLogId > sinceId,
                                                  != actor)
                               newCursor = encodeCursor(maxId)
                                                                   tx COMMIT
                               ───── publish to SSE bus ─────▶
  ◀────────── 200 OK ──────────────
  { newCursor, remoteOps,
    conflicts: [{itemId, field, kept:"server"}] }
  ─ apply remoteOps locally
  ─ persist newCursor`}</Wireframe>
    </SlideLayout>
  );
}
