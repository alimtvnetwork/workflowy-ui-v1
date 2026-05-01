import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-2 · Snapshot" title="Trash exclusion — entire subtree, not just the marked node"
      subtitle="If a parent is trashed, its children never reach the payload. The reaper (spec 11b) and template snapshots agree on what 'live' means.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`Source:                                  Snapshot output:

Sprint                    (H1)           Sprint                    (H1)
├── Goals                  (H2)          ├── Goals                  (H2)
│   └── Ship beta          (Bullet)      │   └── Ship beta          (Bullet)
├── Old Tasks              (H2)          └── Tasks                  (H2)
│   ├── Done                            (TrashedAt set on parent)
│   └── Cancelled                       — entire subtree dropped, no recursion
└── Tasks                  (H2)
    └── Write spec         (Todo)
        └── Subtask (Trashed)             ↑ also dropped (Trace.ExcludedTrashed += [Subtask])`}
      </pre>
      <div className="mt-6 grid grid-cols-2 gap-4 text-base text-muted-foreground">
        <div className="rounded-lg border border-border p-4 bg-card">
          <strong className="text-foreground">Recorded in trace:</strong> every excluded id ends up in <code>Trace.ExcludedTrashed</code>. The UI surfaces the count so authors are not surprised.
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <strong className="text-foreground">Why subtree-wide:</strong> partial subtrees would resurrect orphans on apply. Treating <code>TrashedAt</code> as a hard boundary keeps the invariant simple.
        </div>
      </div>
    </SlideLayout>
  );
}
