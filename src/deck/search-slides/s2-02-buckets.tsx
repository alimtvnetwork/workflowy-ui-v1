import { SlideLayout } from "../SlideLayout";

const BUCKETS = [
  { range: "80–100", label: "Bucket 4–5", desc: "Exact phrase or title-exact match", color: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" },
  { range: "60–79",  label: "Bucket 3",   desc: "All terms present, in order",        color: "bg-sky-500/20 text-sky-700 dark:text-sky-300" },
  { range: "40–59",  label: "Bucket 2",   desc: "All terms present, any order",       color: "bg-amber-500/20 text-amber-700 dark:text-amber-300" },
  { range: "20–39",  label: "Bucket 1",   desc: "Some terms present (≥1)",            color: "bg-orange-500/20 text-orange-700 dark:text-orange-300" },
  { range: "0–19",   label: "Bucket 0",   desc: "Below threshold — typically excluded", color: "bg-muted text-muted-foreground" },
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-2 · Ranking" title="Five buckets, sorted by `UpdatedAt` inside each"
      subtitle="bucket = floor(Score / 20) clamped to [0, 5]. Final order = concat(buckets desc).">
      <div className="mt-6 space-y-3">
        {BUCKETS.map((b) => (
          <div key={b.range} className={`rounded-lg p-4 flex items-center gap-6 ${b.color}`}>
            <div className="font-mono text-lg w-24">{b.range}</div>
            <div className="font-medium w-32">{b.label}</div>
            <div className="flex-1 text-base">{b.desc}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-border p-5 bg-card text-base">
        <strong>Tiebreak inside a bucket:</strong> <code>UpdatedAt</code> desc, then <code>OwnerId</code> asc — fully deterministic.
      </div>
    </SlideLayout>
  );
}
