import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 5 · Endpoints & DB" title="Behind the row menu">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "POST", path: "/wf/v1/items/:id/duplicate", purpose: "Deep-copy subtree" },
            { method: "POST", path: "/wf/v1/items/:id/move", purpose: "Re-parent to chosen target" },
            { method: "POST", path: "/wf/v1/mirrors", purpose: "Create mirror of source item" },
            { method: "DELETE", path: "/wf/v1/items/:id", purpose: "Soft-delete (sets DeletedAt)" },
            { method: "POST", path: "/wf/v1/favorites", purpose: "Add to favourites" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Item", columns: ["ParentItemId", "FractionalIndex", "DeletedAt"], note: "Move = update both. Delete = set DeletedAt." },
            { table: "Mirror", columns: ["MirrorItemId", "SourceItemId", "BrokenAt"], note: "BrokenAt set if source hard-deleted" },
            { table: "ActivityLog", columns: ["Action: moved/duplicated/mirrored/deleted"], note: "One row per ⋮ action" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
