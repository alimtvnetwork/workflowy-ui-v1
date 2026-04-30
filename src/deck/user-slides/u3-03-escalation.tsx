import { SlideLayout } from "../SlideLayout";
import { KV, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-3 · RBAC" title="Role escalation — the lifecycle"
      subtitle="Granting Admin/Owner is a privilege event with approval, expiry, and revocation.">
      <KV rows={[
        { k: "Grant classes", v: <>Standing (rare) · JIT (preferred) · Transfer (Owner only)</> },
        { k: "Approval", v: <>Standing Admin grant requires <strong>two-person rule</strong>; JIT requires reason + auto-expiry</> },
        { k: "Expiry", v: <>Standing Admin: 90 d default · JIT: 60 min default · Owner transfer: immediate, single approver</> },
        { k: "Revocation propagation", v: <>Sessions revoked ≤ 60 s · SSE channels closed ≤ 30 s · TokenRevocationList entry within 5 s</> },
        { k: "Audit", v: <>Every grant / revoke / expire emits an <code>auth.role.*</code> event with actor, target, justification</> },
      ]} />
      <Footer at="AT-USERMANAGEMENT-06" gate="G-24-ROLE-ESCALATION-COVERAGE"
        rule="Standing Admin grants require dual control; every privileged role MUST have an expiry and an audit-log emission." />
    </SlideLayout>
  );
}
