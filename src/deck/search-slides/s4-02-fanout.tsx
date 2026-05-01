import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-4 · Backend" title="Cross-workspace fan-out — sequential, application-merged"
      subtitle="Cross-DB SQL joins are forbidden. The PHP layer issues one query per accessible App DB and merges in memory.">
      <StepList steps={[
        { action: "Resolve accessible workspaces",
          result: "Read WorkspaceMember from Root DB. Foreign workspaces silently skipped." },
        { action: "Issue per-DB rank query",
          result: "Single SELECT per App DB: ORDER BY bucket DESC, UpdatedAt DESC, OwnerId ASC LIMIT 250." },
        { action: "Merge in PHP",
          result: "Concatenate per-DB hits, re-bucket, re-sort by (bucket, UpdatedAt, OwnerId). Stable across runs." },
        { action: "Trim to viewport cap",
          result: "Slice to 250. Total count reported separately for the '+N more' footer." },
        { action: "Return PascalCase envelope",
          result: "{ Status, Attributes, Results: { Hits[], NextCursor, TookMs } }. Errors omit-never-null on success." },
      ]} />
    </SlideLayout>
  );
}
