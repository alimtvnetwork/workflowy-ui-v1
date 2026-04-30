import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-4 · Admin" title="Invite & deactivate"
      subtitle="Two destructive actions, one confirmation pattern.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <Code label="Invite (creates User row)">{`POST /admin/users/invite
{
  "Email": "alice@org.com",
  "InitialRole": "Member",
  "ExpiresInDays": 7
}
→ 201 { Status, Results: [{
    UserId, InviteToken, InviteUrl
}] }
→ email is sent server-side`}</Code>
        <Code label="Deactivate (reversible)">{`POST /admin/users/{userId}/deactivate
{ "Reason": "leave of absence" }
→ 200
→ all sessions revoked
→ user appears in list with badge "Inactive"
→ POST /reactivate restores access`}</Code>
      </div>
      <Footer at="AT-USERMANAGEMENT-13"
        rule="Invite emits an audit event and a single-use InviteToken; deactivate revokes sessions in ≤ 60 s and is reversible via reactivate." />
    </SlideLayout>
  );
}
