import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-2 · Auth" title="MFA challenge & recovery"
      subtitle="One challenge per session · recovery codes burn on use.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <Code label="Happy path (TOTP)">{`POST /auth/login           → 200 { Status, Results: [{
                                Stage: "MfaRequired",
                                MfaChallengeId: "…"
                             }] }
POST /auth/mfa/verify
{
  "MfaChallengeId": "…",
  "Code": "012345"
}
→ 200 { AccessToken, RefreshTokenSetCookie }`}</Code>
        <Code label="Recovery (lost device)">{`POST /auth/mfa/recover
{
  "MfaChallengeId": "…",
  "RecoveryCode": "X4F2-9LMQ-77BB"
}
→ 200 · code is now consumed
       new factor enrolment forced
       audit-log: mfa.recovery_used`}</Code>
      </div>
      <Footer at="AT-USERMANAGEMENT-10"
        rule="A successful recovery-code use forces re-enrolment of all MFA factors and emits an audit-log event." />
    </SlideLayout>
  );
}
