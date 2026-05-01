import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-3 · Apply" title="Apply template — DFS clone with fresh UUIDs"
      subtitle="The mirror image of snapshot. Server-side procedure (no client orchestrates the multi-row insert) — single transaction.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`fn apply_template(template_id, target_parent_id, owner_id = auth.uid()):
  guard target_parent exists and not trashed → ERR_PARENT_NOT_FOUND 404 / ERR_FORBIDDEN 403
  guard caller can write to target_parent    → ERR_FORBIDDEN 403  (no WAL row written)

  payload = JSON.parse(Templates[template_id].PayloadJson)
  id_map  = {}

  clone(node, parent_new):
    new_id = gen_uuid()
    id_map[node.Id] = new_id
    Items.insert {
      Id:        new_id,
      ParentId:  parent_new,
      OwnerId:   owner_id,                 // §2 — always instantiator
      ItemType:  node.ItemType,
      Title:     node.Title,
      IsMirror:  false,                    // §1 / AT-TPL-04 — no peer-group revival
      CreatedAt: now(), UpdatedAt: now(),
    }
    for child in node.Children:
      clone(child, new_id)

  clone(payload.Root, target_parent_id)
  return { RootNewId: id_map[payload.Root.Id], IdMap: id_map }`}
      </pre>
      <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-center">Append to end of target's children</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-center">Single transaction · no orphan rows</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-center">≤ 5 s for ≤ 1000 nodes (UX promise)</span>
      </div>
    </SlideLayout>
  );
}
