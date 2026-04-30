import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 8 · Endpoints & DB" title="Date queries">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/today", purpose: "Items where DueDate = today (TZ from User)" },
            { method: "GET", path: "/wf/v1/calendar?from=&to=", purpose: "Items grouped by day for a range" },
            { method: "POST", path: "/wf/v1/quick-add", purpose: "Append item to Inbox + optional DueDate" },
            { method: "PATCH", path: "/wf/v1/items/:id", purpose: "Set / clear DueDate on drag" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Item", columns: ["DueDate (idx)", "OwnerUserId"], note: "B-tree index on DueDate" },
            { table: "User", columns: ["Timezone"], note: "Today boundary depends on user TZ" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
