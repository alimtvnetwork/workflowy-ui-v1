import { SlideLayout } from "../SlideLayout";
import { Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-3 · ESLint" title="Plugin layout & rule factory"
      subtitle="One file per rule. One test per rule. RuleCreator factory only.">
      <div className="mt-8 grid grid-cols-2 gap-8 text-base">
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Required layout</div>
          <pre className="font-mono text-sm bg-muted/30 rounded p-3">{`eslint-plugins/coding-guidelines/
├── src/
│   ├── index.ts          (exports all rules)
│   ├── rules/
│   │   └── no-any.ts     (one rule per file)
│   └── tests/
│       └── no-any.test.ts`}</pre>
          <div className="mt-3 text-xs font-mono text-primary">G-35-EL-PLUGIN-LAYOUT</div>
        </div>
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Required factory</div>
          <pre className="font-mono text-sm bg-muted/30 rounded p-3">{`const createRule = ESLintUtils
  .RuleCreator(getDocsUrl);

export default createRule({
  name: 'no-any',
  meta: {
    docs: { description:
      'Forbid bare any in public sigs' }
  },
  // …
});`}</pre>
          <div className="mt-3 text-xs font-mono text-primary">G-35-EL-USE-CREATOR · G-35-EL-MEANINGFUL-DOCS</div>
        </div>
      </div>
      <Footer gate="G-35-EL-PLUGIN-LAYOUT" at="AT-ENFORCEMENTRULES-09"
        rule="Every custom rule lives at `eslint-plugins/coding-guidelines/src/rules/<name>.ts` with a matching `tests/<name>.test.ts`, exported from `index.ts`." />
    </SlideLayout>
  );
}
