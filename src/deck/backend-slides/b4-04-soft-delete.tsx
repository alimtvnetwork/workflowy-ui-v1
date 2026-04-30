import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-4 · Item ops" title="Soft-delete & restore" subtitle="Delete sets `deletedAt`; the subtree stays intact so restore is O(1). The trash reaper (B-7) hard-deletes after 30 days.">
      <SqlBlock caption="Restore is the inverse but must verify the parent still exists & isn't itself trashed; otherwise we restore to the workspace root.">{`async function applyDelete(op: DeleteOp, actor: UserId) {
  return db.transaction(() => {
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(op.itemId);
    if (!item || item.deletedAt) return;     // idempotent
    assertWrite(actor, item.parentItemId);

    db.prepare("UPDATE items SET deletedAt = ?, updatedAt = ? WHERE id = ?")
      .run(op.ts, op.ts, op.itemId);

    // Cascade: descendants inherit deletedAt for trash listing,
    //         but their parent pointers stay so restore rebuilds the tree.
    db.prepare(\`
      WITH RECURSIVE sub(id) AS (
        SELECT ? UNION ALL
        SELECT i.id FROM items i JOIN sub ON i.parentItemId = sub.id
      )
      UPDATE items SET deletedAt = ? WHERE id IN sub AND deletedAt IS NULL\`)
      .run(op.itemId, op.ts);
  });
}

async function applyRestore(op: RestoreOp, actor: UserId) {
  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(op.itemId);
  if (!item?.deletedAt) return;
  const parent = db.prepare("SELECT deletedAt FROM items WHERE id = ?").get(item.parentItemId);
  const target = parent?.deletedAt ? null : item.parentItemId;   // fall back to root
  db.prepare("UPDATE items SET deletedAt = NULL, parentItemId = ?, updatedAt = ? WHERE id = ?")
    .run(target, op.ts, op.itemId);
}`}</SqlBlock>
    </SlideLayout>
  );
}
