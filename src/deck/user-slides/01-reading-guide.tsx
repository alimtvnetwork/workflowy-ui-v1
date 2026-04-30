import { SlideLayout } from "../SlideLayout";

export default function Guide() {
  return (
    <SlideLayout chapter="Reading guide" title="Four phases, one principle"
      subtitle="Roles live on the server; the client never decides who is admin.">
      <div className="mt-10 grid grid-cols-2 gap-8 text-lg">
        <Phase n="U-1" name="Account & Settings"
          desc="Settings panel, password, email change, MFA enrolment, account delete, backup/restore." />
        <Phase n="U-2" name="Auth Flow"
          desc="Solo vs sync mode, login state machine, session/refresh tokens, MFA challenge, recovery codes." />
        <Phase n="U-3" name="RBAC Helpers"
          desc="One central `hasRole` / `requireRole`, server-side only. Anti-pattern: client-side role checks." />
        <Phase n="U-4" name="Admin UI"
          desc="Invite, list, role-assign, deactivate, audit. Every route gated by `requireAdmin` HOF + AdminBoundary." />
      </div>
    </SlideLayout>
  );
}

function Phase({ n, name, desc }: { n: string; name: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border p-6">
      <div className="text-xs uppercase tracking-wider text-primary font-mono mb-2">{n}</div>
      <div className="text-2xl font-semibold mb-2">{name}</div>
      <div className="text-muted-foreground text-base leading-relaxed">{desc}</div>
    </div>
  );
}
