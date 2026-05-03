import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockOutline } from "../components/MockUI";

const items = [
  { icon: "🔠", label: "Heading 1 / 2 / 3", hint: "/h1" },
  { icon: "☐", label: "Task", hint: "/task" },
  { icon: "📋", label: "Note", hint: "/note" },
  { icon: "▣", label: "Board project", hint: "/board" },
  { icon: "📅", label: "Date / due", hint: "/date" },
  { icon: "<>", label: "Code block", hint: "/code" },
  { icon: "❝", label: "Quote", hint: "/quote" },
  { icon: "🔗", label: "Mention / link", hint: "/link" },
  { icon: "🪞", label: "Mirror of…", hint: "/mirror" },
  { icon: "📎", label: "Attachment", hint: "/file" },
];

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 4 · Slash menu" title="Type / to transform a row">
      <MockWindow className="mx-auto max-w-[1100px]">
        <div className="p-10 bg-background min-h-[520px] relative">
          <MockOutline
            rows={[
              {
                text: (
                  <span>
                    /<span className="inline-block w-0.5 h-5 bg-primary align-middle animate-pulse" />
                  </span>
                ),
              },
            ]}
          />
          {/* Slash menu popover */}
          <div className="mt-2 ml-12 w-[420px] rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              Insert
            </div>
            {items.map((it, i) => (
              <div
                key={it.label}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                  i === 0 ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="w-6 text-center">{it.icon}</span>
                <span className="flex-1">{it.label}</span>
                <span className="text-xs font-mono text-muted-foreground">{it.hint}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-base text-muted-foreground">Filter by typing: /h1, /code, /board…</p>
        </div>
      </MockWindow>
    </SlideLayout>
  );
}
