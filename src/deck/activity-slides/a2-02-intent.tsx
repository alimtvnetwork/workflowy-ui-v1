import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-2 · Capture" title="Stage 1 — Intent"
      subtitle="Action handler builds an ActivityIntent. Clock is injected. No `new Date()` here.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`// src/features/editor/actions/moveItem.ts
import { captureEvent } from '@/features/activity/captureEvent';

export async function moveItem(args: {
  itemId: ItemId; toParent: ItemId | null; toSortOrder: string;
}): Promise<void> {
  const prev = await idb.get('Item', args.itemId, ItemSchema);
  if (!prev) throw new DomainError({ code: 'ITM-NOT-FOUND' });

  await captureEvent({
    EventType:    'ItemMoved',
    ActorUserId:  session.userId,
    TargetItemId: args.itemId,
    ParentItemId: args.toParent,
    PageItemId:   resolvePageRoot(args.itemId),
    OccurredAt:   clock.nowIso(),    // ← injected, mockable
    Payload: {
      PrevParentItemId: prev.ParentItemId,
      NextParentItemId: args.toParent,
      PrevSortOrder:    prev.SortOrder,
      NextSortOrder:    args.toSortOrder,
    },
  });
}`}
      </pre>
      <p className="mt-6 text-base text-muted-foreground">
        Note what's <em>not</em> here: no IDB write, no API call, no SSE emit.
        The handler's only job is to assemble a valid intent and hand it to the
        chokepoint. Everything downstream is the chokepoint's responsibility.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-CP-INJECTED-CLOCK</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">ADR-0027 (clock)</span>
      </div>
    </SlideLayout>
  );
}
