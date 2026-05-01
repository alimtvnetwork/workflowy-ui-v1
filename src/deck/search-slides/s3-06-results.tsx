import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-3 · Surface" title="Results — highlighting, snippets, sanitisation"
      subtitle="The server returns Snippet HTML with <mark> tags only. The FE sanitises with DOMPurify before insertion.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed overflow-x-auto">
{`type Hit = {
  Item:        Item;          // PascalCase per ADR-0004
  Score:       number;        // 0..150 (post field-weight)
  MatchKind:   "ExactWhole" | "ExactSubstring" | "AllInOrder"
              | "AllAnyOrder" | "Some";
  FieldWeight: 1.0 | 1.5;     // which field carried the match
  Snippet:     string;        // HTML with <mark> tags only
};

// FE pipeline:
const safe = DOMPurify.sanitize(hit.Snippet, {
  ALLOWED_TAGS: ["mark"],
  ALLOWED_ATTR: [],
});`}
      </pre>
      <div className="mt-6 grid grid-cols-2 gap-4 text-base">
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Server returns</div>
          <p>One snippet per hit, ≤ 240 chars, with at most 4 <code>&lt;mark&gt;</code> spans.</p>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Client guarantee</div>
          <p>The order returned by the server is rendered <strong>verbatim</strong>. No client-side re-sort. Ever.</p>
        </div>
      </div>
    </SlideLayout>
  );
}
