import { SlideLayout } from "../../SlideLayout";
import { SqlBlock } from "../../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout
      chapter="B-1 · Two-DB split"
      title="Why two databases — and the rule that keeps them apart"
      subtitle="Identity is global. Item trees are per-workspace files. They never SQL-JOIN."
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border p-6">
          <div className="text-2xl font-semibold mb-3">Root DB · workflowy_root.db</div>
          <p className="text-lg text-muted-foreground mb-3">Single file. One per deployment.</p>
          <ul className="space-y-2 text-lg">
            <li>• User · UserSettings · UserRole / RoleType</li>
            <li>• Workspace (with <span className="font-mono">AppDbPath</span>)</li>
            <li>• WorkspaceMember / WorkspaceRoleType</li>
            <li>• FeedbackReport / FeedbackReply</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <div className="text-2xl font-semibold mb-3">App DB · &lt;workspace&gt;.db</div>
          <p className="text-lg text-muted-foreground mb-3">One file per workspace. Cheap to back up, snapshot, move.</p>
          <ul className="space-y-2 text-lg">
            <li>• Item · ItemType · Mirror · Tag · ItemTag</li>
            <li>• Share / ShareRoleType · Comment · Attachment · Mention</li>
            <li>• Favorite · Template · ActivityLog · SyncCursor</li>
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <SqlBlock caption="Lookup pattern: pick App DB from Root, then connect. The boundary is enforced at the connection-pool layer — there is no syntax that can cross it.">{`// 1) authenticate -> userId  (Root DB)
const ws = await rootDb.queryOne(
  \`SELECT w.WorkspaceId, w.AppDbPath
     FROM Workspace w
     JOIN WorkspaceMember m ON m.WorkspaceId = w.WorkspaceId
    WHERE m.UserId = ?\`, [userId]);

// 2) switch connection (App DB)
const appDb = await pool.acquire(ws.AppDbPath);
const items = await appDb.query(\`SELECT * FROM Item WHERE ParentItemId = ?\`, [parentId]);`}</SqlBlock>
      </div>
    </SlideLayout>
  );
}
