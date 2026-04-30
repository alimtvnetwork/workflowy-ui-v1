import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-9 · Migrations" title="v2 example: add mirrorOfItemId" subtitle="Adding a self-referential FK column without rebuilding the table. SQLite supports `ADD COLUMN` with FK only since 3.35; we backfill nulls and add the index in the same migration.">
      <SqlBlock caption="The CHECK clause prevents a row from mirroring itself. The partial index keeps the lookup table tiny — most rows are NOT mirrors.">{`-- migrations/0002_add_mirror_of.sql

ALTER TABLE items
  ADD COLUMN mirrorOfItemId INTEGER REFERENCES items(id) ON DELETE SET NULL
    CHECK (mirrorOfItemId IS NULL OR mirrorOfItemId <> id);

ALTER TABLE items
  ADD COLUMN brokenAt TEXT;            -- set when source is deleted

-- Partial index: only mirrors. ~1-3% of rows in practice.
CREATE INDEX idx_items_mirror_of
  ON items(mirrorOfItemId)
  WHERE mirrorOfItemId IS NOT NULL;

-- Rollback strategy (NOT in this file — kept in /migrations/rollback/):
-- SQLite has no DROP COLUMN before 3.35; if downgrade is needed we
-- snapshot the DB file before migrate() runs and swap it back in.

-- Forward-compatibility: pre-v2 clients still work. They send 'mirror'
-- ops which the v1 server rejects with 'unknown-op'; the client falls
-- back to a normal 'create' (graceful degradation, see B-3).`}</SqlBlock>
    </SlideLayout>
  );
}
