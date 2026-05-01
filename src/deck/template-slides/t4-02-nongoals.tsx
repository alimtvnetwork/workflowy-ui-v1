import { SlideLayout } from "../SlideLayout";

const ROWS: Array<[string, string, string]> = [
  ["Live templates",          "Edits propagate template ↔ instance",     "v2 — could be modelled as mirror peer-groups across templates"],
  ["Parameterised templates", "{{date}}, {{user}}, {{project_name}}",     "Future — needs a value-resolution pass at apply time"],
  ["Template versioning",     "Track history of PayloadJson edits",       "Future — every save is a new row today"],
  ["Cross-template mirrors",  "A node mirrored across two templates",     "Out of scope — mirrors are per-workspace by design"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-4 · Non-goals" title="Four things templates explicitly do not do"
      subtitle="Spec §4 fences these out. Adding any of them is a v2 conversation, not a bug fix.">
      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-lg">
          <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Non-goal</th>
              <th className="px-5 py-3 text-left">What people ask for</th>
              <th className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([k, ask, st]) => (
              <tr key={k} className="border-t border-border">
                <td className="px-5 py-3.5 font-medium">{k}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{ask}</td>
                <td className="px-5 py-3.5 font-mono text-sm text-foreground">{st}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-xl border border-border p-4 bg-card text-base text-muted-foreground">
        <strong className="text-foreground">Why fence these out:</strong> the snapshot model derives 100% of its simplicity from the no-link invariant. Any "live" variant collapses to the mirror peer-group problem (spec 09b) and inherits its full complexity surface — better to model it explicitly there.
      </div>
    </SlideLayout>
  );
}
