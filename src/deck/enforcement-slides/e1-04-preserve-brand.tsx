import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-1 · Generics" title="R4 — Branded IDs cross every boundary"
      subtitle="Per ADR-0020, raw `string` IDs are forbidden. Generic helpers preserve the brand through the return type.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <Code label="Forbidden — strips the brand" tone="bad">{`export function parentOf(
  id: string
): string { … }`}</Code>
        <Code label="Required — preserves the brand" tone="good">{`export function parentOf<
  TId extends ItemId
>(id: TId): TId { … }`}</Code>
      </div>
      <Footer gate="G-35-RT-PRESERVE-BRAND" at="AT-ENFORCEMENTRULES-04"
        rule="Any helper that accepts a branded ID returns the same brand (or a generic that preserves it) — never widens to bare `string`." />
    </SlideLayout>
  );
}
