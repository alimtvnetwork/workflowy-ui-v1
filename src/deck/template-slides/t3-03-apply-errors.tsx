import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase T-3 · Apply" title="Apply errors — fail before any WAL row is written"
      subtitle="Three pre-conditions. All checked before the first insert; on failure the transaction never opens, so there is nothing to roll back.">
      <div className="mt-8 space-y-4 text-xl">
        <div className="rounded-xl border border-border p-5 bg-card flex items-center gap-6">
          <span className="px-3 py-2 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono">ERR_PARENT_NOT_FOUND 404</span>
          <span>Target parent does not exist in the caller's workspace, or has been trashed.</span>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card flex items-center gap-6">
          <span className="px-3 py-2 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono">ERR_FORBIDDEN 403</span>
          <span>Caller is read-only on the target parent (share permissions). No WAL row created — no orphan.</span>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card flex items-center gap-6">
          <span className="px-3 py-2 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono">ERR_TEMPLATE_NOT_FOUND 404</span>
          <span>Template id does not exist or caller cannot read it (private template owned by someone else).</span>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-border p-4 bg-card text-base text-muted-foreground">
        <strong className="text-foreground">Why "fail before WAL":</strong> a half-applied template is the worst outcome — orphans, broken parents, partial subtrees. Pre-checks turn that class of bug into a clean 4xx before mutation begins.
      </div>
    </SlideLayout>
  );
}
