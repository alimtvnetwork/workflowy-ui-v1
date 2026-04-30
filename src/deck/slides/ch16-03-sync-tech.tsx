import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 16 · Endpoints & DB" title="The sync contract">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "POST", path: "/wf/v1/sync", purpose: "Submit ops + cursor → ack + remote ops" },
            { method: "GET", path: "/wf/v1/sync/cursor", purpose: "Recover current cursor on cold start" },
            { method: "GET", path: "/wf/v1/events?since=", purpose: "SSE stream of remote ops (live updates)" },
          ]}
        />
        <DbTable
          tables={[
            { table: "SyncCursor", columns: ["UserId", "Cursor (opaque)", "UpdatedAt"], note: "Per-user replay anchor" },
            { table: "Item", columns: ["UpdatedAt"], note: "Used as LWW timestamp per field" },
            { table: "ActivityLog", columns: ["BIGINT id (monotonic)"], note: "Source for SSE event stream" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
