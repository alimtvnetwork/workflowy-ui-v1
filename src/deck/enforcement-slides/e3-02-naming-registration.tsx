import { SlideLayout } from "../SlideLayout";
import { Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-3 · ESLint" title="Naming & registration"
      subtitle="Rule names follow one of three patterns. Every rule is registered in three places before merge.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Allowed naming patterns</div>
          <ul className="space-y-2 font-mono text-base text-foreground">
            <li>• <span className="text-primary">no-*</span>          — forbid a thing</li>
            <li>• <span className="text-primary">require-*</span>     — require a thing</li>
            <li>• <span className="text-primary">prefer-*-over-*</span> — replacement</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">Forbidden: <code>enforce-foo</code>, <code>check-bar</code>, <code>lint-baz</code>.</p>
          <div className="mt-3 text-xs font-mono text-primary">G-35-EL-NAMING · AT-10</div>
        </div>
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Three required registrations</div>
          <ol className="space-y-2 text-base text-foreground">
            <li>1. Exported from <code>src/index.ts</code></li>
            <li>2. Enabled in flat-config <code>eslint.config.js</code></li>
            <li>3. Listed in the docs-URL map for <code>getDocsUrl()</code></li>
          </ol>
          <p className="mt-3 text-sm text-muted-foreground">A rule present in <code>src/rules/</code> but missing from any of the three blocks merge.</p>
          <div className="mt-3 text-xs font-mono text-primary">G-35-EL-FULL-REGISTRATION · AT-11</div>
        </div>
      </div>
      <Footer gate="G-35-EL-NAMING" at="AT-ENFORCEMENTRULES-10"
        rule="Every rule name matches `no-*`, `require-*`, or `prefer-*-over-*`. Every rule is registered in all three places (export, enable, docs map)." />
    </SlideLayout>
  );
}
