import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-1 · Storage" title="The `FeedbackReport` schema, line by line"
      subtitle="CHECK constraints mirror Zod schemas. PurgeAfter is computed at INSERT, never in WHERE.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`CREATE TABLE FeedbackReport (
  FeedbackReportId   INTEGER PRIMARY KEY AUTOINCREMENT,
  SubmittedByUserId  TEXT NOT NULL,                          -- branded OwnerId on read
  FeedbackType       TEXT NOT NULL
    CHECK (FeedbackType IN ('Bug','Idea','Praise','Question')),
  Title              TEXT NOT NULL CHECK (length(Title) BETWEEN 1 AND 120),
  Body               TEXT NOT NULL CHECK (length(Body)  BETWEEN 1 AND 2000),
  DiagnosticsJson    TEXT NOT NULL,                          -- shape enforced by Zod
  ScreenshotBlobRef  TEXT NULL,                              -- opaque key; never raw bytes
  Status             TEXT NOT NULL DEFAULT 'New'
    CHECK (Status IN ('New','Triaged','InProgress','Resolved','WontFix','Duplicate')),
  SubmittedAt        TEXT NOT NULL,
  ResolvedAt         TEXT NULL,
  PurgeAfter         TEXT NOT NULL                           -- = SubmittedAt + 90 days
);`}
      </pre>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-04-PASCAL-COLUMNS</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-04-NO-DDL-PLURALS</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-ENUM-CLOSED</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-LENGTH-MIRROR</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-PURGE-AFTER-COMPUTED</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-NO-INLINE-BLOB</span>
      </div>
    </SlideLayout>
  );
}
