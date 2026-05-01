import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase S-4 · Backend" title="Cross-workspace fan-out — sequential, application-merged"
      subtitle="Cross-DB SQL joins are forbidden. The PHP layer issues one query per accessible App DB and merges in memory.">
      <StepList items={[
        { kicker: "1", title: "Resolve accessible workspaces",
          body: "Read WorkspaceMember from Root DB for the caller. Foreign workspaces silently skipped." },
        { kicker: "2", title: "Issue per-DB rank query",
          body: "Single SELECT per App DB: Items_fts JOIN Items WHERE … ORDER BY bucket DESC, UpdatedAt DESC, OwnerId ASC LIMIT 250." },
        { kicker: "3", title: "Merge in PHP",
          body: "Concatenate per-DB hit lists, then re-bucket and re-sort by the same (bucket, UpdatedAt, OwnerId) tuple. Stable across runs." },
        { kicker: "4", title: "Trim to viewport cap",
          body: "Slice to 250. Total count reported separately for the '+N more' footer." },
        { kicker: "5", title: "Return PascalCase envelope",
          body: "{ Status, Attributes, Results: { Hits[], NextCursor, TookMs } } — Errors is omit-never-null on success." },
      ]} />
    </SlideLayout>
  );
}
