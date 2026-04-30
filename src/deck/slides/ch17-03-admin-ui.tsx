import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 17 · Admin UI" title="The /admin console (admins only)">
      <Wireframe size={20}>{`  /admin/users
  ─────────────────────────────────────────────────────────────────
   Email                Display       Roles      Active   Actions
  ─────────────────────────────────────────────────────────────────
   alice@acme.com       Alice Tan     admin,user    ✓     ⋮
   bob@acme.com         Bob Wong      user          ✓     ⋮
   carol@acme.com       Carol Lim     user          ✗     ⋮
                                                          └─► Activate
                                                          └─► Grant admin
                                                          └─► Revoke admin
                                                          └─► Soft-delete

  Top tabs:  [Users]  [Workspaces]  [Feedback]  [Activity Feed]`}</Wireframe>
    </SlideLayout>
  );
}
