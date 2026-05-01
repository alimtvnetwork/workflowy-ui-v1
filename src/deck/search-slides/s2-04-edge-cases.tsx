import { SlideLayout } from "../SlideLayout";

const EDGES: Array<[string, string]> = [
  ["Title exact + 100 note substrings", "Title-exact item ranks first (effective score 150) regardless of recency."],
  ["Two items, identical scores", "UpdatedAt desc; further tied → OwnerId asc."],
  ["Mirror peer-group, 5 instances all match", "All 5 returned, each ranked independently. User picks via breadcrumb."],
  ["Empty query", "No results. Do NOT fall back to 'all items by recency'."],
  ["Filter-only query (is:todo, no terms)", "Score = 60 for all matches (all-terms-present bucket); sort by recency."],
  ["Trashed / completed items", "Excluded by default. Surfaced only when query opts in via is:trashed / is:complete."],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-2 · Ranking" title="Edge cases the ranker handles by spec"
      subtitle="Each row has an explicit AT- test. None are 'undefined behaviour'.">
      <div className="mt-6 grid grid-cols-2 gap-4">
        {EDGES.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border p-5 bg-card">
            <div className="text-sm font-medium text-foreground mb-2">{k}</div>
            <div className="text-sm text-muted-foreground">{v}</div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}
