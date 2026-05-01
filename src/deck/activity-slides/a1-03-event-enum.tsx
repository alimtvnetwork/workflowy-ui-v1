import { SlideLayout } from "../SlideLayout";

const ROWS: [string, string, string][] = [
  ["ItemCreated",          "new node added",            "✅"],
  ["ItemUpdated",          "Content/ItemType changed",  "✅"],
  ["ItemMoved",            "ParentId changed",          "✅"],
  ["ItemDeleted",          "moved to trash",            "✅ (within 30d)"],
  ["ItemRestored",         "recovered from trash",      "✅"],
  ["ItemMirrored",         "mirror instance created",   "✅"],
  ["BoardColumnReordered", "board column drag",         "✅"],
  ["TemplateApplied",      "template instantiated",     "⚠️ partial"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-1 · Schema" title="EventType — closed list of exactly 8"
      subtitle="Adding a 9th value requires four edits in one PR: taxonomy table, payload schema, AT row, and SQLite CHECK constraint.">
      <table className="mt-6 w-full text-base border border-border rounded-lg overflow-hidden">
        <thead className="bg-muted/30">
          <tr>
            <th className="text-left px-4 py-2 font-medium">EventType</th>
            <th className="text-left px-4 py-2 font-medium">Trigger</th>
            <th className="text-left px-4 py-2 font-medium">Reversible</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([t, trig, rev]) => (
            <tr key={t} className="border-t border-border">
              <td className="px-4 py-2 font-mono text-primary">{t}</td>
              <td className="px-4 py-2 text-muted-foreground">{trig}</td>
              <td className="px-4 py-2">{rev}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-ES-CLOSED-ENUM</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-03</span>
      </div>
    </SlideLayout>
  );
}
