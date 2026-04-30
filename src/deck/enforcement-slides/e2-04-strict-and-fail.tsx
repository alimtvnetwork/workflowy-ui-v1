import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-2 · Runtime" title="R4-5 — Strict by default, typed failures"
      subtitle="Catch API drift early; never swallow a parse failure.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">R4 · `.strict()` default</div>
          <p className="text-foreground text-base mb-3">Most schemas are <code>.strict()</code> so unknown keys throw. Only <code>Attributes</code> and <code>Detail</code> may use <code>.passthrough()</code>.</p>
          <pre className="font-mono text-sm bg-muted/30 rounded p-3">{`ItemSchema.strict()       // ← default
AttributesSchema.passthrough()
DetailSchema.passthrough()`}</pre>
          <div className="mt-3 text-xs font-mono text-primary">G-35-RV-STRICT-DEFAULT · AT-08</div>
        </div>
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">R5 · No silent catch</div>
          <p className="text-foreground text-base mb-3">A parse failure throws <code>BoundaryParseError</code> with one of <code>USR-35-PARSE / -ENVELOPE / -BRAND</code>.</p>
          <pre className="font-mono text-sm bg-muted/30 rounded p-3">{`// ✗ Forbidden
try { return Schema.parse(x) }
catch { return null }

// ✓ Required
throw new BoundaryParseError(
  'USR-35-PARSE', err
);`}</pre>
        </div>
      </div>
      <Footer gate="G-35-RV-NO-SILENT-CATCH" at="AT-ENFORCEMENTRULES-08"
        rule="Boundary parse failures throw a typed `BoundaryParseError` with a `USR-35-*` code — silent recovery is forbidden." />
    </SlideLayout>
  );
}
