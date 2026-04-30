import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-10 · Enforcement" title="Zod at the boundary" subtitle="Every request body, every op, every config file is parsed through a Zod schema before touching domain code. Untrusted data has a single, narrow door.">
      <SqlBlock caption="Schemas live in `src/contracts/` and are imported by both the route handler and the client SDK. One source of truth, type-checked on both sides.">{`// src/contracts/ops.ts
import { z } from "zod";

const Iso = z.string().datetime({ offset: true });
const ItemId = z.number().int().positive();

export const OpSchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("create"),
    clientOpId: z.string().ulid(),
    itemId: ItemId,
    parentItemId: ItemId.nullable(),
    itemTypeId: z.number().int().positive(),
    content: z.string().max(100_000),
    fractionalIndex: z.string().min(1).max(64),
    ts: Iso,
  }),
  z.object({
    op: z.literal("update"),
    clientOpId: z.string().ulid(),
    itemId: ItemId,
    fields: z.object({
      content:     z.string().max(100_000).optional(),
      itemTypeId:  z.number().int().positive().optional(),
      dueDate:     Iso.nullable().optional(),
      completedAt: Iso.nullable().optional(),
    }).strict(),
    ts: Iso,
  }),
  // ... move, delete, restore, mirror, tag, untag
]);

export const SyncRequestSchema = z.object({
  ops: z.array(OpSchema).max(500),
  cursor: z.string().nullable(),
}).strict();

// Route handler — no manual typeof checks, no '?? defaults', no 'as any'.
app.post("/sync", async (req, res) => {
  const body = SyncRequestSchema.parse(req.body);   // throws → 400
  const result = await applySync(req.session.userId, body);
  res.json(result);
});`}</SqlBlock>
    </SlideLayout>
  );
}
