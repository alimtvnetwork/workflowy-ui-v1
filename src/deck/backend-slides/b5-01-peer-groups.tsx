import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-5 · Mirrors" title="Peer-group resolution" subtitle="A mirror is a pointer to a source item. Editing any peer (source or mirror) edits the same content row — peers are resolved on read.">
      <SqlBlock caption="`mirrors` is a thin join table. The `items` row of a mirror has `mirrorOfItemId` set; its `content` column is ignored at read time.">{`-- Schema
CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  parentItemId INTEGER REFERENCES items(id),
  mirrorOfItemId INTEGER REFERENCES items(id),  -- NULL for sources
  content TEXT,                                  -- authoritative on source only
  fractionalIndex TEXT NOT NULL,
  brokenAt TEXT,                                 -- set when source deleted
  ...
);
CREATE INDEX idx_items_mirror_of ON items(mirrorOfItemId);

-- Read-side resolution: always join to source for content fields.
SELECT
  m.id, m.parentItemId, m.fractionalIndex,
  COALESCE(s.content, m.content)        AS content,
  COALESCE(s.itemTypeId, m.itemTypeId)  AS itemTypeId,
  m.mirrorOfItemId IS NOT NULL          AS isMirror,
  m.brokenAt
FROM items m
LEFT JOIN items s ON s.id = m.mirrorOfItemId
WHERE m.parentItemId = ? AND m.deletedAt IS NULL
ORDER BY m.fractionalIndex;`}</SqlBlock>
    </SlideLayout>
  );
}
