import { SlideLayout } from "../SlideLayout";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout
      chapter="Chapter 1 · Item model"
      title="What lives on every Item row"
      subtitle="One table powers the entire app. The columns below show up again and again."
    >
      <DbTable
        tables={[
          { table: "Item.ItemId", columns: ["INTEGER PK"], note: "Stable identity. Never changes once created." },
          { table: "Item.ParentItemId", columns: ["FK → Item.ItemId", "NULL = root"], note: "Forms the tree." },
          { table: "Item.ItemTypeId", columns: ["FK → ItemType"], note: "Bullet · Note · Task · BoardProject · …" },
          { table: "Item.Content", columns: ["TEXT (rich)"], note: "The line you see." },
          { table: "Item.FractionalIndex", columns: ["TEXT"], note: "Sibling order without renumbering." },
          { table: "Item.MirrorOfItemId", columns: ["FK → Item", "NULL = canonical"], note: "If set, this is a mirror placeholder." },
          { table: "Item.CompletedAt / DueDate", columns: ["TEXT"], note: "Task semantics on any item." },
          { table: "Item.DeletedAt", columns: ["TEXT NULL"], note: "Soft-delete; reaper hard-deletes after 30d." },
        ]}
      />
    </SlideLayout>
  );
}
