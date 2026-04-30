import { SlideLayout } from "../SlideLayout";
import { KV, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-1 · Account" title="MFA enrolment"
      subtitle="TOTP (RFC 6238) and WebAuthn passkeys. Recovery codes shown ONCE.">
      <KV rows={[
        { k: "Factors", v: "1 TOTP secret + N WebAuthn credentials per user" },
        { k: "Enrolment", v: "QR + manual secret · user types a 6-digit code to confirm" },
        { k: "Recovery codes", v: <><strong>10 single-use codes</strong> generated at enrolment · user must download/print before dialog can close</> },
        { k: "Storage", v: <code>UserMfaCredential</code> (kind, public key / encrypted secret, last used) </> },
        { k: "Reset", v: "Lost device → use a recovery code at login → fall back to password + reset all factors" },
        { k: "Bypass", v: <span className="text-destructive">Admin-forced reset is audit-logged with reason; no silent bypass.</span> },
      ]} />
      <Footer at="AT-USERMANAGEMENT-03" gate="G-26-MFA-COVERAGE"
        rule="MFA enrolment dialog cannot close until recovery codes are downloaded; all factors and resets are audit-logged." />
    </SlideLayout>
  );
}
