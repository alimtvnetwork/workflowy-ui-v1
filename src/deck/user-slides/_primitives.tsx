// Shared primitives for the user-management deck.
import type { ReactNode } from "react";

export function Footer({ at, gate, rule }: { at?: string; gate?: string; rule: string }) {
  return (
    <div className="mt-10 rounded-lg border border-border p-5 flex items-start gap-6">
      <div className="shrink-0 grid grid-cols-1 gap-1 text-xs">
        {gate && <span className="px-2 py-0.5 rounded bg-primary/15 text-primary font-mono">{gate}</span>}
        {at && <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">{at}</span>}
      </div>
      <p className="text-lg text-foreground">{rule}</p>
    </div>
  );
}

export function Code({
  label, tone = "neutral", children,
}: { label?: string; tone?: "good" | "bad" | "neutral"; children: string }) {
  const border =
    tone === "good" ? "border-primary/40"
    : tone === "bad" ? "border-destructive/40"
    : "border-border";
  const eye =
    tone === "good" ? "text-primary"
    : tone === "bad" ? "text-destructive"
    : "text-muted-foreground";
  const mark = tone === "good" ? "✓" : tone === "bad" ? "✗" : "›";
  return (
    <div className={`rounded-lg border ${border} bg-muted/20 p-6`}>
      {label && (
        <div className={`text-xs uppercase tracking-wider mb-3 ${eye}`}>
          {mark} {label}
        </div>
      )}
      <pre className="text-base leading-relaxed text-foreground whitespace-pre-wrap font-mono">{children}</pre>
    </div>
  );
}

export function KV({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <div className="mt-6 rounded-lg border border-border overflow-hidden">
      <table className="w-full text-base">
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.k} className={i % 2 ? "bg-muted/20" : ""}>
              <td className="px-5 py-3 font-mono text-sm text-muted-foreground w-72 align-top">{r.k}</td>
              <td className="px-5 py-3 text-foreground">{r.v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
