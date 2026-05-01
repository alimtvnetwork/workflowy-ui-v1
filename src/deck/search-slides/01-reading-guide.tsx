import { SlideLayout } from "../SlideLayout";

export default function Guide() {
  return (
    <SlideLayout chapter="Reading guide" title="Why this deck exists"
      subtitle="Search looks like a text box. Done wrong it becomes inconsistent ordering, accidental data leaks, and a 30s spinner on 5k items.">
      <div className="mt-8 grid grid-cols-2 gap-8 text-xl">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What this deck covers</div>
          <ul className="space-y-3 list-disc pl-6">
            <li>The complete EBNF grammar — every operator, every value format</li>
            <li>The 5-bucket ranking algorithm and its determinism contract</li>
            <li>The popover surface, debounce contract, and 250-item viewport cap</li>
            <li>FTS5 schema, cross-workspace fan-out, and the 300 ms perf SLA</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What this deck explicitly forbids</div>
          <ul className="space-y-3 list-disc pl-6">
            <li>An explicit <code>OR</code> operator (only <code>in:</code> unions)</li>
            <li>Client-side re-ranking of server results</li>
            <li>Cross-workspace SQL joins — fan-out + merge in PHP only</li>
            <li>Falling back to "all items by recency" on an empty query</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-base text-muted-foreground">
        Live reference impl at <code>/search-sim</code> · same scoring, same buckets, same parser.
      </div>
    </SlideLayout>
  );
}
