import { SlideLayout } from "../SlideLayout";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 22 · Key constraints" title="The invariants every implementation enforces">
      <DbTable
        tables={[
          { table: "C1 · Mirror depth", columns: ["MirrorOfItemId source must itself be canonical"], note: "No mirror-of-mirror (D7)" },
          { table: "C2 · Cycle prevention", columns: ["Item cannot be its own ancestor"], note: "Checked on every move" },
          { table: "C3 · 30-day reaper", columns: ["DeletedAt < now-30d → hard delete"], note: "Daily background job" },
          { table: "C4 · Workspace owner", columns: ["≥1 Owner per workspace"], note: "Last-owner revoke is rejected" },
          { table: "C5 · Share grantee", columns: ["GranteeUserId XOR GranteeEmail"], note: "DB CHECK constraint" },
          { table: "C6 · Tag uniqueness", columns: ["UNIQUE(ItemId, TagId)"], note: "No duplicate tag rows" },
          { table: "C7 · Membership uniqueness", columns: ["UNIQUE(UserId, WorkspaceId)"], note: "Join a workspace once" },
        ]}
      />
    </SlideLayout>
  );
}
