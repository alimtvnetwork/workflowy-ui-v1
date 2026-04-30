import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-6 · Templates" title="Snapshot serialization" subtitle="A template is an immutable, versioned JSON snapshot of an item subtree — no foreign keys, no live references. Safe to share across workspaces.">
      <SqlBlock caption="`templates.snapshot` is canonicalized JSON (sorted keys) so SHA-256 over it gives a stable content hash for dedup and integrity checks.">{`-- Schema (templates DB — separate from app DB)
CREATE TABLE templates (
  id            INTEGER PRIMARY KEY,
  ownerUserId   INTEGER NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  snapshot      TEXT NOT NULL,           -- canonical JSON, see below
  contentHash   TEXT NOT NULL,           -- sha256(snapshot)
  schemaVersion INTEGER NOT NULL,        -- bumped when shape changes
  visibility    TEXT NOT NULL CHECK (visibility IN ('private','workspace','public')),
  createdAt     TEXT NOT NULL,
  updatedAt     TEXT NOT NULL
);
CREATE INDEX idx_templates_hash ON templates(contentHash);

// Snapshot shape — recursive, no DB IDs leak out.
interface TemplateNode {
  localId: string;            // ULID, scoped to this snapshot only
  itemTypeId: number;         // fundamental types are stable across installs
  content: string;
  fractionalIndex: string;
  tags?: string[];            // tag names, not IDs
  children?: TemplateNode[];
}
interface TemplateSnapshot {
  schemaVersion: 1;
  root: TemplateNode;
  createdBy: { displayName: string };  // attribution only, no userId
}`}</SqlBlock>
    </SlideLayout>
  );
}
