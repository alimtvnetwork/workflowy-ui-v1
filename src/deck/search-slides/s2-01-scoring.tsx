import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-2 · Ranking" title="Score = max field-score across { Content, Note }"
      subtitle="Match-kind tiers are exact integers. Field weights are constants. There is no learned model.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-6 text-base font-mono leading-relaxed text-foreground overflow-x-auto">
{`Field score by match kind (highest wins):
  Exact phrase, whole field    → 100
  Exact phrase, substring      →  80
  All terms present, in order  →  60
  All terms present, any order →  40
  Some terms present (≥1)      →  20

Field weight multiplier:
  Content match  × 1.5
  Note    match  × 1.0

Score = max(scoreFor(Content) × 1.5, scoreFor(Note) × 1.0)`}
      </pre>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">Hybrid: relevance then recency</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">No BM25 in MVP</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">Content × 1.5 (titles win)</span>
      </div>
    </SlideLayout>
  );
}
