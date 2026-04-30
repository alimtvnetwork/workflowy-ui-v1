import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-2 · Runtime" title="R2 — Envelope schema is load-bearing"
      subtitle="Every B1 response parses through `EnvelopeSchema(rowSchema)` — never row-by-row directly.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <Code label="Forbidden — skips envelope" tone="bad">{`const item = ItemSchema.parse(
  json.Results[0]
);`}</Code>
        <Code label="Required — envelope first" tone="good">{`const env = EnvelopeSchema(ItemSchema)
  .parse(json);
// env.Status / .Attributes / .Results
// PascalCase per ADR-0004/0019`}</Code>
      </div>
      <div className="mt-8 rounded-lg border border-border p-5 text-base">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Why this rule exists</div>
        <p className="text-foreground">The envelope enforces the PascalCase contract (<code>Status</code>, <code>Attributes</code>, <code>Results</code>) and validates pagination + error shape <em>before</em> any field access. Bypassing it means downstream code accidentally trusts shape that never went through CI.</p>
      </div>
      <Footer gate="G-35-RV-USE-ENVELOPE" at="AT-ENFORCEMENTRULES-06"
        rule="Every B1 response parses through `EnvelopeSchema(rowSchema)` — direct row parse without envelope validation is forbidden." />
    </SlideLayout>
  );
}
