import { SlideLayout } from "../SlideLayout";

const ROWS: Array<[string, string, string]> = [
  ["Date", "date · date-before · date-after · day-of-week", "YYYY-MM-DD or enum"],
  ["Date shortcuts", "today · tomorrow · yesterday · this/next/last-week · this/next/last-month", "Standalone, local TZ"],
  ["History", "changed · created", "Date or shortcut"],
  ["State", "is:", "todo · complete · starred · shared · mirror · template · heading"],
  ["Metadata", "has:", "note · date · file · image · video · tweet · link · comment · highlight"],
  ["Scope", "in:", "Node ID — UNION across multiple in:"],
  ["Text", "text: · link:", "Quoted phrase or substring"],
  ["Highlight", "highlight:", "1 of 11 named colours"],
  ["People", "@handle · me · others", "Mentions, current user, anyone-but-me"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-1 · Grammar" title="Every keyword in one table"
      subtitle="A 9-row reference. Anything not in this table parses as FreeText.">
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-base">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left text-muted-foreground w-40">Family</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Tokens</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Value format</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([fam, tok, val]) => (
              <tr key={fam} className="border-t border-border align-top">
                <td className="px-4 py-3 font-medium">{fam}</td>
                <td className="px-4 py-3 font-mono text-sm">{tok}</td>
                <td className="px-4 py-3 text-muted-foreground">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideLayout>
  );
}
