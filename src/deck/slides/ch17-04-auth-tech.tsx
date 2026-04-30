import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 17 · Endpoints & DB" title="Auth, RBAC, admin">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "POST", path: "/wf/v1/auth/signup", purpose: "Create User row + send verification" },
            { method: "POST", path: "/wf/v1/auth/signin", purpose: "Set httpOnly session cookie" },
            { method: "POST", path: "/wf/v1/auth/signout", purpose: "Revoke session" },
            { method: "POST", path: "/wf/v1/auth/forgot", purpose: "Email reset link" },
            { method: "GET", path: "/wf/v1/admin/users", purpose: "List users (admin only)" },
            { method: "POST", path: "/wf/v1/admin/users/:id/roles", purpose: "Grant/revoke admin (C4 protected)" },
          ]}
        />
        <DbTable
          tables={[
            { table: "User", columns: ["Email UK", "IsActive", "IsVerified", "DeletedAt"], note: "Root DB" },
            { table: "UserRole", columns: ["UserId", "RoleTypeId"], note: "System roles · separate table (no privilege escalation)" },
            { table: "RoleType", columns: ["admin | user"], note: "Lookup" },
            { table: "WorkspaceMember", columns: ["UserId", "WorkspaceId", "WorkspaceRoleTypeId"], note: "C4: ≥1 Owner per workspace" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
