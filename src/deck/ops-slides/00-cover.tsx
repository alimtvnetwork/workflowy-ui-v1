import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Ops Deck" title="WorkFlowy — Operations" subtitle="What it takes to run this thing in production. Metrics, alerts, dashboards, on-call playbooks.">
      <div className="mt-12 grid grid-cols-3 gap-6 text-sm">
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Audience</div>
          <div className="text-foreground">SREs, on-call engineers, anyone shipping changes that touch production.</div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Companion to</div>
          <div className="text-foreground">Frontend deck (/deck) and Backend deck (/backend-deck). Read those first if you haven't.</div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Scope</div>
          <div className="text-foreground">Single host, single Node process, two SQLite files. ~25 slides, 20 minutes.</div>
        </div>
      </div>
    </SlideLayout>
  );
}
