import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-1 · Schema" title="Cursor format + SSE frame"
      subtitle="Pagination is not opaque base64. The cursor is a strict total order over (OccurredAt, ActivityEventId).">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Cursor — `^\\d&#123;13&#125;_\\d+$`</div>
          <pre className="rounded-lg border border-border bg-muted/20 p-4 text-sm font-mono">
{`1714499696000_42

  ↑              ↑
  OccurredAtMs   ActivityEventId

→ stable descending sort
→ debuggable in logs
→ no base64 parser needed`}
          </pre>
          <p className="mt-3 text-sm text-muted-foreground">
            Loaders that receive a malformed cursor MUST throw{" "}
            <code>BoundaryParseError(USR-34-CURSOR)</code> before touching IDB.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">SSE frame — `event: activity`</div>
          <pre className="rounded-lg border border-border bg-muted/20 p-4 text-sm font-mono">
{`event: activity
id: 12345
data: {
  "Status": "Success",
  "Attributes": { "PageItemId": "itm_root" },
  "Results": [{
    "ActivityEventId": 12345,
    "EventType": "ItemMoved",
    "Payload": { ... },     // parsed object
    "OccurredAt": "..."
  }]
}`}
          </pre>
          <p className="mt-3 text-sm text-muted-foreground">
            The <code>id:</code> line is the <code>ActivityEventId</code>. SSE
            reconnect with <code>Last-Event-ID: 12345</code> replays
            strictly-greater rows.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-ES-CURSOR-SHAPE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-ES-PARSED-PAYLOAD</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">ADR-0025 (SSE)</span>
      </div>
    </SlideLayout>
  );
}
