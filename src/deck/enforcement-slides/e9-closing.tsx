import { SlideLayout } from "../SlideLayout";

export default function Closing() {
  return (
    <SlideLayout chapter="Closing" title="Three things to take with you"
      subtitle="Each enforcement rule traces to an AT row. Each AT row traces to a CI gate. No prose-only claims.">
      <div className="mt-12 space-y-6 text-2xl">
        <Item n="1" body="Rules without gates rot. Ship the gate the same day you ship the rule, or don't ship the rule." />
        <Item n="2" body="`any` and `unknown` aren't lazy — they're ungated promises. The compiler can't help you keep them." />
        <Item n="3" body="Parse at the boundary, mint the brand at the parse, throw a typed error on failure. Three lines, three layers." />
      </div>
      <div className="mt-16 text-xl text-muted-foreground">
        Cross-references: <code>spec/35-enforcement-rules/97-acceptance-criteria.md</code> ·
        <code className="ml-2">97a-acceptance-criteria-fixtures.md</code>
      </div>
    </SlideLayout>
  );
}

function Item({ n, body }: { n: string; body: string }) {
  return (
    <div className="flex items-start gap-6">
      <div className="text-5xl font-semibold text-primary tabular-nums w-16 shrink-0">{n}</div>
      <p className="text-foreground leading-snug pt-1">{body}</p>
    </div>
  );
}
