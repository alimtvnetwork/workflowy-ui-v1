import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-1 · Grammar" title="Parser-level error cases — silent fallback, never crash"
      subtitle="Invalid input is recoverable: the chip is rejected, the cursor stays in string mode, or it parses as FreeText.">
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-base">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left text-muted-foreground">Input</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Behaviour</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border"><td className="px-4 py-3 font-mono">date:abc</td><td className="px-4 py-3">Invalid value — chip rejected pre-commit</td></tr>
            <tr className="border-t border-border"><td className="px-4 py-3 font-mono">unknown:value</td><td className="px-4 py-3">Whole fragment treated as FreeText (silent fallback)</td></tr>
            <tr className="border-t border-border"><td className="px-4 py-3 font-mono">text:&quot;hello</td><td className="px-4 py-3">Token uncommitted — cursor inside string mode</td></tr>
            <tr className="border-t border-border"><td className="px-4 py-3 font-mono">is:</td><td className="px-4 py-3">Triggers value picker (Region 4); does NOT parse</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-8 rounded-xl border border-border p-6 bg-card text-lg">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Why the silent fallback?</div>
        <p>An overzealous parser turns "TODO: check meeting" into an error toast. The grammar is permissive at the input layer and strict only at the chip-commit layer.</p>
      </div>
    </SlideLayout>
  );
}
