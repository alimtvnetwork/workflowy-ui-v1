import { SlideLayout } from "../SlideLayout";

const STAGES: [string, string, string, string][] = [
  ["1", "Intent",    "Action handler in src/features/<feature>/actions/*.ts",   "Typed ActivityIntent object"],
  ["2", "Capture",   "captureEvent.ts — THE chokepoint",                         "ActivityEvent draft (no Id)"],
  ["3", "Persist",   "IDB queue worker (sole egress per ADR-0023)",              "Mirror row + queued POST"],
  ["4", "Replay",    "Server REST POST /activity/event",                         "Row in SQLite ActivityEvent"],
  ["5", "Broadcast", "SSE emitter on /stream/page/{id} per ADR-0025",            "event: activity frame fanned out"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-2 · Capture" title="Exactly five stages — no more, no fewer"
      subtitle="Every ActivityEvent originates in one chokepoint. Stages 3–5 are only ever triggered by stage 2.">
      <table className="mt-6 w-full text-base border border-border rounded-lg overflow-hidden">
        <thead className="bg-muted/30">
          <tr>
            <th className="text-left px-3 py-2 w-12">#</th>
            <th className="text-left px-3 py-2 font-medium">Stage</th>
            <th className="text-left px-3 py-2 font-medium">Module</th>
            <th className="text-left px-3 py-2 font-medium">Output</th>
          </tr>
        </thead>
        <tbody>
          {STAGES.map(([n, s, m, o]) => (
            <tr key={n} className="border-t border-border">
              <td className="px-3 py-2 font-mono text-primary">{n}</td>
              <td className="px-3 py-2 font-medium">{s}</td>
              <td className="px-3 py-2 text-muted-foreground font-mono text-sm">{m}</td>
              <td className="px-3 py-2 text-muted-foreground">{o}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-CP-CHOKEPOINT</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-CP-NO-SKIP-CHOKEPOINT</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-01</span>
      </div>
    </SlideLayout>
  );
}
