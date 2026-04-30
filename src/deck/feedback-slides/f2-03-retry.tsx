import { SlideLayout } from "../SlideLayout";

const ROWS = [
  { cond: "navigator.onLine === false at submit", action: "Queue holds entry · toast: 'Saved locally — will sync when online'", gate: "G-33-SF-OFFLINE-DEGRADE" },
  { cond: "Server returns 5xx", action: "Exponential backoff 1s → 2s → 4s → 8s … max 30s, up to 8 attempts", gate: "G-33-SF-BACKOFF" },
  { cond: "Server returns 4xx (other than 429)", action: "Move to dead-letter store · non-blocking toast with [Retry] [Discard]", gate: "G-33-SF-DEAD-LETTER" },
  { cond: "Server returns 429", action: "Honour Retry-After · toast: 'Slow down — try again in N s'", gate: "G-33-RATE-LIMIT" },
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-2 · Submit" title="Retry behaviour — every failure mode is named"
      subtitle="Silent retries are forbidden. So is auto-retrying 4xx errors (would mask validation bugs).">
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left text-base">
          <thead className="bg-muted/60 text-sm">
            <tr>
              <th className="px-5 py-3 w-1/3">Condition</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3 w-56">Gate</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.gate} className="border-t border-border align-top">
                <td className="px-5 py-3 font-mono text-sm">{r.cond}</td>
                <td className="px-5 py-3 text-foreground">{r.action}</td>
                <td className="px-5 py-3"><span className="px-2 py-0.5 rounded bg-primary/15 text-primary font-mono text-xs">{r.gate}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideLayout>
  );
}
