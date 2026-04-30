import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 10 · Endpoints & DB" title="Mirror plumbing">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "POST", path: "/wf/v1/mirrors", purpose: "Create mirror under target parent" },
            { method: "POST", path: "/wf/v1/mirrors/:id/detach", purpose: "Convert mirror to real copy" },
            { method: "GET", path: "/wf/v1/items/:id/peers", purpose: "All mirrors of this canonical item" },
            { method: "DELETE", path: "/wf/v1/mirrors/:id", purpose: "Remove placeholder only" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Mirror", columns: ["MirrorItemId PK", "SourceItemId FK", "BrokenAt"], note: "C1: source must itself be canonical (no mirror-of-mirror)" },
            { table: "Item", columns: ["MirrorOfItemId"], note: "NULL = canonical · NOT NULL = placeholder" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
