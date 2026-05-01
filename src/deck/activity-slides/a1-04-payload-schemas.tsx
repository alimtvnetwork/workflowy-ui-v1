import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-1 · Schema" title="Per-EventType payload — strict Zod"
      subtitle="Every PayloadJson validates against a schema indexed by EventType. .strict() everywhere — no passthrough drift.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-xs font-mono leading-relaxed text-foreground overflow-x-auto">
{`export const ItemMovedPayload = z.object({
  PrevParentItemId: ItemIdSchema.nullable(),
  NextParentItemId: ItemIdSchema.nullable(),
  PrevSortOrder:    z.string().min(1),  // base-62 fractional, ADR-0016
  NextSortOrder:    z.string().min(1),
}).strict();

export const ItemUpdatedPayload = z.object({
  ChangedFields: z.array(z.enum(['Content','ItemType','Metadata'])).min(1),
  PrevContent:   z.string().max(10_000).optional(),
  NextContent:   z.string().max(10_000).optional(),
}).strict();

export const PayloadSchemaForType = {
  ItemCreated:          ItemCreatedPayload,
  ItemUpdated:          ItemUpdatedPayload,
  ItemMoved:            ItemMovedPayload,
  ItemDeleted:          ItemDeletedPayload,
  ItemRestored:         ItemRestoredPayload,
  ItemMirrored:         ItemMirroredPayload,
  BoardColumnReordered: BoardColumnReorderedPayload,
  TemplateApplied:      TemplateAppliedPayload,
} as const satisfies Record<EventType, z.ZodTypeAny>;`}
      </pre>
      <p className="mt-6 text-base text-muted-foreground">
        The <code>satisfies Record&lt;EventType, …&gt;</code> bound makes the
        compiler reject any new <code>EventType</code> value without a matching
        payload schema. No runtime defence needed — the type system catches it
        at the boundary.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-ES-PAYLOAD-VALIDATED</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-ES-STRICT-PAYLOAD</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-02</span>
      </div>
    </SlideLayout>
  );
}
