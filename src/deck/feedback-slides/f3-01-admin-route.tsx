import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-3 · Admin" title="Route gating — server is the sole role authority"
      subtitle="Loader calls requireRole('Admin') synchronously. Navbar uses the same hasRole — no parallel client-only checks.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <div className="rounded-lg border border-destructive/40 p-5">
          <div className="text-xs uppercase tracking-wider text-destructive mb-2">✗ Forbidden</div>
          <pre className="text-sm font-mono leading-relaxed">{`// client-only guard
if (user.role === 'Admin') {
  return <FeedbackInbox/>;
}

// trusting localStorage
const role = localStorage.getItem('role');`}</pre>
        </div>
        <div className="rounded-lg border border-primary/40 p-5">
          <div className="text-xs uppercase tracking-wider text-primary mb-2">✓ Required</div>
          <pre className="text-sm font-mono leading-relaxed">{`export const loader = async ({ params }) => {
  await requireRole('Admin');     // server-side
  const id = FeedbackReportIdSchema
    .parse(params.feedbackReportId);
  return await fetchFeedback(id);
};`}</pre>
        </div>
      </div>
      <div className="mt-8 rounded-lg border border-border p-5 text-base">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Boundary protection</div>
        <p>Both routes wrap in <code>&lt;AdminBoundary&gt;</code> — one of the 8 named error boundaries (ADR-0017). A crash in the inbox MUST NOT take down the parent app shell.</p>
      </div>
      <div className="mt-4 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-LOADER-ROLE-GUARD</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-ROLE-SSOT</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-BOUNDARY-NAMED</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-33-AR-BRANDED-PARAM</span>
      </div>
    </SlideLayout>
  );
}
