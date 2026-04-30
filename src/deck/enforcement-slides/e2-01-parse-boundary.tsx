import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-2 · Runtime" title="R1 — Parse at every boundary"
      subtitle="Compile-time generics only protect in-process types. Anything crossing a trust boundary must be parsed.">
      <div className="mt-6 grid grid-cols-5 gap-3 text-center text-sm">
        {["B1 · HTTP fetch","B2 · IndexedDB","B3 · SSE / WebSocket","B4 · Loader params","B5 · Worker postMessage"].map((b)=>(
          <div key={b} className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="text-foreground font-medium">{b}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-8">
        <Code label="Forbidden — `as` cast at boundary" tone="bad">{`const user = (await res.json()) as User;`}</Code>
        <Code label="Required — Zod parse at boundary" tone="good">{`const env = EnvelopeSchema(UserSchema)
  .parse(await res.json());
const user = env.Results[0];`}</Code>
      </div>
      <Footer gate="G-35-RV-PARSE-AT-BOUNDARY" at="AT-ENFORCEMENTRULES-05"
        rule="Every value sourced from B1–B5 passes through a Zod (TS) or Symfony Validator (PHP) parse before any field access." />
    </SlideLayout>
  );
}
