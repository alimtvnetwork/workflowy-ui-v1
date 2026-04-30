import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="O-5 · On-call" title="On-call rotation" subtitle="One primary, one secondary. Weekly rotation, handoff Mondays at 10:00. Pages route via Opsgenie.">
      <StepList
        steps={[
          { action: "Page received",     result: "ACK within 5 minutes. If you can't, it auto-escalates to secondary at 5 min and to lead at 15." },
          { action: "Open the runbook",  result: "Every page annotation links to a slide in this deck (O-5.2 / O-5.3 / O-5.4). Read it BEFORE touching anything." },
          { action: "Open the dashboards",result: "Overview (O-4.1) first, then the relevant deep-dive. Confirm the alert is real before paging anyone else." },
          { action: "Communicate early", result: "Post in #incidents within 10 min: what's broken, blast radius, current ETA. Re-post every 30 min until resolved." },
          { action: "Mitigate before fix",result: "Roll back, flip the feature flag, or restart the service. Mitigation > root cause during the incident." },
          { action: "Resolve",           result: "Close the alert in Opsgenie. Post resolution summary in #incidents. File the postmortem ticket — even for short ones." },
          { action: "Postmortem",        result: "Within 5 business days for any sev-1 or sev-2. Use the template in /docs/postmortem.md. Blameless. Action items have owners and dates." },
        ]}
      />
    </SlideLayout>
  );
}
