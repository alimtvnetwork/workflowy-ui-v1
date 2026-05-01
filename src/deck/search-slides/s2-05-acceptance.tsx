import { SlideLayout } from "../SlideLayout";

const ATS: Array<[string, string]> = [
  ["AT-SR-01", "Determinism: identical query + snapshot → identical order"],
  ["AT-SR-02", "Title-exact dominates 100-substring (relevance > recency)"],
  ["AT-SR-03", "Same-score recency tiebreak then OwnerId"],
  ["AT-SR-04", "Mirror peers rank independently with distinct breadcrumbs"],
  ["AT-SR-05", "Sub-300 ms response on ≥5 000-item datasets (perf SLA)"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-2 · Ranking" title="Five acceptance tests close out ranking correctness"
      subtitle="Each AT maps to a fixture in /search-sim's seed corpus. Click into the sim to step through them.">
      <div className="mt-8 space-y-4">
        {ATS.map(([id, body]) => (
          <div key={id} className="rounded-xl border border-border p-5 bg-card flex items-center gap-6">
            <span className="px-3 py-2 rounded bg-primary/15 text-primary font-mono">{id}</span>
            <span className="text-xl">{body}</span>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center text-base text-muted-foreground">
        Reference impl exercises all five at <code>/search-sim</code>.
      </div>
    </SlideLayout>
  );
}
