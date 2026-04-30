import { SlideLayout } from "../SlideLayout";
import { Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-4 · Boundaries" title="The chokepoint principle"
      subtitle="Every external primitive enters the codebase through exactly one module — its chokepoint.">
      <div className="mt-6 grid grid-cols-4 gap-4 text-center">
        <Choke primitive="axios" path="src/api/client.ts" gate="G-35-BE-AXIOS-CHOKEPOINT" />
        <Choke primitive="idb" path="src/lib/idb/client.ts" gate="G-35-BE-IDB-CHOKEPOINT" />
        <Choke primitive="EventSource" path="src/realtime/sseClient.ts" gate="G-35-BE-SSE-CHOKEPOINT" />
        <Choke primitive="Worker" path="src/workers/workerClient.ts" gate="G-35-BE-WORKER-CHOKEPOINT" />
      </div>
      <div className="mt-10 rounded-lg border border-border p-6 text-base">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">The two-part rule</div>
        <ol className="space-y-2 text-foreground">
          <li>1. <strong>Chokepoint import</strong> — every external primitive is imported by exactly ONE module in <code>src/</code>.</li>
          <li>2. <strong>Export narrowing</strong> — that module owns the parse step and re-exports only typed, branded, schema-validated values. Re-exporting <code>AxiosResponse&lt;unknown&gt;</code> or raw <code>IDBValidKey</code> is forbidden.</li>
        </ol>
      </div>
      <Footer gate="G-35-BE-CHOKEPOINT-IMPORT" at="AT-ENFORCEMENTRULES-13"
        rule="Every external primitive is imported by exactly ONE module; chokepoint owns the parse and re-exports only narrowed values." />
    </SlideLayout>
  );
}

function Choke({ primitive, path, gate }: { primitive: string; path: string; gate: string }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Primitive</div>
      <div className="font-mono text-lg text-foreground">{primitive}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-3 mb-1">Chokepoint</div>
      <div className="font-mono text-sm text-foreground break-all">{path}</div>
      <div className="mt-3 text-[10px] font-mono text-primary">{gate}</div>
    </div>
  );
}
