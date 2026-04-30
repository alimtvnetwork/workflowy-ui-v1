import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-5 · Mirrors" title="Cycle detection" subtitle="A mirror cannot live inside its own source's subtree — that would create an infinite read loop. We reject the op before it commits.">
      <SqlBlock caption="Recursive CTE walks UP from the target parent. If the source ID appears anywhere on that path, the placement is a cycle.">{`function wouldCreateMirrorCycle(sourceId: number, targetParentId: number|null): boolean {
  if (targetParentId === null) return false;
  if (targetParentId === sourceId) return true;

  const row = db.prepare(\`
    WITH RECURSIVE ancestors(id, parentItemId, mirrorOfItemId) AS (
      SELECT id, parentItemId, mirrorOfItemId FROM items WHERE id = ?
      UNION ALL
      SELECT i.id, i.parentItemId, i.mirrorOfItemId
        FROM items i
        JOIN ancestors a ON i.id = COALESCE(a.mirrorOfItemId, a.parentItemId)
    )
    SELECT 1 AS hit FROM ancestors WHERE id = ? LIMIT 1\`)
    .get(targetParentId, sourceId);

  return !!row;
}

async function applyMirror(op: MirrorOp, actor: UserId) {
  return db.transaction(() => {
    const source = db.prepare("SELECT * FROM items WHERE id = ?").get(op.sourceItemId);
    if (!source || source.deletedAt) throw new ConflictError("source-missing");
    if (source.mirrorOfItemId)        throw new ConflictError("no-mirror-of-mirror");
    if (wouldCreateMirrorCycle(op.sourceItemId, op.parentItemId))
      throw new ConflictError("cycle");

    assertRead(actor, op.sourceItemId);   // can mirror only what you can read
    assertWrite(actor, op.parentItemId);

    db.prepare(\`INSERT INTO items
        (id, parentItemId, mirrorOfItemId, fractionalIndex, itemTypeId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)\`)
      .run(op.mirrorItemId, op.parentItemId, op.sourceItemId,
           op.fractionalIndex, source.itemTypeId, op.ts, op.ts);
  });
}`}</SqlBlock>
    </SlideLayout>
  );
}
