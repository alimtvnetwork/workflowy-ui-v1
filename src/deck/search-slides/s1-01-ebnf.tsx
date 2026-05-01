import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-1 · Grammar" title="The grammar is closed and EBNF-defined"
      subtitle="Every parser and every test imports the same EBNF. There are no hidden operators.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`Query        := WS? Term (WS Term)* WS?
Term         := Negated | Token | FreeText
Negated      := "-" Token
Token        := KeyValue | Mention | Standalone
KeyValue     := Key ":" Value
Key          := "date" | "date-before" | "date-after" | "day-of-week"
              | "changed" | "created"
              | "is" | "has" | "in"
              | "text" | "link" | "highlight"
Mention      := "@" UserHandle
Standalone   := "me" | "others"
              | "today" | "tomorrow" | "yesterday"
              | "this-week" | "next-week" | "last-week"
              | "this-month" | "next-month" | "last-month"
Value        := QuotedString | UnquotedAtom`}
      </pre>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">Whitespace-separated</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">Case-insensitive keys</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">No explicit OR</span>
      </div>
    </SlideLayout>
  );
}
