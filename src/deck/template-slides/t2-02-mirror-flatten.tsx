import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-2 · Snapshot" title="Mirror flatten — the most consequential transform"
      subtitle="Three peers in the source become three plain nodes in the payload. Peer-group identity does NOT survive serialisation.">
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Source workspace</div>
          <pre className="text-sm font-mono leading-relaxed">
{`Sprint                    (H1)
├── Tasks                  (H2)
│   ├── Write spec         (Todo)        ◇ peer-group g1
│   └── Mirror of write    (Todo)        ◇ peer-group g1
└── Goals                  (H2)
    └── Mirror of write    (Todo)        ◇ peer-group g1`}
          </pre>
          <p className="text-xs mt-3 text-muted-foreground">
            Three rows, one peer-group. <code>g1</code> binds them as one logical bullet.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Snapshot payload</div>
          <pre className="text-sm font-mono leading-relaxed">
{`Sprint                    (H1)
├── Tasks                  (H2)
│   ├── Write spec         (Todo)        — plain
│   └── Write spec (copy)  (Todo)        — plain
└── Goals                  (H2)
    └── Write spec (copy)  (Todo)        — plain`}
          </pre>
          <p className="text-xs mt-3 text-muted-foreground">
            Three independent nodes. <code>PeerGroupId</code> is omitted from <code>SnapshotNode</code>.
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-border p-4 bg-card text-base text-muted-foreground">
        <strong className="text-foreground">Why:</strong> a template instantiated under a different parent has no business resurrecting peer-group identity from a different workspace. A user who wants synchronised mirrors creates them after applying. AT-TPL-04 / AT-APP-TSNAP-02 enforce this.
      </div>
    </SlideLayout>
  );
}
