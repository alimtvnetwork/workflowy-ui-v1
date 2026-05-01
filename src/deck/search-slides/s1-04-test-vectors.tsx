import { SlideLayout } from "../SlideLayout";

const VECS: Array<[string, string, string]> = [
  ["T1", "is:todo", "All todo items"],
  ["T2", "is:todo -is:complete", "Open todos"],
  ["T3", "@alice today", "Today's items mentioning alice"],
  ["T4", `text:"deep work" date-after:2026-04-01`, "Phrase match after Apr 1"],
  ["T5", "in:nodeA in:nodeB is:starred", "Starred items in (A ∪ B)"],
  ["T6", "has:image -has:video", "Image, no video"],
  ["T7", "me changed:this-week", "My recent changes"],
  ["T8", "day-of-week:weekend has:date", "Dated weekend items"],
  ["T9", "link:github.com", "Items with github.com links"],
  ["T10", "highlight:yellow text:standup", "Yellow standup mentions"],
  ["T11", "-@bob", "Items NOT mentioning bob"],
  ["T12", "meeting is:todo", "Todo items containing 'meeting'"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-1 · Grammar" title="12 test vectors are normative for the parser"
      subtitle="Both the WP plugin parser and the /search-sim parser pass this exact table.">
      <div className="mt-4 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-3 py-2 text-left text-muted-foreground w-12">#</th>
              <th className="px-3 py-2 text-left text-muted-foreground">Input</th>
              <th className="px-3 py-2 text-left text-muted-foreground">Expected semantics</th>
            </tr>
          </thead>
          <tbody>
            {VECS.map(([n, i, s]) => (
              <tr key={n} className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{n}</td>
                <td className="px-3 py-2 font-mono">{i}</td>
                <td className="px-3 py-2 text-muted-foreground">{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideLayout>
  );
}
