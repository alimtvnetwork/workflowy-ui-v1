import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-9 · Indexes" title="Query plans & hot indexes" subtitle="Every read endpoint has an `EXPLAIN QUERY PLAN` snapshot checked into `tests/query-plans/`. CI fails if a plan changes from `SEARCH ... USING INDEX` to `SCAN`.">
      <SqlBlock caption="The compound index order matters: most selective column first. `(parentItemId, fractionalIndex)` powers the children listing AND the sort in one index pass.">{`-- Hot indexes (app DB)
CREATE INDEX idx_items_parent_idx
  ON items(parentItemId, fractionalIndex)
  WHERE deletedAt IS NULL;                 -- partial: ignore trash

CREATE INDEX idx_items_workspace_alive
  ON items(workspaceId) WHERE deletedAt IS NULL;

CREATE INDEX idx_items_due
  ON items(workspaceId, dueDate)
  WHERE dueDate IS NOT NULL AND completedAt IS NULL;   -- "today" view

CREATE INDEX idx_activity_workspace_time
  ON activity(workspaceId, createdAt DESC);             -- feed pagination

CREATE INDEX idx_sessions_token_hash
  ON sessions(tokenHash) WHERE revokedAt IS NULL;

-- Query plan check (pinned in tests)
EXPLAIN QUERY PLAN
  SELECT id, content FROM items
   WHERE parentItemId = ? AND deletedAt IS NULL
   ORDER BY fractionalIndex
   LIMIT 200;
-- Expected:
-- SEARCH items USING INDEX idx_items_parent_idx (parentItemId=?)
-- (no separate SORT step — index supplies order)

-- ANALYZE is run after every migration so SQLite has fresh stats.`}</SqlBlock>
    </SlideLayout>
  );
}
