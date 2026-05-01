import { SlideLayout } from "../SlideLayout";

export default function Closing() {
  return (
    <SlideLayout chapter="Closing" title="Three things to take with you"
      subtitle="The decision was simple. The simplicity is the feature.">
      <div className="mt-10 grid grid-cols-3 gap-6 text-xl">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">1</div>
          <p>
            <strong>No back-link in either direction.</strong> Templates store JSON; instances store rows. There is no <code>TemplateId</code> FK and there never will be in MVP.
          </p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">2</div>
          <p>
            <strong>Mirrors flatten on save.</strong> Peer-group identity is workspace-local; a template that left a workspace cannot bring the peer-group with it.
          </p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">3</div>
          <p>
            <strong>Owner = instantiator, always.</strong> Sharing a template is sharing a recipe, not a permission grant. Authors can't reach into instances after the fact.
          </p>
        </div>
      </div>
      <div className="mt-12 text-center text-2xl text-muted-foreground">
        Live impl: <code>/template-sim</code> · Spec: <code>spec/31-app/01-features/13b-templates-snapshot-semantics.md</code>
      </div>
    </SlideLayout>
  );
}
