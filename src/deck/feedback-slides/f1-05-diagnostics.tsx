import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-1 · Storage" title="`Diagnostics` JSON — strict, capped, PII-bounded"
      subtitle="Same Zod schema parses it on client write and server read. No trust of stored JSON.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`const DiagnosticsSchema = z.object({
  ClientBuildSha:    z.string().regex(/^[0-9a-f]{7,40}$/),
  CurrentItemId:     ItemIdSchema.nullable(),     // branded
  BreadcrumbPath:    z.array(ItemIdSchema).max(64),
  ViewportWidthPx:   z.number().int().min(0).max(16384),
  ViewportHeightPx:  z.number().int().min(0).max(16384),
  UserAgent:         z.string().max(512),
  RouteHref:         z.string().max(2048),        // origin-relative; query stripped
  LastErrorBoundary: z.string().nullable(),       // one of 8 named boundaries
  OfflineQueueDepth: z.number().int().min(0),
}).strict();`}
      </pre>
      <div className="mt-6 grid grid-cols-2 gap-6 text-base">
        <div className="rounded-lg border border-destructive/40 p-4">
          <div className="text-xs uppercase tracking-wider text-destructive mb-2">✗ Forbidden field names</div>
          <p className="font-mono">Email · IpAddress · Token · Cookie · Content · Body</p>
        </div>
        <div className="rounded-lg border border-primary/40 p-4">
          <div className="text-xs uppercase tracking-wider text-primary mb-2">✓ Why .strict()</div>
          <p>Unknown keys are rejected. A future build that captures more context can't sneak PII past code review by quietly extending the JSON.</p>
        </div>
      </div>
      <div className="mt-6 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-DIAG-STRICT</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-BREADCRUMB-CAP</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-NO-PII</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-DIAG-SCHEMA-SSOT</span>
      </div>
    </SlideLayout>
  );
}
