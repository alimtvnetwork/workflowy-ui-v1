import { SlideLayout } from "../SlideLayout";
import { MockWindow } from "../components/MockUI";

const sections = [
  {
    label: "Recent",
    items: [{ text: "Q3 Roadmap", path: "Home › Work" }],
  },
  {
    label: "Items",
    items: [
      { text: "Ship onboarding v2", path: "Q3 Roadmap", active: true },
      { text: "Q3 Hiring plan", path: "Work" },
    ],
  },
  { label: "Tags", items: [{ text: "#q3-planning", path: "12 items" }] },
  {
    label: "Commands",
    items: [
      { text: "＋ New item in Inbox", path: "⌘⇧N" },
      { text: "☾ Toggle theme", path: "" },
    ],
  },
];

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 7 · Search" title="Command palette + content search" subtitle="One popover. Press ⌘K from anywhere.">
      <MockWindow className="mx-auto max-w-[820px]">
        <div className="bg-background">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <span className="text-muted-foreground">🔍</span>
            <span className="text-lg text-foreground">
              q3 roa<span className="inline-block w-0.5 h-5 bg-primary align-middle animate-pulse ml-0.5" />
            </span>
          </div>
          <div className="max-h-[480px] overflow-hidden">
            {sections.map((s) => (
              <div key={s.label}>
                <div className="px-5 py-1.5 text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                  {s.label}
                </div>
                {s.items.map((it, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-5 py-2.5 text-sm ${
                      "active" in it && it.active ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-foreground">{it.text}</span>
                    <span className="text-xs text-muted-foreground font-mono">{it.path}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-border px-5 py-2 text-xs text-muted-foreground">
            ↑/↓ navigate · ⏎ open · ⌘⏎ open in new zoom · Esc close
          </div>
        </div>
      </MockWindow>
    </SlideLayout>
  );
}
