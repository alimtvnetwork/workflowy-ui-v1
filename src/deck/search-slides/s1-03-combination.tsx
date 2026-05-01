import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-1 · Grammar" title="Combination semantics — AND by default, UNION only for `in:`"
      subtitle="Multi-token queries are AND. Negation binds to one token. `in:` is the only OR exception in the grammar.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-base">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left text-muted-foreground">Combination</th>
                <th className="px-4 py-3 text-left text-muted-foreground">Operator</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border"><td className="px-4 py-3">Distinct tokens</td><td className="px-4 py-3 font-mono">AND</td></tr>
              <tr className="border-t border-border"><td className="px-4 py-3">Multiple <code>in:</code></td><td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">UNION</td></tr>
              <tr className="border-t border-border"><td className="px-4 py-3"><code>-token</code></td><td className="px-4 py-3 font-mono">NOT (single token)</td></tr>
              <tr className="border-t border-border"><td className="px-4 py-3">Free text + tokens</td><td className="px-4 py-3 font-mono">AND substring</td></tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card text-lg">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Resolution rules</div>
          <ul className="space-y-3 list-disc pl-5">
            <li>Date shortcuts resolve in the user's local timezone</li>
            <li><code>in:</code> IDs that no longer exist are silently dropped — Region 3 hint</li>
            <li>Negation applies to the most recent token only</li>
            <li>A bare <code>-</code> is treated as free text</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 text-center text-xl text-muted-foreground">
        There is <strong>no explicit OR</strong> at launch.
      </div>
    </SlideLayout>
  );
}
