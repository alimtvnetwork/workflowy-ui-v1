import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-4 · Boundaries" title="Putting it together — the four-layer pipeline"
      subtitle="Each layer catches a class of error the layer before it cannot.">
      <div className="mt-8 grid grid-cols-4 gap-4">
        <Layer n="1" name="Compile" what="tsconfig strict, generic rules" catches="any, unknown, phantom generics, brand erasure" gates="G-35-RT-*" />
        <Layer n="2" name="Lint" what="custom ESLint plugin (RuleCreator)" catches="naming, registration, severity drift, chokepoint imports" gates="G-35-EL-* · G-35-BE-*" />
        <Layer n="3" name="Runtime" what="Zod boundary schemas" catches="API drift, untrusted shape, ID brand minting" gates="G-35-RV-*" />
        <Layer n="4" name="Test" what="type-tests + RuleTester" catches="generic regressions, rule false-negatives" gates="G-35-EL-RULE-TESTER" />
      </div>
      <div className="mt-10 rounded-lg border border-border p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">CI wiring</div>
        <pre className="font-mono text-sm bg-muted/30 rounded p-3 leading-relaxed">{`# .github/workflows/ci.yml — all four layers run on every PR
- run: tsc --noEmit                                         # layer 1
- run: eslint . --max-warnings 0                            # layer 2
- run: vitest run --coverage                                # layer 3 + 4
- run: node scripts/spec-hygiene/00-run-all.mjs             # AT bind audit`}</pre>
      </div>
    </SlideLayout>
  );
}

function Layer({ n, name, what, catches, gates }: { n: string; name: string; what: string; catches: string; gates: string }) {
  return (
    <div className="border border-border rounded-lg p-5">
      <div className="text-5xl font-semibold text-primary tabular-nums">{n}</div>
      <div className="mt-1 text-xl font-semibold text-foreground">{name}</div>
      <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">What</div>
      <div className="text-sm text-foreground">{what}</div>
      <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Catches</div>
      <div className="text-sm text-foreground">{catches}</div>
      <div className="mt-3 text-[10px] font-mono text-primary">{gates}</div>
    </div>
  );
}
