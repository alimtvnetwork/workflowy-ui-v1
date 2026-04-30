import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-8 · Search" title="FTS5 virtual table" subtitle="Search runs on a SQLite FTS5 contentless table mirrored from `items`. We avoid `content=items` so item updates don't trigger automatic re-tokenization on hot writes.">
      <SqlBlock caption="Trigram tokenizer covers prefix + infix matching. Rank uses bm25 weighted to favor `content` over `tagsText`. Per-workspace filtering is applied AFTER FTS match via a second join.">{`-- Schema
CREATE VIRTUAL TABLE items_fts USING fts5(
  content,             -- item text
  tagsText,            -- space-separated tag names
  itemId UNINDEXED,    -- back-pointer
  workspaceId UNINDEXED,
  tokenize = "trigram"
);

-- Search query (ranked, scoped, paginated)
SELECT
  f.itemId,
  bm25(items_fts, 10.0, 2.0) AS rank      -- weight content 10×, tags 2×
FROM items_fts f
JOIN items i ON i.id = f.itemId
WHERE items_fts MATCH :query
  AND f.workspaceId IN (SELECT workspaceId FROM user_workspaces WHERE userId = :user)
  AND i.deletedAt IS NULL
ORDER BY rank
LIMIT 50 OFFSET :offset;

-- Index for the workspace filter on the joined items table
CREATE INDEX idx_items_workspace_alive
  ON items(workspaceId) WHERE deletedAt IS NULL;`}</SqlBlock>
    </SlideLayout>
  );
}
