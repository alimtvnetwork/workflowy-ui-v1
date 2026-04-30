import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-7 · Jobs" title="Trash reaper" subtitle="Hard-deletes items soft-deleted more than 30 days ago. Runs hourly, deletes in chunks of 500 to keep transactions short.">
      <SqlBlock caption="Foreign keys are ON DELETE CASCADE for descendants and item_tags, so one DELETE per root cleans the whole subtree. Mirrors pointing at reaped sources stay in `brokenAt` state — the reaper does NOT touch them.">{`const TRASH_TTL_DAYS = 30;
const CHUNK = 500;

const trashReaperJob: JobSpec = {
  name: "trash-reaper",
  schedule: "0 * * * *",                // hourly, on the hour
  async run(ctx) {
    const cutoff = isoMinus(TRASH_TTL_DAYS * 86_400_000);
    let totalDeleted = 0;

    while (true) {
      const ids = db.prepare(\`
        SELECT id FROM items
         WHERE deletedAt IS NOT NULL
           AND deletedAt < ?
           AND parentItemId IS NULL OR parentItemId NOT IN (
             SELECT id FROM items WHERE deletedAt IS NOT NULL
           )                            -- only reap subtree roots
         LIMIT ?\`).all(cutoff, CHUNK).map(r => r.id);

      if (ids.length === 0) break;

      const deleted = db.transaction(() => {
        const placeholders = ids.map(() => "?").join(",");
        return db.prepare(\`DELETE FROM items WHERE id IN (\${placeholders})\`)
          .run(...ids).changes;
      })();

      totalDeleted += deleted;
      ctx.log("trash-reaper chunk", { deleted, totalDeleted });
      if (ids.length < CHUNK) break;
    }
    return { rowsAffected: totalDeleted };
  },
};`}</SqlBlock>
    </SlideLayout>
  );
}
