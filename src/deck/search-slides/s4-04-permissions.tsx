import { SlideLayout } from "../SlideLayout";

const ROWS: Array<[string, string]> = [
  ["Visibility", "Hit appears only if caller has ≥ read on the Item. Server-side filter; never client-side."],
  ["Scope-restricted query", "If Scope is supplied and caller lacks read → ERR_FORBIDDEN. No partial result."],
  ["Cross-workspace fan-out", "Limited to App DBs in the caller's WorkspaceMember rows. Foreign workspaces silently skipped (no error)."],
  ["Trashed-item access", "IncludeTrashed=true only surfaces trash items the caller could see when they were live."],
  ["Mirror-instance permission", "Each peer-group instance is permission-checked independently — peer set may appear smaller than its true size."],
  ["Notes (Items.Note)", "Inherit the parent item's permission. No separate ACL on notes."],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-4 · Backend" title="Permissions — six rules, all enforced server-side"
      subtitle="Search never trusts the client to filter. The visibility predicate runs inside the SQL, not in PHP, not in JS.">
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-base">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left text-muted-foreground w-64">Capability</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Rule</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([k, v]) => (
              <tr key={k} className="border-t border-border align-top">
                <td className="px-4 py-3 font-medium">{k}</td>
                <td className="px-4 py-3 text-muted-foreground">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideLayout>
  );
}
