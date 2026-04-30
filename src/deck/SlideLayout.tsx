import type { ReactNode } from "react";

type Props = {
  chapter?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  /** Hide chrome (used for cover slides). */
  bare?: boolean;
};

/**
 * Standard inner layout for a 1920x1080 slide:
 * - chapter eyebrow + title header
 * - content area
 * - footer rule
 */
export function SlideLayout({ chapter, title, subtitle, children, bare }: Props) {
  if (bare) {
    return (
      <div className="h-full w-full bg-background text-foreground p-24 flex flex-col">
        {children}
      </div>
    );
  }
  return (
    <div className="h-full w-full bg-background text-foreground flex flex-col">
      <header className="px-20 pt-16 pb-6">
        {chapter && (
          <div className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
            {chapter}
          </div>
        )}
        <h1 className="text-6xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-2xl text-muted-foreground max-w-[1500px]">{subtitle}</p>
        )}
        <div className="mt-8 h-px w-full bg-border" />
      </header>
      <main className="flex-1 px-20 pb-16 overflow-hidden">{children}</main>
    </div>
  );
}
