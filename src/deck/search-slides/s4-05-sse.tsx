import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-4 · Backend" title="SSE & realtime — search emits nothing, consumes selectively"
      subtitle="Search is read-only. No frame on /stream/page or /stream/user. The overlay re-validates from the local mirror, never re-fetches.">
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What search NEVER does</div>
          <ul className="space-y-3 list-disc pl-5 text-base">
            <li>Emit any SSE frame on its own behalf</li>
            <li>Re-issue <code>GET /search</code> on every SSE frame</li>
            <li>Render rows that don't exist in the local mirror</li>
            <li>Bypass the loader to call the network directly</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What it DOES on item.updated / .deleted</div>
          <ul className="space-y-3 list-disc pl-5 text-base">
            <li>Re-read the impacted row from the local mirror</li>
            <li>Patch the row in place (snippet may stale until re-query)</li>
            <li>Hide the row if it was deleted</li>
            <li>Full re-query only when user re-submits</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center">
        <span className="px-3 py-2 rounded bg-primary/15 text-primary font-mono text-sm">G-25-SSE-ENDPOINT-CLOSED</span>
      </div>
    </SlideLayout>
  );
}
