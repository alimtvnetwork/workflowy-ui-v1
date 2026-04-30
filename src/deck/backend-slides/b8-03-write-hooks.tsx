import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-8 · Capture" title="Write-path hooks" subtitle="Every applied op flows through one funnel that fans out to FTS, activity, and SSE. Hooks run inside the same transaction as the op — no eventual consistency drift.">
      <SqlBlock caption="The hook list is registered at boot, not per-call. Each hook is a pure function of (op, ctx). Failures roll back the whole op — search and activity are part of correctness, not best-effort.">{`type WriteHook = (op: Op, ctx: TxCtx) => void;

const HOOKS: WriteHook[] = [
  ftsHook,         // keep items_fts in sync
  activityHook,    // append to activity table
  ssePublishHook,  // queue fan-out (deferred to after-commit)
];

export function applyOp(op: Op, actor: UserId) {
  return db.transaction(() => {
    const ctx: TxCtx = { actor, deferred: [] };

    switch (op.op) {
      case "create":  applyCreate(op, ctx);  break;
      case "update":  applyUpdate(op, ctx);  break;
      case "move":    applyMove(op, ctx);    break;
      case "delete":  applyDelete(op, ctx);  break;
      case "archive": applyArchive(op, ctx); break;
      case "restore": applyRestore(op, ctx); break;
    }
    for (const h of HOOKS) h(op, ctx);
    return ctx.deferred;            // run after commit
  })().forEach(fn => fn());
}

// FTS hook — keeps items_fts in lockstep with items
const ftsHook: WriteHook = (op, ctx) => {
  if (op.op === "create" || op.op === "update") {
    const row = db.prepare("SELECT content, workspaceId FROM items WHERE id=?").get(op.itemId);
    const tags = db.prepare(\`SELECT group_concat(t.name,' ') AS s
                              FROM item_tags it JOIN tags t ON t.id=it.tagId
                             WHERE it.itemId=?\`).get(op.itemId).s ?? "";
    db.prepare("DELETE FROM items_fts WHERE itemId=?").run(op.itemId);
    db.prepare(\`INSERT INTO items_fts(itemId, workspaceId, content, tagsText)
                VALUES (?, ?, ?, ?)\`)
      .run(op.itemId, row.workspaceId, row.content, tags);
  } else if (op.op === "delete") {
    db.prepare("DELETE FROM items_fts WHERE itemId=?").run(op.itemId);
  }
};

// Activity hook — append-only audit
const activityHook: WriteHook = (op, ctx) => {
  db.prepare(\`INSERT INTO activity(actorUserId, verb, itemId, payload, createdAt)
              VALUES (?, ?, ?, ?, ?)\`)
    .run(ctx.actor, op.op, op.itemId, JSON.stringify(op), now());
};

// SSE hook — defer until commit so subscribers never see uncommitted state
const ssePublishHook: WriteHook = (op, ctx) => {
  ctx.deferred.push(() => publish(workspaceOf(op.itemId), op));
};`}</SqlBlock>
    </SlideLayout>
  );
}
