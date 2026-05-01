import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-3 · Feed UI" title="Two routes, one named boundary"
      subtitle="Mounted under <ActivityBoundary> — one of the 8 named boundaries from ADR-0017. Cursor-decode failures don't tear down the app.">
      <table className="mt-6 w-full text-base border border-border rounded-lg overflow-hidden">
        <thead className="bg-muted/30">
          <tr>
            <th className="text-left px-3 py-2 font-medium">Route</th>
            <th className="text-left px-3 py-2 font-medium">Component</th>
            <th className="text-left px-3 py-2 font-medium">Loader</th>
            <th className="text-left px-3 py-2 font-medium">Boundary</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-border">
            <td className="px-3 py-2 font-mono">/page/:pageId/activity</td>
            <td className="px-3 py-2 font-mono">&lt;PageActivityFeed&gt;</td>
            <td className="px-3 py-2 font-mono text-sm text-muted-foreground">pageActivityLoader</td>
            <td className="px-3 py-2 font-mono">&lt;ActivityBoundary&gt;</td>
          </tr>
          <tr className="border-t border-border">
            <td className="px-3 py-2 font-mono">/me/activity</td>
            <td className="px-3 py-2 font-mono">&lt;UserActivityFeed&gt;</td>
            <td className="px-3 py-2 font-mono text-sm text-muted-foreground">userActivityLoader</td>
            <td className="px-3 py-2 font-mono">&lt;ActivityBoundary&gt;</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-6 text-base text-muted-foreground">
        Why a feed-scoped boundary? Because feed-specific errors —
        cursor-decode failures, payload-parse failures on a stale row, IDB
        version mismatch — should recover the feed surface, not blow away the
        editor. Wrapping in <code>&lt;AppErrorBoundary&gt;</code> directly is
        forbidden.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-UI-NAMED-BOUNDARY</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">ADR-0017 (8 boundaries)</span>
      </div>
    </SlideLayout>
  );
}
