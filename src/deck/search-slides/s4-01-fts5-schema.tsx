import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-4 · Backend" title="FTS5 schema — App-DB only, never cross-DB joined"
      subtitle="One virtual table, two tracked columns, three triggered writers. Mirror compaction is irrelevant — the index is a content-mirror.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`-- App DB (per workspace)
CREATE VIRTUAL TABLE Items_fts USING fts5(
  Content,
  Note,
  content='Items',
  content_rowid='RowId'
);

-- Triggered writers (auto-sync from Items)
CREATE TRIGGER Items_ai AFTER INSERT ON Items BEGIN
  INSERT INTO Items_fts(rowid, Content, Note)
  VALUES (new.RowId, new.Content, new.Note);
END;
-- (similar for AFTER UPDATE and AFTER DELETE)

-- Recency tiebreak inside buckets
CREATE INDEX IdxItem_LiveByUpdatedAt
  ON Items(UpdatedAt DESC) WHERE DeletedAt IS NULL;

-- #tag operator
CREATE INDEX IdxItemTags_Tag
  ON ItemTags(Tag, ItemId);`}
      </pre>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">ADR-0019 (App-DB split)</span>
        <span className="px-2 py-1 rounded bg-destructive/15 text-destructive font-mono">No cross-DB joins</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">Partial index for live items</span>
      </div>
    </SlideLayout>
  );
}
