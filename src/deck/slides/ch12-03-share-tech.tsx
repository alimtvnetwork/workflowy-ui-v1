import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 12 · Endpoints & DB" title="Sharing on the wire">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/items/:id/shares", purpose: "Current grants on this item" },
            { method: "POST", path: "/wf/v1/shares", purpose: "Invite by email or userId" },
            { method: "PATCH", path: "/wf/v1/shares/:id", purpose: "Change role" },
            { method: "POST", path: "/wf/v1/shares/:id/accept", purpose: "Resolve invite (sets GranteeUserId)" },
            { method: "DELETE", path: "/wf/v1/shares/:id", purpose: "Revoke (sets RevokedAt)" },
            { method: "POST", path: "/wf/v1/items/:id/public-link", purpose: "Toggle PublicSlug + role" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Share", columns: ["ShareId", "ItemId", "GranteeUserId | GranteeEmail", "ShareRoleTypeId", "PublicSlug", "RevokedAt"], note: "C5: grantee is XOR until accepted" },
            { table: "ShareRoleType", columns: ["Viewer | Editor | Owner"], note: "Role lookup" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
