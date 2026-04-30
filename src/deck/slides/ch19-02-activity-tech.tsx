import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 19 · Endpoints & DB" title="Capture pipeline & feed">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/admin/activity?since=&actor=", purpose: "Paged feed with filters" },
            { method: "GET", path: "/wf/v1/events", purpose: "SSE live tail (also powers client sync)" },
          ]}
        />
        <DbTable
          tables={[
            { table: "ActivityLog", columns: ["BIGINT id PK", "ItemId", "ActorUserId", "Action", "PayloadJson", "CreatedAt (idx)"], note: "Append-only · single source for feed + sync" },
            { table: "Purge job", columns: ["DELETE WHERE CreatedAt < now-90d"], note: "Nightly · archives to cold storage first" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
