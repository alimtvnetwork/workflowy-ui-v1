import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-3 · Apply" title="Divergence proof — three buttons, one invariant"
      subtitle="The whole spec collapses to: after apply, the two sides are independent rows. The sim proves it interactively.">
      <div className="mt-8 grid grid-cols-3 gap-5 text-base">
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">1 · Edit template root</div>
          <p className="text-foreground">Mutates <code>Templates.PayloadJson</code> in place.</p>
          <p className="mt-3 text-muted-foreground">Already-applied instances do not change. Proves <strong>AT-TPL-02</strong>.</p>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">2 · Edit instance</div>
          <p className="text-foreground">Renames the first cloned row in the live items table.</p>
          <p className="mt-3 text-muted-foreground">Template payload remains byte-identical. Proves <strong>AT-TPL-03</strong>.</p>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">3 · Trash instance</div>
          <p className="text-foreground">Sets <code>TrashedAt</code> on the cloned row.</p>
          <p className="mt-3 text-muted-foreground">Reaper (spec 11b) treats it like any other item. Template untouched.</p>
        </div>
      </div>
      <div className="mt-8 text-center text-base text-muted-foreground">
        Walk this live at <code>/template-sim</code> · the activity log cites the AT id every time.
      </div>
    </SlideLayout>
  );
}
