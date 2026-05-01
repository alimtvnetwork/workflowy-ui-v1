import { SlideLayout } from "../SlideLayout";

const ROWS: Array<[string, string, string]> = [
  ["AT-APP-TSNAP-01", "Immutability",         "Source edits do not alter saved templates"],
  ["AT-APP-TSNAP-02", "Mirror flattening",    "Peer-group identity does not survive serialisation"],
  ["AT-APP-TSNAP-03", "Trash exclusion",      "Trashed nodes (and subtree) are dropped from snapshot"],
  ["AT-APP-TSNAP-04", "Size cap",             "> 10 000 nodes → ERR_TEMPLATE_TOO_LARGE 413"],
  ["AT-APP-TSNAP-05", "ItemType immutability","Source ItemType change after save is invisible to template"],
  ["AT-TPL-01",       "Re-stamped UUIDs",     "5 source nodes → 5 fresh UUIDs under target parent"],
  ["AT-TPL-02",       "Template→instance ⊥",  "Edits to template payload do not propagate to instances"],
  ["AT-TPL-03",       "Instance→template ⊥",  "Edits to instance do not propagate to template"],
  ["AT-TPL-04",       "Mirror collapse",      "Mirrors in template instantiate as plain items"],
  ["AT-TPL-05",       "Owner = instantiator", "New rows owned by auth.uid(), not template author"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-4 · Acceptance" title="Ten acceptance tests close out templates end-to-end"
      subtitle="Every test maps to a button or counter in /template-sim. Click into the sim to step through them.">
      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-base">
          <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left w-[180px]">AT</th>
              <th className="px-4 py-2 text-left w-[200px]">Name</th>
              <th className="px-4 py-2 text-left">What it asserts</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([id, name, desc]) => (
              <tr key={id} className="border-t border-border">
                <td className="px-4 py-2.5 font-mono text-primary">{id}</td>
                <td className="px-4 py-2.5">{name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideLayout>
  );
}
