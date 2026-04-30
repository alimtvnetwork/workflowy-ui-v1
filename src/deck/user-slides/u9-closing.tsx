import { SlideLayout } from "../SlideLayout";

export default function Closing() {
  return (
    <SlideLayout bare>
      <div className="m-auto w-full max-w-[1500px] px-12">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8 text-center">
          Three things to take with you
        </div>
        <ol className="space-y-8 text-3xl text-foreground">
          <li>
            <span className="font-mono text-primary mr-4">1.</span>
            Roles live in <code>UserRole</code> on the server. The client never decides.
          </li>
          <li>
            <span className="font-mono text-primary mr-4">2.</span>
            One <code>Auth::hasRole</code> · one <code>requireRole</code> · one <code>requireAdmin</code> HOF.
            Nothing else queries the role table.
          </li>
          <li>
            <span className="font-mono text-primary mr-4">3.</span>
            Every privileged action is paired with an <code>AuditEvent</code> in the same transaction.
            If you can't see it in the audit log, it didn't happen.
          </li>
        </ol>
      </div>
    </SlideLayout>
  );
}
