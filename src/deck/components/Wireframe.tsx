type Props = {
  children: string;
  caption?: string;
  /** font-size in px at 1920x1080 canvas scale. */
  size?: number;
};

/**
 * ASCII / box-drawing wireframe rendered in a monospace pre.
 * Author the diagram as a template literal. Lines preserved as-is.
 */
export function Wireframe({ children, caption, size = 22 }: Props) {
  return (
    <figure className="rounded-xl border border-border bg-muted/40 p-8">
      <pre
        className="font-mono leading-tight text-foreground whitespace-pre overflow-hidden"
        style={{ fontSize: size }}
      >
        {children}
      </pre>
      {caption && (
        <figcaption className="mt-4 text-lg text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
