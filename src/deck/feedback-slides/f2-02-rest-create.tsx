import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-2 · Submit" title="`POST /feedback` — server re-validates everything"
      subtitle="Same Zod schema, same enum lists, same length bounds. The client is untrusted by definition.">
      <div className="mt-6">
        <EndpointTable endpoints={[
          { method: "POST", path: "/feedback", purpose: "Create — Idempotency-Key required, returns canonical FeedbackReportId" },
          { method: "GET",  path: "/feedback", purpose: "Admin inbox — cursor pagination, Body truncated to 280 chars" },
          { method: "GET",  path: "/feedback/{id}", purpose: "Detail — full Body + DiagnosticsJson parsed" },
          { method: "POST", path: "/feedback/{id}/transition", purpose: "Status change — sole writer; FromStatus required" },
          { method: "GET",  path: "/feedback/export.csv", purpose: "Streamed CSV — Admin-only, formula-injection safe" },
        ]} />
      </div>
      <div className="mt-8 rounded-lg border border-border p-5 text-base">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Cross-cutting submit invariants</div>
        <ul className="space-y-2 list-disc pl-6">
          <li><b>Rate limit:</b> 10 submits / user / hour → 429 + Retry-After</li>
          <li><b>Idempotency:</b> client supplies key (= optimistic ID); server stores 24h, short-circuits dupes</li>
          <li><b>Receipt:</b> response MUST carry canonical FeedbackReportId so the optimistic ID can be reconciled</li>
        </ul>
      </div>
      <div className="mt-4 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-04-API-ENVELOPE-PASCAL</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-SF-SERVER-REVALIDATE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-SF-IDEMPOTENCY-KEY</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-RECEIPT</span>
      </div>
    </SlideLayout>
  );
}
