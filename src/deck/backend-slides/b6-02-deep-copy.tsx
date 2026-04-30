import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-6 · Templates" title="Deep-copy on instantiate" subtitle="Applying a template walks the snapshot, mints fresh DB IDs, rewrites parent pointers, and inserts everything in one transaction.">
      <SqlBlock caption="LocalId → newItemId map is built top-down so children always resolve their parent. Tags are looked up by name within the destination workspace, created if missing.">{`async function instantiateTemplate(
  tpl: TemplateSnapshot, parentItemId: number|null, actor: UserId
): Promise<number> {
  return db.transaction(() => {
    assertWrite(actor, parentItemId);
    const idMap = new Map<string, number>();   // localId → real itemId
    let rootId = 0;

    function walk(node: TemplateNode, dbParent: number|null) {
      const newId = nextItemId();
      idMap.set(node.localId, newId);
      if (dbParent === parentItemId && rootId === 0) rootId = newId;

      db.prepare(\`INSERT INTO items
          (id, parentItemId, itemTypeId, content, fractionalIndex,
           createdBy, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`)
        .run(newId, dbParent, node.itemTypeId, node.content,
             node.fractionalIndex, actor, now(), now());

      for (const tagName of node.tags ?? []) {
        const tagId = ensureTag(workspaceOf(parentItemId), tagName);
        db.prepare("INSERT INTO item_tags(itemId, tagId) VALUES (?, ?)")
          .run(newId, tagId);
      }
      for (const child of node.children ?? []) walk(child, newId);
    }
    walk(tpl.root, parentItemId);

    recordActivity(actor, "instantiate-template", rootId, { templateName: tpl.name });
    return rootId;
  });
}`}</SqlBlock>
    </SlideLayout>
  );
}
