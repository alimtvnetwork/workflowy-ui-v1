import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout
      chapter="Chapter 1 · WorkFlowy in 60 seconds"
      title="One infinite outline, every node is the same thing"
      subtitle="Notes, tasks, projects, kanban cards — they're all just Items in a tree."
    >
      <div className="grid grid-cols-2 gap-10 mt-6">
        <div className="rounded-2xl border border-border bg-card p-10">
          <div className="text-3xl font-semibold mb-6">The big idea</div>
          <ul className="space-y-4 text-2xl text-muted-foreground">
            <li>• Everything is an <span className="text-foreground font-mono">Item</span>.</li>
            <li>• Items can have children → infinite nesting.</li>
            <li>• Click any bullet to "zoom in" — that node becomes the page.</li>
            <li>• An Item can <em>render</em> as a bullet, task, board, mirror, …</li>
            <li>• Same data model. Different views.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-muted/40 p-8">
          <pre className="font-mono text-xl leading-relaxed">{`Home
├─ • Personal
│   ├─ • Groceries
│   │   ├─ ☐ Milk
│   │   └─ ☐ Bread
│   └─ • Reading
│       └─ ☑ Atomic Habits
└─ • Work
    └─ ▣ Q3 Roadmap   ← rendered as Board
        ├─ Todo
        ├─ Doing
        └─ Done`}</pre>
        </div>
      </div>
    </SlideLayout>
  );
}
