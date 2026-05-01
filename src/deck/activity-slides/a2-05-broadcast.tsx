import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-2 · Capture" title="Stage 5 — Broadcast (SSE, read-signal only)"
      subtitle="ADR-0025: realtime is SSE. Frames are read-signals. Subscribers MUST refetch — never enqueue from a callback.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What the server emits</div>
          <pre className="rounded-lg border border-border bg-muted/20 p-4 text-sm font-mono">
{`POST /activity/event   ──► row inserted
                       ──► publish to
                           /stream/page/{PageItemId}

event: activity
id: 12345
data: { "Results": [{ ActivityEventId: 12345, ... }] }`}
          </pre>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What subscribers MUST do</div>
          <ul className="space-y-3 text-base list-disc pl-6">
            <li>Treat the frame as a <strong>signal</strong>, not a payload to apply.</li>
            <li>Call <code>router.revalidate()</code> — let the loader re-read the (now-updated) mirror.</li>
            <li><strong>Never</strong> call <code>setState</code> or <code>queryClient.setQueryData</code> from the SSE callback.</li>
            <li><strong>Never</strong> enqueue a mutation in response to a frame — that creates a feedback loop.</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="text-xs uppercase tracking-wider text-destructive mb-2">Anti-pattern</div>
        <code className="text-sm text-destructive">
          sse.on('activity', (frame) =&gt; queryClient.setQueryData(['activity', pageId], …))
        </code>
        <p className="text-sm text-muted-foreground mt-2">
          Bypasses the mirror. UI shows data not present in IDB. Cold reload
          loses the row. Forbidden by <code>G-34-UI-SSE-INVALIDATE-ONLY</code>.
        </p>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-CP-SSE-READ-ONLY</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-UI-SSE-INVALIDATE-ONLY</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">ADR-0025</span>
      </div>
    </SlideLayout>
  );
}
