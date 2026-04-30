import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-2 · RBAC" title="has_role() + workspace membership" subtitle="System role check is one query. Workspace role is another. Both happen before the handler runs.">
      <SqlBlock caption="Roles live in their own table — never on User — to prevent privilege-escalation via row-update bugs. The check is a SECURITY DEFINER style function, but here implemented as a plain helper since SQLite has no row policies.">{`// system role check (admin endpoints)
async function hasRole(userId: number, role: "admin" | "user") {
  const r = await rootDb.queryOne(
    \`SELECT 1 FROM UserRole ur
       JOIN RoleType rt ON rt.RoleTypeId = ur.RoleTypeId
      WHERE ur.UserId = ? AND rt.Name = ?\`, [userId, role]);
  return !!r;
}

// workspace role check (every item endpoint)
async function workspaceRole(userId: number, workspaceId: number)
  : Promise<"Owner" | "Admin" | "Member" | null>
{
  const r = await rootDb.queryOne(
    \`SELECT wrt.Name
       FROM WorkspaceMember wm
       JOIN WorkspaceRoleType wrt ON wrt.WorkspaceRoleTypeId = wm.WorkspaceRoleTypeId
      WHERE wm.UserId = ? AND wm.WorkspaceId = ?\`, [userId, workspaceId]);
  return r?.Name ?? null;
}

// guard helper used by route definitions
const requireAdmin = async (req) => {
  if (!await hasRole(req.user.userId, "admin")) throw new ForbidError();
};
const requireWorkspace = async (req, role: "Owner"|"Admin"|"Member" = "Member") => {
  const r = await workspaceRole(req.user.userId, req.workspaceId);
  if (!r) throw new ForbidError("not_a_member");
  // role hierarchy: Owner > Admin > Member
  if (role === "Owner" && r !== "Owner") throw new ForbidError();
  if (role === "Admin" && r === "Member") throw new ForbidError();
};`}</SqlBlock>
    </SlideLayout>
  );
}
