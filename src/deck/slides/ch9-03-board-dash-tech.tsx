import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 9 · Endpoints & DB" title="Board & Dashboard">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/items/:id/board", purpose: "Columns + cards for a BoardProject" },
            { method: "POST", path: "/wf/v1/items/:id/move", purpose: "Card drag = move into column" },
            { method: "GET", path: "/wf/v1/dashboard", purpose: "Aggregated counts + activity sparkline" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Item", columns: ["ItemTypeId = BoardProject / BoardColumn"], note: "Same Item table, classified differently" },
            { table: "Item", columns: ["FractionalIndex"], note: "Card order within a column" },
            { table: "ActivityLog", columns: ["Action", "CreatedAt"], note: "Powers sparkline + recent" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
