import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-2 · Snapshot" title="Take snapshot — DFS clone with two filters"
      subtitle="Mirror flatten + trash exclude happen during the walk. Cap check is a post-condition. No partial saves.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`fn take_snapshot(items, source_root_id):
  build(node, parent_in_payload):
    if node.TrashedAt:                          → exclude (record in Trace.ExcludedTrashed)
      return null
    if node.IsMirror:                           → flatten (record in Trace.FlattenedMirrors)
      // continue as plain node
    out = SnapshotNode {
      Id: node.Id, ParentId: parent_in_payload,
      ItemType: node.ItemType, Title: node.Title,
      Children: []
    }
    for child in children_of(node.Id):
      sub = build(child, node.Id)
      if sub: out.Children.push(sub)
    return out

  tree = build(items[source_root_id], null)
  if tree.NodeCount > 10_000:
    raise ERR_TEMPLATE_TOO_LARGE 413              // post-walk cap check (AT-APP-TSNAP-04)
  return TemplatePayload { Version: 1, Root: tree, ... }`}
      </pre>
      <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-border p-3 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Mirror handling</div>
          <p>Peer-group references are dropped; the canonical content is materialised into the snapshot once per visit.</p>
        </div>
        <div className="rounded-lg border border-border p-3 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Trash handling</div>
          <p>Trashed nodes <strong>and their entire subtree</strong> are excluded — we return null up the recursion.</p>
        </div>
        <div className="rounded-lg border border-border p-3 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Atomicity</div>
          <p>The cap check runs AFTER the walk. On failure no Templates row is inserted — there is no partial template.</p>
        </div>
      </div>
    </SlideLayout>
  );
}
