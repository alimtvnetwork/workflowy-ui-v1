import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-8 · Search" title="Operator parser" subtitle="Users type `is:task tag:#urgent due:<7d foo bar`. The parser splits this into structured filters + an FTS query — never concatenated raw into SQL.">
      <SqlBlock caption="Parser is a hand-rolled tokenizer (no regex backtracking). Unknown operators fall through to free-text. Output goes to a builder that emits parameterized SQL.">{`type Filter =
  | { kind: "type"; value: "task"|"note"|"list" }
  | { kind: "tag"; value: string }
  | { kind: "due"; op: "<"|">"|"="; days: number }
  | { kind: "completed"; value: boolean }
  | { kind: "text"; value: string };

const OPS = new Set(["is", "tag", "due", "completed", "in"]);

export function parseQuery(input: string): Filter[] {
  const out: Filter[] = [];
  for (const tok of tokenize(input)) {
    const m = tok.match(/^(\\w+):(.+)$/);
    if (!m || !OPS.has(m[1])) { out.push({ kind: "text", value: tok }); continue; }
    const [, k, v] = m;
    switch (k) {
      case "is":        out.push({ kind: "type",      value: v as any }); break;
      case "tag":       out.push({ kind: "tag",       value: v.replace(/^#/, "") }); break;
      case "completed": out.push({ kind: "completed", value: v === "true" }); break;
      case "due": {
        const dm = v.match(/^([<>=])(\\d+)d$/);
        if (dm) out.push({ kind: "due", op: dm[1] as any, days: +dm[2] });
        break;
      }
    }
  }
  return out;
}

// Builder — every filter binds parameters; FTS text goes through escapeFts().
export function buildSql(filters: Filter[]) {
  const where: string[] = [], params: any[] = [];
  const text = filters.filter(f => f.kind === "text").map((f: any) => f.value).join(" ");
  if (text) { where.push("items_fts MATCH ?"); params.push(escapeFts(text)); }
  for (const f of filters) {
    if (f.kind === "tag")  { where.push("EXISTS(SELECT 1 FROM item_tags it JOIN tags t ON t.id=it.tagId WHERE it.itemId=i.id AND t.name=?)"); params.push(f.value); }
    if (f.kind === "type") { where.push("i.itemTypeId = (SELECT id FROM item_types WHERE name=?)"); params.push(f.value); }
    if (f.kind === "due")  { where.push(\`i.dueDate \${f.op} ?\`); params.push(isoPlusDays(f.days)); }
    if (f.kind === "completed") { where.push(f.value ? "i.completedAt IS NOT NULL" : "i.completedAt IS NULL"); }
  }
  return { where: where.join(" AND "), params };
}`}</SqlBlock>
    </SlideLayout>
  );
}
