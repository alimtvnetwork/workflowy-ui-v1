import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 3 · Endpoints & DB" title="Loading a subtree">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/items/:id", purpose: "Single item + immediate metadata" },
            { method: "GET", path: "/wf/v1/items/:id/tree?depth=N", purpose: "Subtree to depth N (lazy expand)" },
            { method: "GET", path: "/wf/v1/items/:id/breadcrumb", purpose: "Ancestor chain for the navbar" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Item", columns: ["ParentItemId (idx)", "FractionalIndex (idx)"], note: "Sorted children fetch in O(N log N)" },
            { table: "ItemType", columns: ["ItemTypeId", "Name"], note: "Renderer dispatch key" },
            { table: "Mirror", columns: ["MirrorItemId", "SourceItemId"], note: "Resolved server-side before send" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
