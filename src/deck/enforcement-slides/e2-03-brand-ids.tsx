import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-2 · Runtime" title="R3 — Branded IDs are Zod-branded"
      subtitle="The schema mints the brand at the parse boundary, so downstream code receives an already-branded value.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <Code label="Forbidden — raw string" tone="bad">{`const ItemSchema = z.object({
  Id: z.string(),
});`}</Code>
        <Code label="Required — branded mint" tone="good">{`const ItemSchema = z.object({
  Id: z.string().brand<'ItemId'>(),
});
// callers receive ItemId, not string`}</Code>
      </div>
      <Footer gate="G-35-RV-BRAND-IDS" at="AT-ENFORCEMENTRULES-07"
        rule="Every branded-ID field in any boundary schema uses `.brand<'ItemId'>()` (or matching brand) — raw `z.string()` for an ID field is forbidden." />
    </SlideLayout>
  );
}
