import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  const rows: [string, string][] = [
    ["Enter", "New sibling below"],
    ["Shift+Enter", "Soft line break (within same item)"],
    ["Tab", "Indent (becomes child of previous sibling)"],
    ["Shift+Tab", "Outdent (becomes sibling of parent)"],
    ["⌘↑ / ⌘↓", "Move item up / down among siblings"],
    ["⌘⇧↑ / ⌘⇧↓", "Promote / demote across levels"],
    ["⌘.", "Toggle complete (task)"],
    ["⌘/", "Open ⋮ context menu on focused item"],
    ["⌘K", "Search popover"],
    ["⌘⇧N", "Quick Add to Inbox"],
    ["⌘← / ⌘→", "Zoom out / forward"],
    ["/", "Slash menu (insert H1-H5, code, quote, board, …)"],
  ];
  return (
    <SlideLayout chapter="Chapter 4 · Keyboard" title="The hotkeys you'll use every minute">
      <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-2xl">
        {rows.map(([k, d]) => (
          <div key={k} className="flex gap-5 items-baseline">
            <kbd className="px-3 py-1 rounded bg-muted border border-border font-mono text-lg min-w-[160px] text-center">
              {k}
            </kbd>
            <span className="text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}
