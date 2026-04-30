import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 2 · Endpoints & DB" title="What the App Shell calls">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/me", purpose: "Current user, role, workspace list" },
            { method: "GET", path: "/wf/v1/sidebar", purpose: "Default special nodes + favourites in order" },
            { method: "POST", path: "/wf/v1/favorites", purpose: "Add a favourite (drag onto sidebar)" },
            { method: "PATCH", path: "/wf/v1/favorites/:id", purpose: "Reorder (FractionalIndex)" },
            { method: "DELETE", path: "/wf/v1/favorites/:id", purpose: "Remove favourite" },
          ]}
        />
        <DbTable
          tables={[
            { table: "User", columns: ["UserId", "Email", "DisplayName", "Timezone"], note: "Root DB" },
            { table: "Workspace", columns: ["WorkspaceId", "OwnerUserId", "AppDbPath"], note: "Root DB · selects which App DB" },
            { table: "WorkspaceMember", columns: ["UserId", "WorkspaceId", "WorkspaceRoleTypeId"], note: "Membership + role" },
            { table: "Favorite", columns: ["FavoriteId", "ItemId", "UserId", "FractionalIndex"], note: "Sidebar shortcuts" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
