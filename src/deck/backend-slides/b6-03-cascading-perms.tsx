import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-6 · Sharing" title="Cascading permissions" subtitle="Permissions are stored at the item level and inherited down the subtree. The effective permission for any item is the strongest one found on its ancestor chain.">
      <SqlBlock caption="A recursive CTE resolves effective access in a single query. We cache the result per (userId, itemId) for 60 s in an in-memory LRU; cache is invalidated by any share/unshare op on an ancestor.">{`-- Schema
CREATE TABLE item_shares (
  itemId      INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  granteeId   INTEGER NOT NULL,           -- userId OR groupId; disambiguated by granteeKind
  granteeKind TEXT NOT NULL CHECK (granteeKind IN ('user','group','link')),
  permission  TEXT NOT NULL CHECK (permission IN ('read','comment','write','admin')),
  grantedAt   TEXT NOT NULL,
  grantedBy   INTEGER NOT NULL,
  PRIMARY KEY (itemId, granteeId, granteeKind)
);
CREATE INDEX idx_shares_grantee ON item_shares(granteeId, granteeKind);

-- Resolve effective permission for (user, item).
WITH RECURSIVE chain(id, parentItemId, depth) AS (
  SELECT id, parentItemId, 0 FROM items WHERE id = :itemId
  UNION ALL
  SELECT i.id, i.parentItemId, c.depth + 1
    FROM items i JOIN chain c ON i.id = c.parentItemId
)
SELECT MAX(  -- ranked: admin > write > comment > read
  CASE permission
    WHEN 'admin'   THEN 4
    WHEN 'write'   THEN 3
    WHEN 'comment' THEN 2
    WHEN 'read'    THEN 1
  END) AS rank
FROM chain c
JOIN item_shares s ON s.itemId = c.id
WHERE (s.granteeKind = 'user'  AND s.granteeId = :userId)
   OR (s.granteeKind = 'group' AND s.granteeId IN (SELECT groupId FROM user_groups WHERE userId = :userId));

-- Revoke cascades implicitly: deleting a share row drops the grant on the
-- entire subtree because resolution always walks ancestors at read time.`}</SqlBlock>
    </SlideLayout>
  );
}
