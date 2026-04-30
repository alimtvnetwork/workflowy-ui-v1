import { SlideLayout } from "../SlideLayout";
import { KV, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-4 · Admin" title="Routes & guards"
      subtitle="Four routes, one boundary, one HOF.">
      <KV rows={[
        { k: "/admin/users", v: <><code>{"<AdminUserList>"}</code> · <code>adminUsersLoader</code> · guard <code>requireAdmin</code></> },
        { k: "/admin/users/invite", v: <><code>{"<AdminInviteDialog>"}</code> modal over list · same guard</> },
        { k: "/admin/users/:userId", v: <><code>{"<AdminUserDetail>"}</code> · <code>adminUserDetailLoader</code></> },
        { k: "/admin/users/:userId/audit", v: <><code>{"<AdminUserAuditLog>"}</code> · <code>adminUserAuditLoader</code></> },
        { k: "Layout", v: <>All four mount under <code>{"<AdminLayout>"}</code> inside <code>{"<AdminBoundary>"}</code></> },
      ]} />
      <Footer at="AT-USERMANAGEMENT-12" gate="G-36-ADMIN-UI-GUARD"
        rule="Every admin route is wrapped in requireAdmin and rendered inside AdminBoundary — never as an anonymous nested route." />
    </SlideLayout>
  );
}
