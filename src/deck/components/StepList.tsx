export type Step = { action: string; result: string };

export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-5 items-start">
          <span className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold">
            {i + 1}
          </span>
          <div className="pt-1">
            <div className="text-2xl text-foreground">{s.action}</div>
            <div className="text-xl text-muted-foreground mt-1">→ {s.result}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
