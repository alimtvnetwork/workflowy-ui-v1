import { SlideLayout } from "../SlideLayout";

const STATES: Array<[string, string, string]> = [
  ["Empty",     "Q is empty (after trim)",                "Render <SearchRecent/> — last visited items"],
  ["Loading",   "Awaiting first byte from /search",       "<SearchSkeleton/> via shadcn Skeleton, 5 rows"],
  ["Empty result", "Server returns Hits = []",            "<SearchEmpty/> with zero-state hint + suggested op"],
  ["Error",     "Status === 'error'",                     "<SearchError/> renders Errors[0].Code + retry"],
  ["Capped",    "Result count > 250",                     "Render 250, footer: '+N more — refine your query'"],
  ["Stale",     "SSE frame arrived for shown row",        "Re-read local mirror, patch row in place — no refetch"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-3 · Surface" title="Six explicit states, no implicit limbo"
      subtitle="Every state has a component, a trigger, and a render rule. There is no 'just don't show anything' state.">
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-base">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left text-muted-foreground">State</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Trigger</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Render</th>
            </tr>
          </thead>
          <tbody>
            {STATES.map(([s, t, r]) => (
              <tr key={s} className="border-t border-border align-top">
                <td className="px-4 py-3 font-medium">{s}</td>
                <td className="px-4 py-3 text-muted-foreground">{t}</td>
                <td className="px-4 py-3 font-mono text-sm">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideLayout>
  );
}
