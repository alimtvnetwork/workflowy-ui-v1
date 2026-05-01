import { SlideLayout } from "../SlideLayout";

const INV = [
  ["I-SR-01", "Determinism", "Same query + same DB snapshot → byte-identical order. Forever. Tested on every release."],
  ["I-SR-02", "Relevance dominates recency across buckets", "A score-100 item from last year ranks above a score-20 item edited 5 s ago."],
  ["I-SR-03", "Recency wins inside a bucket", "No secondary lexical sort. UpdatedAt desc, then OwnerId asc."],
  ["I-SR-04", "Viewport cap = 250", "Result count beyond 250 is reported but not rendered. The 251st row never reaches the DOM."],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-2 · Ranking" title="Four invariants the ranker MUST satisfy"
      subtitle="These are not optimizations. They are correctness properties. Violating any one is a P0.">
      <div className="mt-6 space-y-4">
        {INV.map(([id, title, body]) => (
          <div key={id} className="rounded-xl border border-border p-5 bg-card">
            <div className="flex items-baseline gap-4">
              <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-xs">{id}</span>
              <span className="text-xl font-medium">{title}</span>
            </div>
            <p className="mt-2 text-base text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}
