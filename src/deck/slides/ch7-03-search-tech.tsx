import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 7 · Endpoints & DB" title="Search behind the scenes">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/search?q=&limit=", purpose: "Ranked items + tags + commands" },
            { method: "GET", path: "/wf/v1/search/recent", purpose: "Recently visited items for empty state" },
            { method: "POST", path: "/wf/v1/saved-searches", purpose: "Persist a query (⌘⇧S)" },
          ]}
        />
        <DbTable
          tables={[
            { table: "Item (FTS index)", columns: ["Content tokenised", "ItemId", "OwnerUserId"], note: "Workspace-scoped FTS5 virtual table" },
            { table: "Tag", columns: ["TagId", "Name UK"], note: "Resolves #tag operator" },
            { table: "Mention", columns: ["MentionedUserId"], note: "Resolves @user operator" },
            { table: "SavedSearch (App DB)", columns: ["Query", "OwnerUserId", "CreatedAt"], note: "Sidebar pin" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
