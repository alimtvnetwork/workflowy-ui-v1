import { SlideLayout } from "../SlideLayout";

export default function Guide() {
  return (
    <SlideLayout chapter="Reading guide" title="Why this deck exists" subtitle="Reviewer memory does not scale. Rules without gates rot.">
      <div className="mt-12 grid grid-cols-3 gap-6 text-base">
        <Card label="Audience" body="Tech leads, DevOps, anyone wiring CI. Frontend + backend devs needing to consume the rules." />
        <Card label="Scope" body="The four enforcement layers, the 14 acceptance rows behind them, and the gate IDs that fail CI." />
        <Card label="Source" body="spec/35-enforcement-rules/00-overview · 01-generic-return-types · 02-runtime-validation · 03-eslint-rule-authoring · 04-boundary-enforcement." />
      </div>
      <div className="mt-10 rounded-lg border border-border p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Definition of Done (from overview)</div>
        <ul className="text-lg text-foreground space-y-1.5">
          <li>— AT-ENFORCEMENTRULES-01..14 all pass</li>
          <li>— <code>rg -nP &quot;:\s*any\b|@ts-ignore&quot; src/</code> returns zero hits</li>
          <li>— All four layers (compile / lint / runtime / test) execute in CI</li>
          <li>— <code>node scripts/spec-hygiene/00-run-all.mjs</code> exits 0</li>
        </ul>
      </div>
    </SlideLayout>
  );
}

function Card({ label, body }: { label: string; body: string }) {
  return (
    <div className="border border-border rounded-lg p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      <div className="text-foreground">{body}</div>
    </div>
  );
}
