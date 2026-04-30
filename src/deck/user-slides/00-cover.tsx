import { SlideLayout } from "../SlideLayout";

export default function Cover() {
  return (
    <SlideLayout bare>
      <div className="m-auto text-center">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
          User Management · Deep Dive
        </div>
        <h1 className="text-[120px] leading-none font-semibold tracking-tight text-foreground">
          Who you are.<br />What you can do.
        </h1>
        <p className="mt-10 text-3xl text-muted-foreground max-w-[1400px] mx-auto">
          Accounts, sessions, MFA, RBAC, and admin surfaces — every role granted on the
          server, every check centralised in one helper.
        </p>
        <div className="mt-16 text-base tracking-[0.2em] uppercase text-muted-foreground">
          spec/36-user-management · 16 ATs · WP plugin + SQLite
        </div>
      </div>
    </SlideLayout>
  );
}
