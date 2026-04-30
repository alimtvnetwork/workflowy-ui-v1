import { SlideLayout } from "../SlideLayout";
import { Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-3 · ESLint" title="RuleTester coverage & severity policy"
      subtitle="≥3 valid + ≥3 invalid cases per rule. `messageId` assertions only. Ship at `error` or graduate.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">RuleTester contract</div>
          <pre className="font-mono text-sm bg-muted/30 rounded p-3">{`new RuleTester().run('no-any', rule, {
  valid: [ /* ≥3 cases */ ],
  invalid: [
    { code: '…',
      errors: [{ messageId: 'noAny' }] },
    /* ≥2 more */
  ],
});`}</pre>
          <p className="mt-3 text-sm text-muted-foreground">String-match assertions on <code>.message</code> are forbidden — brittle to copy edits.</p>
          <div className="mt-3 text-xs font-mono text-primary">G-35-EL-RULE-TESTER · AT-12</div>
        </div>
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Severity policy</div>
          <ul className="space-y-2 text-base text-foreground">
            <li>• Default ship severity: <code className="text-primary">error</code></li>
            <li>• <code>warn</code> only with a graduation date in the ledger</li>
            <li>• <code>off</code> in committed config: <span className="text-destructive">forbidden</span></li>
            <li>• Permanent <code>warn</code> &gt; 14 days: must promote or remove</li>
          </ul>
          <div className="mt-3 text-xs font-mono text-primary">G-35-EL-NO-OFF · G-35-BE-PROMOTE-OR-REMOVE</div>
        </div>
      </div>
      <Footer gate="G-35-EL-RULE-TESTER" at="AT-ENFORCEMENTRULES-12"
        rule="Every rule has ≥3 valid + ≥3 invalid cases via RuleTester, asserting exact `messageId`. Default severity is `error`." />
    </SlideLayout>
  );
}
