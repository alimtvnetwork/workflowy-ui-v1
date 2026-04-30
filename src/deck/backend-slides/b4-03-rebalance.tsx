import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-4 · Item ops" title="Rebalance & conflict cases" subtitle="Two clients can mint identical fractional indexes. The server resolves by appending the actor's ULID suffix during conflict, then schedules a lazy rebalance.">
      <SqlBlock caption="Rebalance only runs when a sibling group's longest index exceeds 32 chars OR a duplicate is detected. It's idempotent and safe to retry.">{`// Conflict: two ops produce the same (parentItemId, fractionalIndex).
//   We DO NOT reject — both items are valid. We disambiguate by appending
//   the actor's ULID suffix so order is deterministic across replicas.
function dedupeIndex(parentId: number|null, idx: string, actor: UserId): string {
  const clash = db.prepare(\`
    SELECT id FROM items
     WHERE parentItemId IS ? AND fractionalIndex = ? AND deletedAt IS NULL\`)
    .get(parentId, idx);
  if (!clash) return idx;
  return idx + ":" + actor.slice(-6);  // suffix preserves total order
}

// Lazy rebalance — runs in background job (Phase B-7).
async function rebalanceSiblings(parentId: number|null) {
  const rows = db.prepare(\`
    SELECT id FROM items
     WHERE parentItemId IS ? AND deletedAt IS NULL
     ORDER BY fractionalIndex\`).all(parentId);
  const step = Math.floor(62 / (rows.length + 1));
  rows.forEach((r, i) => {
    const newIdx = ALPHABET[step * (i + 1)];
    db.prepare("UPDATE items SET fractionalIndex = ? WHERE id = ?").run(newIdx, r.id);
  });
  // Emit a synthetic 'move' op on the SSE channel so clients re-sort.
}`}</SqlBlock>
    </SlideLayout>
  );
}
