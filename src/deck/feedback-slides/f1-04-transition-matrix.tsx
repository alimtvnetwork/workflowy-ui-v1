import { SlideLayout } from "../SlideLayout";

const STATUSES = ["New", "Triaged", "InProgress", "Resolved", "WontFix", "Duplicate"] as const;
type Status = typeof STATUSES[number];
const ALLOWED: Record<Status, ReadonlyArray<Status>> = {
  New: ["Triaged", "InProgress", "WontFix", "Duplicate"],
  Triaged: ["InProgress", "Resolved", "WontFix", "Duplicate"],
  InProgress: ["Resolved", "WontFix", "Duplicate"],
  Resolved: [], WontFix: [], Duplicate: [],
};

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-1 · Storage" title="Transition matrix is a `Record`, not a switch"
      subtitle="ALLOWED_TRANSITIONS lives in 01-data-model.md. Both client and server import it; nobody owns a copy.">
      <div className="mt-6 grid grid-cols-[1.2fr_1fr] gap-8 items-start">
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-3 py-2 text-left text-muted-foreground">From ↓ / To →</th>
                {STATUSES.map((s) => <th key={s} className="px-3 py-2 text-center font-mono text-xs">{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {STATUSES.map((from) => (
                <tr key={from} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{from}</td>
                  {STATUSES.map((to) => {
                    if (from === to) return <td key={to} className="px-3 py-2 text-center text-muted-foreground">—</td>;
                    const ok = ALLOWED[from].includes(to);
                    return <td key={to} className={`px-3 py-2 text-center text-lg ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/40"}`}>{ok ? "✓" : "·"}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <pre className="rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed">
{`export const ALLOWED_TRANSITIONS:
  Readonly<Record<FeedbackStatus,
    ReadonlyArray<FeedbackStatus>>> = {
  New:        ['Triaged','InProgress',
               'WontFix','Duplicate'],
  Triaged:    ['InProgress','Resolved',
               'WontFix','Duplicate'],
  InProgress: ['Resolved','WontFix',
               'Duplicate'],
  Resolved:   [],
  WontFix:    [],
  Duplicate:  [],
} as const;`}
        </pre>
      </div>
      <div className="mt-6 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-TERMINAL-IMMUTABLE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-DM-TRANSITION-SSOT</span>
        <span className="px-2 py-1 rounded bg-muted text-muted-foreground font-mono">AT-FEEDBACKREPORT-11</span>
      </div>
    </SlideLayout>
  );
}
