import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 17 · RBAC" title="Two system roles · three workspace roles">
      <div className="grid grid-cols-2 gap-10">
        <div className="rounded-2xl border border-border p-8">
          <div className="text-2xl font-semibold mb-4">System roles (RoleType)</div>
          <ul className="space-y-3 text-xl text-muted-foreground">
            <li>👑 <span className="text-foreground">admin</span> — sees /admin, manages users, reviews feedback</li>
            <li>👤 <span className="text-foreground">user</span> — default for all signups</li>
          </ul>
          <p className="mt-4 text-base text-muted-foreground">
            Stored in <code className="font-mono">UserRole</code> · checked via <code className="font-mono">has_role()</code>.
          </p>
        </div>
        <div className="rounded-2xl border border-border p-8">
          <div className="text-2xl font-semibold mb-4">Workspace roles</div>
          <ul className="space-y-3 text-xl text-muted-foreground">
            <li>👑 <span className="text-foreground">Owner</span> — every workspace must keep ≥1 (C4)</li>
            <li>🛡 <span className="text-foreground">Admin</span> — manage members, settings</li>
            <li>👤 <span className="text-foreground">Member</span> — read/write items</li>
          </ul>
          <p className="mt-4 text-base text-muted-foreground">
            Stored in <code className="font-mono">WorkspaceMember</code>.
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
