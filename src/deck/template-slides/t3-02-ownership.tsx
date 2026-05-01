import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-3 · Apply" title="Ownership rewrite — author identity does not transfer"
      subtitle="Every new row's OwnerId = auth.uid() of the caller. Bob applying Alice's template gets Bob-owned rows. AT-TPL-05.">
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Template (author = alice)</div>
          <pre className="text-sm font-mono leading-relaxed">
{`Templates row:
  Id: t_0001
  Name: "Sprint Template"
  AuthorOwnerId: alice
  PayloadJson:
    Root → Sprint
      ├── Goals
      └── Tasks
        └── Write spec`}
          </pre>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Bob applies it under "Project Beta"</div>
          <pre className="text-sm font-mono leading-relaxed">
{`Items inserts:
  i_0014  ParentId=target  OwnerId=bob  Title="Sprint"
  i_0015  ParentId=i_0014  OwnerId=bob  Title="Goals"
  i_0016  ParentId=i_0014  OwnerId=bob  Title="Tasks"
  i_0017  ParentId=i_0016  OwnerId=bob  Title="Write spec"

  Author "alice" appears nowhere in the new rows.`}
          </pre>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-border p-4 bg-card text-base text-muted-foreground">
        <strong className="text-foreground">Consequence:</strong> sharing a template is sharing a recipe, not a permission grant. The instantiator owns the result and can edit, share, or trash it freely. Alice cannot reach into Bob's instance after the fact.
      </div>
    </SlideLayout>
  );
}
