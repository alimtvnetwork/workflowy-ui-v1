import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-1 · Generics" title="R1 — No bare `any` in any signature" subtitle="The compile-time backstop. Any leak from a public surface is a CI failure.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <Code label="Forbidden" tone="bad">{`export function load(id: any): any { … }`}</Code>
        <Code label="Required" tone="good">{`export function load<TItem extends Node>(
  id: ItemId
): TItem { … }`}</Code>
      </div>
      <Footer gate="G-35-RT-NO-ANY" at="AT-ENFORCEMENTRULES-01"
        rule="Every public function uses a branded or generic parameter type and a concrete or generic return — never `any`." />
    </SlideLayout>
  );
}

export function Code({ label, tone, children }: { label: string; tone: "good" | "bad"; children: string }) {
  const border = tone === "good" ? "border-primary/40" : "border-destructive/40";
  const eye = tone === "good" ? "text-primary" : "text-destructive";
  return (
    <div className={`rounded-lg border ${border} bg-muted/20 p-6`}>
      <div className={`text-xs uppercase tracking-wider mb-3 ${eye}`}>
        {tone === "good" ? "✓" : "✗"} {label}
      </div>
      <pre className="text-base leading-relaxed text-foreground whitespace-pre-wrap font-mono">{children}</pre>
    </div>
  );
}

export function Footer({ gate, at, rule }: { gate: string; at: string; rule: string }) {
  return (
    <div className="mt-10 rounded-lg border border-border p-5 flex items-start gap-6">
      <div className="shrink-0 grid grid-cols-1 gap-1 text-xs">
        <span className="px-2 py-0.5 rounded bg-primary/15 text-primary font-mono">{gate}</span>
        <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">{at}</span>
      </div>
      <p className="text-lg text-foreground">{rule}</p>
    </div>
  );
}
