import { SlideLayout } from "../SlideLayout";

const ROWS: Array<[string, string, string]> = [
  ["Snapshot too large",          "NodeCount > 10 000 after walk",          "ERR_TEMPLATE_TOO_LARGE 413 — author splits source"],
  ["Source root not found",       "items[source_root_id] is missing",        "ERR_PARENT_NOT_FOUND 404 — no row inserted"],
  ["Source root is trashed",      "TrashedAt is set on the picked root",     "ERR_PARENT_NOT_FOUND 404 — root is invisible to snapshot"],
  ["ItemType change after save",  "Source ItemType edited later",            "Snapshot retains original — immutable (AT-APP-TSNAP-05)"],
  ["Source edited after save",    "Author renames a node in the source",     "Template payload unchanged (AT-APP-TSNAP-01)"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-2 · Snapshot" title="Edge cases at snapshot time"
      subtitle="Five precise behaviours. The first three reject; the last two prove immutability.">
      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-lg">
          <thead className="bg-muted/30 text-sm uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Edge</th>
              <th className="px-5 py-3 text-left">Trigger</th>
              <th className="px-5 py-3 text-left">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([edge, trig, out]) => (
              <tr key={edge} className="border-t border-border">
                <td className="px-5 py-4 font-medium">{edge}</td>
                <td className="px-5 py-4 font-mono text-sm text-muted-foreground">{trig}</td>
                <td className="px-5 py-4 text-foreground">{out}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center text-base text-muted-foreground">
        Click <code>Stamp snapshot</code> at <code>/template-sim</code> to step through each — error codes show in the activity log.
      </div>
    </SlideLayout>
  );
}
