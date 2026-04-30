import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-4 · Item ops" title="Move / indent / outdent atomicity" subtitle="Every structural change runs inside one SQLite transaction with a server-validated parent and index.">
      <SqlBlock caption="Single-writer SQLite means no row-locks; we wrap the read-validate-write triple in BEGIN IMMEDIATE so concurrent ops queue cleanly.">{`async function applyMove(op: MoveOp, actor: UserId) {
  return db.transaction(() => {
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(op.itemId);
    if (!item) throw new ConflictError("missing", op.itemId);
    if (item.deletedAt) throw new ConflictError("deleted", op.itemId);

    // Reject cycles: walk parent chain, must not contain itemId.
    if (op.parentItemId && wouldCycle(op.itemId, op.parentItemId))
      throw new ConflictError("cycle", op.itemId);

    // Permission check: actor must have write on BOTH old + new parent's workspace.
    assertWrite(actor, item.parentItemId);
    assertWrite(actor, op.parentItemId);

    db.prepare(\`
      UPDATE items
         SET parentItemId = ?, fractionalIndex = ?, updatedAt = ?
       WHERE id = ? AND updatedAt < ?\`     // LWW guard
    ).run(op.parentItemId, op.fractionalIndex, op.ts, op.itemId, op.ts);

    recordActivity(actor, "move", op.itemId, { from: item.parentItemId, to: op.parentItemId });
  });
}

// indent  = move(itemId, parent = prevSibling.id, index = lastChildIndex+step)
// outdent = move(itemId, parent = grandparent.id, index = between(parent, parent.next))`}</SqlBlock>
    </SlideLayout>
  );
}
