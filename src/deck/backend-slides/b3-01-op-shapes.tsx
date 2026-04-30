import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-3 · Sync" title="Op shapes" subtitle="A small, closed set of operation types. Every edit serializes to one of these.">
      <SqlBlock caption="Discriminated union by `op`. Each op carries the minimum fields the server needs to apply LWW correctly. `clientOpId` is the client's idempotency key.">{`type Op =
  | { op: "create";   clientOpId: string; itemId: number; parentItemId: number|null;
                      itemTypeId: number; content: string; fractionalIndex: string;
                      ts: string /* ISO8601 client clock */ }
  | { op: "update";   clientOpId: string; itemId: number;
                      fields: Partial<{ content: string; itemTypeId: number;
                                        dueDate: string|null; completedAt: string|null }>;
                      ts: string }
  | { op: "move";     clientOpId: string; itemId: number;
                      parentItemId: number|null; fractionalIndex: string; ts: string }
  | { op: "delete";   clientOpId: string; itemId: number; ts: string }
  | { op: "restore";  clientOpId: string; itemId: number; ts: string }
  | { op: "mirror";   clientOpId: string; mirrorItemId: number; sourceItemId: number;
                      parentItemId: number|null; fractionalIndex: string; ts: string }
  | { op: "tag";      clientOpId: string; itemId: number; tagId: number; ts: string }
  | { op: "untag";    clientOpId: string; itemId: number; tagId: number; ts: string };

interface SyncRequest  { ops: Op[]; cursor: string | null }
interface SyncResponse { newCursor: string; remoteOps: Op[]; conflicts: ConflictInfo[] }`}</SqlBlock>
    </SlideLayout>
  );
}
