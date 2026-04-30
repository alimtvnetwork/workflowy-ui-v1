import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 6 · Endpoints & DB" title="Bulk ops on the wire">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "POST", path: "/wf/v1/items/bulk-move", purpose: "Re-parent N items in one transaction" },
            { method: "POST", path: "/wf/v1/items/bulk-mirror", purpose: "Create N mirrors under target" },
            { method: "POST", path: "/wf/v1/items/bulk-complete", purpose: "Toggle CompletedAt on N items" },
            { method: "DELETE", path: "/wf/v1/items/bulk", purpose: "Soft-delete N items" },
            { method: "POST", path: "/wf/v1/items/bulk-tag", purpose: "Apply / remove tag on N items" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Item", columns: ["ParentItemId", "FractionalIndex"], note: "All updates in one tx — atomic move" },
            { table: "ItemTag", columns: ["ItemId", "TagId"], note: "UNIQUE(ItemId, TagId) — duplicates ignored" },
            { table: "ActivityLog", columns: ["bulk batch_id in PayloadJson"], note: "Group N rows by one user action" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
