import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="O-1 · SLOs" title="Service objectives" subtitle="Three SLOs cover the whole product. Everything else is a leading indicator.">
      <div className="mt-10 space-y-5">
        <Slo
          name="Sync latency"
          objective="99% of POST /sync requests complete in < 250 ms over 28 days."
          why="Sync is the spine. If sync is slow, the whole app feels slow — every keystroke pays the tax."
          budget="≈ 7 hours/month above 250 ms before we burn the budget."
        />
        <Slo
          name="Sync availability"
          objective="99.9% of POST /sync requests return 2xx (excluding client 4xx) over 28 days."
          why="Failed syncs queue in the client outbox, but a sustained spike means data divergence and user-visible 'unsaved' badges."
          budget="≈ 43 minutes/month of full outage equivalent."
        />
        <Slo
          name="SSE liveness"
          objective="95% of connected SSE sockets receive a server event (op or heartbeat) within 30 s."
          why="Stale SSE means cross-device updates silently stop. Heartbeat (B-7.4) is the floor."
          budget="Looser SLO because clients fall back to cursor sync — degraded, not broken."
        />
      </div>
    </SlideLayout>
  );
}

function Slo({ name, objective, why, budget }: { name: string; objective: string; why: string; budget: string }) {
  return (
    <div className="border border-border rounded-lg p-5">
      <div className="flex items-baseline gap-3 mb-2">
        <div className="text-lg font-semibold text-foreground">{name}</div>
        <div className="text-sm text-primary font-mono">{objective}</div>
      </div>
      <div className="text-sm text-muted-foreground"><span className="text-foreground">Why:</span> {why}</div>
      <div className="text-sm text-muted-foreground mt-1"><span className="text-foreground">Budget:</span> {budget}</div>
    </div>
  );
}
