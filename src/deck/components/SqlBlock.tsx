type Props = { children: string; caption?: string; size?: number };

/** Monospaced code/SQL block for technical slides. */
export function SqlBlock({ children, caption, size = 20 }: Props) {
  return (
    <figure className="rounded-xl border border-border bg-muted/40 p-6">
      <pre
        className="font-mono leading-tight text-foreground whitespace-pre overflow-hidden"
        style={{ fontSize: size }}
      >
        {children}
      </pre>
      {caption && (
        <figcaption className="mt-3 text-base text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
