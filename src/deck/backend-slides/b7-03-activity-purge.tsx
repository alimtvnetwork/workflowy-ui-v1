import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-7 · Jobs" title="Activity purge" subtitle="The activity feed is append-only and grows fast. We keep 90 days hot in the app DB; older rows are streamed to a cold archive file and dropped.">
      <SqlBlock caption="Archive lives next to backups: `archive/activity-YYYY-MM.ndjson.gz`. The archive job is idempotent — re-running over the same window writes a `.partN.gz` file rather than overwriting.">{`const ACTIVITY_HOT_DAYS = 90;

const activityPurgeJob: JobSpec = {
  name: "activity-purge",
  schedule: "30 3 * * *",               // daily, 03:30 UTC
  async run(ctx) {
    const cutoff = isoMinus(ACTIVITY_HOT_DAYS * 86_400_000);

    // 1. Stream rows older than cutoff to a gzip ndjson file.
    const path = \`archive/activity-\${monthKey(cutoff)}.ndjson.gz\`;
    const out = createGzip();  out.pipe(fs.createWriteStream(path, { flags: "a" }));

    const stmt = db.prepare(\`
      SELECT id, actorUserId, verb, itemId, payload, createdAt
        FROM activity
       WHERE createdAt < ?
       ORDER BY id
       LIMIT 5000\`);

    let lastId = 0, archived = 0;
    while (true) {
      const rows = stmt.all(cutoff);
      if (rows.length === 0) break;
      for (const r of rows) out.write(JSON.stringify(r) + "\\n");
      lastId = rows[rows.length - 1].id;
      archived += rows.length;
      if (rows.length < 5000) break;
    }
    await new Promise(res => out.end(res));

    // 2. Delete the archived range in one statement.
    const deleted = db.prepare("DELETE FROM activity WHERE id <= ? AND createdAt < ?")
      .run(lastId, cutoff).changes;

    ctx.log("activity-purge", { archived, deleted, archive: path });
    return { rowsAffected: deleted };
  },
};`}</SqlBlock>
    </SlideLayout>
  );
}
