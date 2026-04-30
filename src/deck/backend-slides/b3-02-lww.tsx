import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-3 · LWW" title="Last-Write-Wins resolution" subtitle="Per (Item, field). Tiebreak by (ts, ActorUserId, clientOpId) to be deterministic.">
      <SqlBlock caption="Server clock is authoritative for ordering ties. Client `ts` only contributes the primary timestamp. The compare function below runs for every field touched by every op.">{`function lwwApply(currentTs: string, currentActor: number,
                  incomingTs: string, incomingActor: number,
                  incomingClientOpId: string,
                  currentClientOpId: string|null): "keep" | "overwrite" {
  if (incomingTs > currentTs) return "overwrite";
  if (incomingTs < currentTs) return "keep";
  // tiebreak 1: higher userId wins (stable across replicas)
  if (incomingActor > currentActor) return "overwrite";
  if (incomingActor < currentActor) return "keep";
  // tiebreak 2: lexicographic clientOpId (UUIDv7 → time-ordered)
  return incomingClientOpId > (currentClientOpId ?? "") ? "overwrite" : "keep";
}

// Applied per field, not per row. Two clients editing different fields of the
// same Item never conflict — both writes land. Only same-field edits race.

// Stored alongside Item:
//   ItemFieldStamp(ItemId, FieldName, LastTs, LastActorUserId, LastClientOpId)
// One row per (Item, edited field). Cheap because most items have ≤ 5 stamps.`}</SqlBlock>
    </SlideLayout>
  );
}
