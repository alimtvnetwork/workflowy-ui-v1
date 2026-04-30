import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-5 · Mirrors" title="BrokenAt propagation" subtitle="When a source is deleted, its mirrors don't disappear — they're flagged `brokenAt` so the UI can show a tombstone and the user decides whether to keep, restore, or delete.">
      <SqlBlock caption="Propagation is part of the same delete transaction. Restore reverses it. Permission revocation triggers the same path, scoped to the affected workspace.">{`async function applyDelete(op: DeleteOp, actor: UserId) {
  return db.transaction(() => {
    // Soft-delete the source item
    db.prepare("UPDATE items SET deletedAt = ?, updatedAt = ? WHERE id = ?")
      .run(op.ts, op.ts, op.itemId);

    // Propagate to mirrors — set brokenAt, keep parentItemId so the row stays
    // visible in its host workspace.
    db.prepare(\`
      UPDATE items
         SET brokenAt = ?, updatedAt = ?
       WHERE mirrorOfItemId = ? AND brokenAt IS NULL\`)
      .run(op.ts, op.ts, op.itemId);

    // Emit synthetic 'update' ops for each mirror so peer clients re-render.
    const mirrors = db.prepare(
      "SELECT id, parentItemId FROM items WHERE mirrorOfItemId = ?"
    ).all(op.itemId);
    for (const m of mirrors) {
      sseFanout(workspaceOf(m.parentItemId), {
        op: "update", itemId: m.id, fields: { brokenAt: op.ts }, ts: op.ts,
      });
    }
  });
}

// Restore reverses it
async function applyRestore(op: RestoreOp) {
  // Un-delete the source
  db.prepare("UPDATE items SET deletedAt = NULL WHERE id = ?")
    .run(op.itemId);
    
  db.prepare("UPDATE items SET brokenAt = NULL WHERE mirrorOfItemId = ?")
    .run(op.itemId);
}

// Permission revocation: workspace.removeMember(userId) walks all mirrors
// pointing INTO that workspace from outside and marks brokenAt for those
// host workspaces where the actor lost read access.`}</SqlBlock>
    </SlideLayout>
  );
}
