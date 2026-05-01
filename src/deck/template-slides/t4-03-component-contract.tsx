import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-4 · Implementation" title="Component contract — two server-side files, no client orchestration"
      subtitle="The whole feature lives in the WordPress plugin. Clients call one endpoint and get back a root id; they never see partial state.">
      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-base">
          <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Surface</th>
              <th className="px-5 py-3 text-left">Component path</th>
              <th className="px-5 py-3 text-left">Acceptance tests</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-5 py-3.5">Template instantiation procedure</td>
              <td className="px-5 py-3.5 font-mono text-sm">wp-plugin/src/Templates/Instantiate.php</td>
              <td className="px-5 py-3.5 font-mono text-sm text-primary">AT-TPL-01, 02, 03</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-5 py-3.5">Template payload storage</td>
              <td className="px-5 py-3.5 font-mono text-sm">wp-plugin/src/Templates/PayloadRepository.php</td>
              <td className="px-5 py-3.5 font-mono text-sm text-primary">AT-TPL-04, 05</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-border p-3 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cross-DB scope</div>
          <p>root.templates (read) + app.nodes (write). Cross-DB JOINs forbidden — orchestrate via ADR-0019.</p>
        </div>
        <div className="rounded-lg border border-border p-3 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Egress</div>
          <p>Single transaction in app.nodes. Queue worker is the sole egress (ADR-0023).</p>
        </div>
        <div className="rounded-lg border border-border p-3 bg-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Error boundary</div>
          <p>Renders inside <code>PanelBoundary</code> (ADR-0017) — never the top-level boundary.</p>
        </div>
      </div>
    </SlideLayout>
  );
}
