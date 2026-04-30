import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Closing" title="That's ops" subtitle="One process, two SQLite files, one on-call rotation. The whole operational surface fits in 25 slides because the system itself is small.">
      <div className="grid grid-cols-2 gap-6 mt-8 text-sm leading-relaxed">
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Operational principles</div>
          <ul className="space-y-1.5 text-foreground">
            <li>• Three SLOs, agreed in advance</li>
            <li>• Pages are binary: actionable at 3am, or it's a ticket</li>
            <li>• Mitigation before root cause, always</li>
            <li>• Postmortems are blameless and have action items</li>
            <li>• Practice rollback + restore quarterly</li>
          </ul>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Out of scope (for now)</div>
          <ul className="space-y-1.5 text-foreground">
            <li>• Multi-region failover</li>
            <li>• Read replicas</li>
            <li>• Per-tenant rate limits</li>
            <li>• Synthetic user-journey monitoring</li>
            <li>• Chaos / fault-injection testing</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        Cross-references: frontend deck at <code className="text-foreground">/deck</code>, backend deck at
        <code className="text-foreground"> /backend-deck</code>. This deck at <code className="text-foreground">/ops-deck</code>.
      </div>
    </SlideLayout>
  );
}
