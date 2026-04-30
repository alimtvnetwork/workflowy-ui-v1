import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-4 · Admin" title="Audit log surface"
      subtitle="Every privileged action lands here, immutable, with a 30-day hot window.">
      <div className="mt-6">
        <Code label="Schema (excerpt)">{`AuditEvent (
  EventId          ULID  PK,
  ActorUserId      UUID  NOT NULL,    -- who did it
  TargetUserId     UUID,              -- who was affected (optional)
  Kind             TEXT  NOT NULL,    -- e.g. auth.role.granted
  Reason           TEXT,              -- free text justification
  PayloadJson      TEXT  NOT NULL,    -- full request envelope (redacted)
  CreatedAt        TEXT  NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  IpHash           TEXT  NOT NULL,    -- HMAC of source IP
  -- INDEX (TargetUserId, CreatedAt DESC)
);`}</Code>
      </div>
      <Footer at="AT-USERMANAGEMENT-14" gate="G-23-AUDIT-LOG-COVERAGE"
        rule="Every grant / revoke / deactivate / MFA reset / password change emits an AuditEvent within the same transaction as the action." />
    </SlideLayout>
  );
}
