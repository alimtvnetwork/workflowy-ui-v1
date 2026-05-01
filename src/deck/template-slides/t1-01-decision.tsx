import { SlideLayout } from "../SlideLayout";

const ROWS: Array<[string, string]> = [
  ["Storage form",                 "Templates.PayloadJson — full subtree, JSON-serialised"],
  ["Instance link to template",    "None (no TemplateId FK on Items)"],
  ["Edits to template propagate?", "No"],
  ["Edits to instance propagate?", "No"],
  ["Mirror peer-group preserved?", "No (instances are independent rows)"],
  ["Owner of instantiated rows",   "auth.uid() of instantiator — regardless of author"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-1 · Decision" title="Templates are snapshot copies — a one-shot stamp"
      subtitle="The decision table from spec §1. Six lines that close out every future ambiguity request.">
      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-xl">
          <tbody>
            {ROWS.map(([k, v]) => (
              <tr key={k} className="border-t border-border first:border-t-0">
                <td className="px-6 py-4 w-[40%] text-muted-foreground">{k}</td>
                <td className="px-6 py-4 font-mono text-foreground">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">No back-link in either direction</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">Owner = instantiator (always)</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">Mirrors flatten on save</span>
      </div>
    </SlideLayout>
  );
}
