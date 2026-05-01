import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-1 · Schema" title="The `ActivityEvent` table, line by line"
      subtitle="PascalCase columns. CHECK constraint mirrors the TS enum. PurgeAfter computed at INSERT.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`CREATE TABLE ActivityEvent (
  ActivityEventId INTEGER PRIMARY KEY AUTOINCREMENT,
  EventType       TEXT    NOT NULL CHECK (EventType IN (
                    'ItemCreated','ItemUpdated','ItemMoved','ItemDeleted',
                    'ItemRestored','ItemMirrored','BoardColumnReordered','TemplateApplied'
                  )),
  ActorUserId     INTEGER NOT NULL REFERENCES "User"(UserId),
  TargetItemId    TEXT    NOT NULL,                 -- branded ItemId at TS layer
  ParentItemId    TEXT,                             -- nullable for top-level
  PageItemId      TEXT    NOT NULL,                 -- denormalised root for fast page-feed
  PayloadJson     TEXT    NOT NULL DEFAULT '{}',    -- per-EventType, Zod-validated
  OccurredAt      TEXT    NOT NULL,                 -- ISO 8601 UTC
  IngestedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  Reversible      INTEGER NOT NULL DEFAULT 1,       -- 0 only for TemplateApplied
  PurgeAfter      TEXT    NOT NULL                  -- = OccurredAt + 30 days
);
CREATE INDEX IX_ActivityEvent_PageItemId_OccurredAt
  ON ActivityEvent (PageItemId, OccurredAt DESC);
CREATE INDEX IX_ActivityEvent_PurgeAfter ON ActivityEvent (PurgeAfter);`}
      </pre>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-04-PASCAL-COLUMNS</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-ES-NOT-NULL</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-ES-PURGE-AFTER-COMPUTED</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-ES-CLOSED-ENUM</span>
      </div>
    </SlideLayout>
  );
}
