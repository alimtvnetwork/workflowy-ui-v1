import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 4 · Endpoints & DB" title="Editing on the wire">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "POST", path: "/wf/v1/items", purpose: "Create item (Enter / slash menu insert)" },
            { method: "PATCH", path: "/wf/v1/items/:id", purpose: "Update Content / ItemTypeId / DueDate" },
            { method: "POST", path: "/wf/v1/items/:id/indent", purpose: "Tab — re-parent under previous sibling" },
            { method: "POST", path: "/wf/v1/items/:id/outdent", purpose: "Shift+Tab" },
            { method: "POST", path: "/wf/v1/items/:id/complete", purpose: "Toggle CompletedAt" },
            { method: "POST", path: "/wf/v1/sync", purpose: "Batch local edits with cursor (LWW)" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Item", columns: ["Content", "ItemTypeId", "FractionalIndex", "UpdatedAt"], note: "Rich text stored on Content" },
            { table: "SyncCursor", columns: ["UserId", "Cursor", "UpdatedAt"], note: "Per-user replay anchor" },
            { table: "ActivityLog", columns: ["ItemId", "ActorUserId", "Action", "PayloadJson"], note: "created/updated/moved/…" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
