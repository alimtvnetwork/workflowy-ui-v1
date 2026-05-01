import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-1 · Decision" title="The shape of a template payload"
      subtitle="One row in Templates.PayloadJson. A versioned envelope, the source root, and a recursive tree of plain nodes.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-6 text-base font-mono leading-relaxed text-foreground overflow-x-auto">
{`interface TemplatePayload {
  Version: 1
  SourceRootId: ItemId       // informational — provenance only
  TakenAt: ISO8601
  NodeCount: int             // ≤ 10 000 (cap §Edge Cases)
  Root: SnapshotNode
}

interface SnapshotNode {
  Id: ItemId                 // original id; re-stamped on apply
  ParentId: ItemId | null    // payload-local parent
  ItemType: "Bullet" | "Todo" | "H1" | "H2" | "Paragraph"
  Title: string
  Children: SnapshotNode[]
  // NOTE: no OwnerId, no PeerGroupId, no IsMirror, no TrashedAt.
}`}
      </pre>
      <div className="mt-6 grid grid-cols-2 gap-4 text-base text-muted-foreground">
        <div className="rounded-lg border border-border p-4 bg-card">
          <strong className="text-foreground">Stripped on snapshot:</strong> ownership, mirror flag, peer-group id, trash timestamp, server timestamps.
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <strong className="text-foreground">Preserved on snapshot:</strong> tree shape, ItemType, Title. Everything else is re-stamped.
        </div>
      </div>
    </SlideLayout>
  );
}
