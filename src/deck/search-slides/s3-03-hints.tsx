import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-3 · Surface" title="Hints, value pickers, and the suggestion ladder"
      subtitle="Region 3 is a contextual ladder: empty → keyword catalogue, partial → narrowed list, picked-key → value picker.">
      <div className="mt-6 grid grid-cols-3 gap-5 text-base">
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Empty state</div>
          <ul className="space-y-2 list-disc pl-5">
            <li>Recent queries (≤ 5)</li>
            <li>Keyword catalogue grouped by family</li>
            <li>Mention shortcuts: <code>me</code>, <code>others</code></li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Typing a key</div>
          <ul className="space-y-2 list-disc pl-5">
            <li>Substring filter on key names</li>
            <li>Inline doc string per key</li>
            <li><code>Tab</code> completes; space commits</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Value picker (Region 4)</div>
          <ul className="space-y-2 list-disc pl-5">
            <li><code>is:</code> → enum list (7 values)</li>
            <li><code>has:</code> → enum list (9 values)</li>
            <li><code>date:</code> → date input + shortcuts</li>
            <li><code>highlight:</code> → 11-colour swatch</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-border p-5 bg-card text-base text-muted-foreground">
        Empty <code>is:</code> does <strong>not</strong> commit. The picker stays open until a value is chosen — keeps invalid chips out of the query.
      </div>
    </SlideLayout>
  );
}
