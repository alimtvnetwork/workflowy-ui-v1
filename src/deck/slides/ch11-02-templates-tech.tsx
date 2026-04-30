import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 11 · Endpoints & DB" title="Templates on the wire">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "POST", path: "/wf/v1/templates", purpose: "Snapshot a subtree (Payload = serialized JSON)" },
            { method: "GET", path: "/wf/v1/templates", purpose: "List templates visible to the user" },
            { method: "POST", path: "/wf/v1/templates/:id/apply", purpose: "Stamp into target parent (deep-copy, new IDs)" },
            { method: "DELETE", path: "/wf/v1/templates/:id", purpose: "Remove template" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Template", columns: ["TemplateId", "SourceItemId", "Name", "Payload (JSON)", "NodeCount", "IsWorkspaceScoped"], note: "Payload is a frozen snapshot — no live link to source" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
