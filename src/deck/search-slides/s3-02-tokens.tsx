import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-3 · Surface" title="Token system — chips are first-class, free text is second-class"
      subtitle="Every parsed Token renders as a removable chip. Free text stays inline. The chip is the truth.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Chip lifecycle</div>
          <ol className="space-y-3 list-decimal pl-6 text-base">
            <li>User types <code>is:to</code> → suggestions appear in Region 3</li>
            <li>User picks <code>todo</code> or types <code>:todo </code> → token <strong>commits</strong> as a chip</li>
            <li>Chip is keyboard-focusable; ⌫ on focused chip removes it</li>
            <li>Click chip → opens its value picker (Region 4) for in-place edit</li>
          </ol>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Chip states</div>
          <ul className="space-y-3 text-base">
            <li><span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-xs">committed</span> — fully validated, contributes to query</li>
            <li><span className="px-2 py-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs">pre-commit</span> — typing in progress, not yet a chip</li>
            <li><span className="px-2 py-1 rounded bg-destructive/15 text-destructive font-mono text-xs">invalid</span> — value rejected (e.g. <code>date:abc</code>)</li>
            <li><span className="px-2 py-1 rounded bg-muted text-muted-foreground font-mono text-xs">negated</span> — leading <code>-</code>, rendered with strike</li>
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}
