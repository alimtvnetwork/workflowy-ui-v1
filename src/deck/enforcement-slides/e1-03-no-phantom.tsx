import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-1 · Generics" title="R3 — Generics must be inferable or explicit"
      subtitle="A generic the caller can't supply silently widens to `unknown`. Phantom generics are forbidden.">
      <div className="mt-8 grid grid-cols-3 gap-6">
        <Code label="Phantom — forbidden" tone="bad">{`export function fetch<T>(): Promise<T>`}</Code>
        <Code label="Inferable from arg" tone="good">{`export function fetch<T>(
  schema: ZodSchema<T>
): Promise<T>`}</Code>
        <Code label="Explicit-only via default" tone="good">{`export function fetch<T = never>(
  url: string
): Promise<T>
// callsite: fetch<UserDto>('/me')`}</Code>
      </div>
      <Footer gate="G-35-RT-NO-PHANTOM" at="AT-ENFORCEMENTRULES-03"
        rule="Every generic parameter is inferable from an argument OR defaults to `never` (forcing explicit annotation)." />
    </SlideLayout>
  );
}
