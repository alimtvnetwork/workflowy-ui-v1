import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Reading guide" title="What this deck assumes" subtitle="Operational context, not feature behavior. Pair every slide with the matching backend chapter.">
      <ul className="mt-10 space-y-4 text-lg text-foreground">
        <li>• You've seen the backend deck (/backend-deck) at least once. We reference its chapters by tag (e.g. B-7 for jobs).</li>
        <li>• You can SSH to the prod host and read systemd / journalctl output.</li>
        <li>• You have read access to the metrics endpoint (Prometheus) and the dashboards.</li>
        <li>• PagerDuty / Opsgenie route is set up; this deck doesn't cover paging tool config.</li>
      </ul>
      <div className="mt-12 text-sm text-muted-foreground">
        Five phases: O-1 SLOs · O-2 Metrics · O-3 Alerts · O-4 Dashboards · O-5 On-call & incidents.
      </div>
    </SlideLayout>
  );
}
