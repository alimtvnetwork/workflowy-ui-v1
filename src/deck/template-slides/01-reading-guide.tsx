import { SlideLayout } from "../SlideLayout";

export default function Guide() {
  return (
    <SlideLayout chapter="Reading guide" title="Why this deck exists"
      subtitle="Templates look obvious. Done wrong they leak edits backwards, resurrect mirrors that should not survive, or hand new owners somebody else's permissions.">
      <div className="mt-8 grid grid-cols-2 gap-8 text-xl">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What this deck covers</div>
          <ul className="space-y-3 list-disc pl-6">
            <li>The one-shot stamp decision — and why no <code>TemplateId</code> FK exists</li>
            <li>The snapshot algorithm: DFS clone, mirror flatten, trash exclusion, 10k cap</li>
            <li>The apply algorithm: fresh UUIDs, ownership rewrite, append position</li>
            <li>Five depth-coverage edges (TSNAP-01..05) and their failure modes</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What this deck explicitly forbids</div>
          <ul className="space-y-3 list-disc pl-6">
            <li>Live templates — propagating edits in either direction</li>
            <li>Parameter substitution (<code>{`{{date}}`}</code>, <code>{`{{user}}`}</code>) in MVP</li>
            <li>Template versioning — every save is a new row</li>
            <li>Mirror peer-groups surviving instantiation</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-base text-muted-foreground">
        Live reference impl at <code>/template-sim</code> · same DFS, same fresh UUIDs, same divergence proof.
      </div>
    </SlideLayout>
  );
}
