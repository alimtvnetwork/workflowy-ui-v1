import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-1 · Account" title="Set password & change email"
      subtitle="Re-auth on password change · email change is two-phase (link confirmation).">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <Code label="Set password">{`POST /me/password
{
  "CurrentPassword": "…",
  "NewPassword": "…"
}
→ 200 { Status, Results: [] }
→ 401 invalid current password`}</Code>
        <Code label="Change email (two-phase)">{`POST /me/email/request
{ "NewEmail": "alice@new.com" }
→ confirmation link mailed to NewEmail
GET  /me/email/confirm?token=…
→ swaps email; old address keeps login
   until confirmation succeeds`}</Code>
      </div>
      <Footer at="AT-USERMANAGEMENT-02"
        rule="Password changes require current password; email changes require click-through confirmation before swap." />
    </SlideLayout>
  );
}
