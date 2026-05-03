import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Realistic web-app chrome primitives for slides.
 * No real data — these render Tailwind UI mockups so the audience
 * sees what the product looks like instead of ASCII.
 */

export function MockWindow({
  title,
  url,
  children,
  className,
}: {
  title?: string;
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-2xl overflow-hidden", className)}>
      <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/60 border-b border-border">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-red-400/80" />
          <span className="size-3 rounded-full bg-yellow-400/80" />
          <span className="size-3 rounded-full bg-green-400/80" />
        </div>
        {url && (
          <div className="flex-1 mx-4 px-3 py-1 rounded-md bg-background/80 text-sm text-muted-foreground font-mono truncate">
            {url}
          </div>
        )}
        {title && !url && <div className="text-sm text-muted-foreground">{title}</div>}
      </div>
      {children}
    </div>
  );
}

export function MockNavbar({
  breadcrumb,
  right,
}: {
  breadcrumb?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-3 border-b border-border bg-background">
      <button className="size-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground">
        ☰
      </button>
      <div className="font-semibold text-foreground">WorkFlowy</div>
      <div className="flex-1 text-sm text-muted-foreground truncate">{breadcrumb}</div>
      <div className="flex items-center gap-2 text-muted-foreground">
        {right ?? (
          <>
            <span className="size-8 rounded-md hover:bg-muted flex items-center justify-center">🔍</span>
            <span className="size-8 rounded-md hover:bg-muted flex items-center justify-center">＋</span>
            <span className="size-8 rounded-md hover:bg-muted flex items-center justify-center">ⓘ</span>
            <span className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">JD</span>
          </>
        )}
      </div>
    </div>
  );
}

export function MockSidebar({ items }: { items: { icon: string; label: string; active?: boolean }[] }) {
  return (
    <aside className="w-56 border-r border-border bg-muted/30 py-3">
      {items.map((it) => (
        <div
          key={it.label}
          className={cn(
            "flex items-center gap-3 px-4 py-2 text-sm",
            it.active ? "bg-primary/10 text-primary font-medium" : "text-foreground/80 hover:bg-muted"
          )}
        >
          <span className="w-5 text-center">{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </aside>
  );
}

type Row = {
  bullet?: string;
  text: ReactNode;
  children?: Row[];
  badges?: ReactNode;
  muted?: boolean;
  highlight?: boolean;
};

export function MockOutline({ rows, depth = 0 }: { rows: Row[]; depth?: number }) {
  return (
    <ul className="space-y-1">
      {rows.map((r, i) => (
        <li key={i}>
          <div
            className={cn(
              "flex items-start gap-2 py-1 px-1 rounded-md group",
              r.highlight && "bg-primary/10",
              r.muted && "opacity-60"
            )}
            style={{ paddingLeft: depth * 24 }}
          >
            <span className="text-muted-foreground/50 select-none mt-0.5">⋮</span>
            <span className="text-foreground mt-0.5">{r.bullet ?? "•"}</span>
            <span className="flex-1 text-foreground">{r.text}</span>
            {r.badges && <span className="flex items-center gap-1.5">{r.badges}</span>}
          </div>
          {r.children && <MockOutline rows={r.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

export function MockPanel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      {title && <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{title}</div>}
      {children}
    </div>
  );
}

export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "primary" | "success" | "warn" | "danger" }) {
  const tones = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/15 text-primary",
    success: "bg-green-500/15 text-green-600 dark:text-green-400",
    warn: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    danger: "bg-red-500/15 text-red-600 dark:text-red-400",
  };
  return <span className={cn("px-2 py-0.5 rounded text-xs font-medium", tones[tone])}>{children}</span>;
}
