import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout
      chapter="Chapter 1 · Views over the same tree"
      title="One model, many faces"
      subtitle="Every screen in the app is just a different way to render Items."
    >
      <div className="grid grid-cols-3 gap-6 mt-4">
        {[
          { name: "Outline", body: "Default. Recursive bullets, indented." },
          { name: "Today", body: "Items where DueDate = today." },
          { name: "Calendar", body: "Items grouped by DueDate on a month grid." },
          { name: "Board", body: "Children of a BoardProject grouped into columns." },
          { name: "Dashboard", body: "Aggregated counts across the workspace." },
          { name: "Trash", body: "Items where DeletedAt IS NOT NULL." },
          { name: "Search", body: "Items matching a query, ranked." },
          { name: "Mirror", body: "Same Item shown in multiple places." },
          { name: "Right panel", body: "Handbook · Hotkeys · What's New." },
        ].map((v) => (
          <div key={v.name} className="rounded-xl border border-border bg-card p-6">
            <div className="text-2xl font-semibold">{v.name}</div>
            <p className="mt-2 text-lg text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-2xl text-muted-foreground">
        ⤷ Add a view = add a new query + renderer. The data never moves.
      </p>
    </SlideLayout>
  );
}
