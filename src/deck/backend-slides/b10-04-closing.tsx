import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Closing" title="That's the backend" subtitle="One process, two SQLite files, ~12 KLOC of TypeScript. Every behavior in this deck is covered by an integration test that uses the real DB — no mocks at the boundary.">
      <div className="grid grid-cols-2 gap-6 mt-8 text-sm leading-relaxed">
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Design pillars</div>
          <ul className="space-y-1.5 text-foreground">
            <li>• Single-writer SQLite, WAL mode</li>
            <li>• Ops are the only mutation API</li>
            <li>• LWW with deterministic tie-break</li>
            <li>• Soft-delete + 30-day reaper</li>
            <li>• Permissions resolved at read time</li>
            <li>• Boundaries enforced by Zod + ESLint</li>
          </ul>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">What's not in this deck</div>
          <ul className="space-y-1.5 text-foreground">
            <li>• Multi-region replication (out of scope v1)</li>
            <li>• Real-time presence/cursors</li>
            <li>• End-to-end encryption</li>
            <li>• Mobile push notifications</li>
            <li>• Per-tenant resource quotas</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        Cross-references: frontend deck at <code className="text-foreground">/deck</code> · spec at
        <code className="text-foreground"> spec/31-app/</code> through <code className="text-foreground">spec/36-user-management/</code>.
      </div>
    </SlideLayout>
  );
}
