import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 20 · Enforcement Rules" title="Guardrails the codebase enforces" subtitle="Not user-facing — but they shape every API and component.">
      <div className="grid grid-cols-2 gap-6">
        {[
          { title: "Generic return types", body: "Endpoint handlers must declare typed Result<T> envelopes — no ad-hoc shapes." },
          { title: "Runtime validation", body: "Every request body parsed via a Zod schema mirrored from the OpenAPI spec." },
          { title: "ESLint custom rules", body: "Project-authored rules forbid raw colors, cross-boundary imports, and untyped fetches." },
          { title: "Boundary enforcement", body: "Root DB ↔ App DB never join. UI layer never touches DB directly. Lint fails the PR." },
        ].map((r) => (
          <div key={r.title} className="rounded-xl border border-border bg-card p-6">
            <div className="text-2xl font-semibold">{r.title}</div>
            <p className="mt-2 text-lg text-muted-foreground">{r.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-2xl text-muted-foreground">
        ⤷ Result: a new feature can be added confidently because architectural mistakes fail at lint/typecheck — not in production.
      </p>
    </SlideLayout>
  );
}
