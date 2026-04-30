import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 13 · Endpoints & DB" title="Trash plumbing">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/trash", purpose: "Items where DeletedAt IS NOT NULL" },
            { method: "POST", path: "/wf/v1/items/:id/restore", purpose: "Clear DeletedAt; reattach subtree" },
            { method: "DELETE", path: "/wf/v1/trash", purpose: "Empty trash (hard-delete all)" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Item", columns: ["DeletedAt (idx)"], note: "Partial index for fast trash listing" },
            { table: "Reaper job", columns: ["runs daily", "DELETE WHERE DeletedAt < now-30d"], note: "Background, not an endpoint" },
            { table: "Mirror", columns: ["BrokenAt"], note: "Set when source hard-deleted by reaper" },
            { table: "ActivityLog", columns: ["Action: deleted / restored / reaped"], note: "Audit trail" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
