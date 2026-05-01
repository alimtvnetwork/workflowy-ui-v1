import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-3 · Feed UI" title="Authorization — server-side only, hasRole always"
      subtitle="A user sees events for items they own or are shared with. Cross-user visibility for non-Admins is a Code-Red privacy bug.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Per-user scoping</div>
          <ul className="space-y-3 text-base list-disc pl-6">
            <li>Loader filters by <code>ActorUserId = currentUserId</code> from the session — <strong>never</strong> from <code>localStorage</code>.</li>
            <li>Page feed filters by ACL on the page root, joined to the user's effective shares.</li>
            <li>Filter combination is server-side; client never receives rows it can't see.</li>
          </ul>
          <div className="mt-4">
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-xs">AT-ACTIVITYFEED-15</span>
          </div>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Admin override</div>
          <ul className="space-y-3 text-base list-disc pl-6">
            <li>"View audit for other users" goes through <code>hasRole(userId, 'Admin')</code>.</li>
            <li>Bypassing the helper is forbidden — even reading <code>session.role</code> directly fails review.</li>
            <li><code>hasRole</code> queries the DB, not the session cache, on every elevation check.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-xs">AT-ACTIVITYFEED-16</span>
            <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono text-xs">AT-USERMANAGEMENT-06</span>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="text-xs uppercase tracking-wider text-destructive mb-2">Forbidden patterns</div>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-6">
          <li><code>if (user.role === 'Admin')</code> — inline role comparison</li>
          <li><code>localStorage.getItem('role')</code> — client-trusted role</li>
          <li>Client-side filtering on a full feed dump — leaks ACL'd rows over the wire</li>
        </ul>
      </div>
    </SlideLayout>
  );
}
