import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="O-1 · SLOs" title="Error budget policy" subtitle="What we do when the budget runs out — agreed in advance so we don't argue mid-incident.">
      <div className="mt-10 space-y-4 text-foreground">
        <Row green="≥ 50% budget remaining" body="Ship freely. Risky changes OK behind feature flags." />
        <Row green="25-50% remaining" body="Ship as normal. Schema migrations require a written rollback plan." />
        <Row yellow="10-25% remaining" body="Freeze risky changes. New work prioritizes reliability fixes. Migrations require sign-off." />
        <Row red="0-10% remaining" body="Code freeze except reliability + security. Daily check-in. No new feature deploys." />
        <Row red="Budget exhausted" body="Full freeze. All on-call attention on root cause. Public status acknowledgement if user-visible." />
      </div>
      <div className="mt-10 text-sm text-muted-foreground">
        Budget burn-rate alerts (slide O-3) trigger before we're out — usually with 24-72 hours of runway left.
      </div>
    </SlideLayout>
  );
}

function Row({ green, yellow, red, body }: { green?: string; yellow?: string; red?: string; body: string }) {
  const label = green ?? yellow ?? red!;
  const color = green ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : yellow ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "bg-red-500/15 text-red-600 dark:text-red-400";
  return (
    <div className="flex gap-4 items-start">
      <div className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-mono ${color} min-w-[260px]`}>{label}</div>
      <div className="text-base">{body}</div>
    </div>
  );
}
