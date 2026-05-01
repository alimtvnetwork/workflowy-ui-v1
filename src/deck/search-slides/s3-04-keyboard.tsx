import { SlideLayout } from "../SlideLayout";

const ROWS: Array<[string, string]> = [
  ["⌘/Ctrl + K", "Open the popover from anywhere"],
  ["Esc", "Close the popover, restore previous focus"],
  ["↑ / ↓", "Cycle search-results rows"],
  ["⏎", "Open selected result in current zoom"],
  ["⌘ + ⏎", "Open selected result in a new zoom"],
  ["Tab", "Complete the current key suggestion"],
  ["⌫ (in chip)", "Remove the focused chip"],
  ["⌫ (chip-adjacent)", "Move focus into nearest chip"],
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-3 · Surface" title="Keyboard shortcuts — the popover is fully driveable without a mouse"
      subtitle="Eight bindings. They live in src/lib/hotkeys.ts and ship with the popover, not the page.">
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-base">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left text-muted-foreground w-56">Binding</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([k, v]) => (
              <tr key={k} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-sm">{k}</td>
                <td className="px-4 py-3">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-INTERACT-10</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-INTERACT-11</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-INTERACT-13</span>
      </div>
    </SlideLayout>
  );
}
