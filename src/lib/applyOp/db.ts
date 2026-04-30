// Tiny IndexedDB wrapper — no deps. Stores: items, ops, mirrorMembers, shares, boardColumns, syncQueue.
import type { BoardColumn, Item, MirrorMember, Op, ShareGrant } from "./types";
import type { QueuedOp } from "./syncQueue";

const DB_NAME = "spec-applyop-playground";
const DB_VERSION = 3;

let _db: IDBDatabase | null = null;

export function openDb(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("items")) {
        const s = db.createObjectStore("items", { keyPath: "Id" });
        s.createIndex("ParentId", "ParentId", { unique: false });
      }
      if (!db.objectStoreNames.contains("ops")) {
        db.createObjectStore("ops", { keyPath: "OpId" });
      }
      if (!db.objectStoreNames.contains("mirrorMembers")) {
        const s = db.createObjectStore("mirrorMembers", { keyPath: ["PeerGroupId", "ItemId"] });
        s.createIndex("PeerGroupId", "PeerGroupId", { unique: false });
        s.createIndex("ItemId", "ItemId", { unique: false });
      }
      if (!db.objectStoreNames.contains("shares")) {
        const s = db.createObjectStore("shares", { keyPath: "ShareId" });
        s.createIndex("ItemId", "ItemId", { unique: false });
      }
      if (!db.objectStoreNames.contains("boardColumns")) {
        const s = db.createObjectStore("boardColumns", { keyPath: "ColumnId" });
        s.createIndex("BoardItemId", "BoardItemId", { unique: false });
      }
      if (!db.objectStoreNames.contains("syncQueue")) {
        const s = db.createObjectStore("syncQueue", { keyPath: "QueueId" });
        s.createIndex("LocalSeq", "LocalSeq", { unique: false });
      }
    };
    req.onsuccess = () => {
      _db = req.result;
      resolve(_db);
    };
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(
  stores: string[],
  mode: IDBTransactionMode,
  fn: (t: IDBTransaction) => Promise<T> | T,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(stores, mode);
        let result: T;
        t.oncomplete = () => resolve(result);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error ?? new Error("tx aborted"));
        Promise.resolve(fn(t)).then(
          (r) => { result = r; },
          (err) => { try { t.abort(); } catch { /* noop */ } reject(err); },
        );
      }),
  );
}

const wrap = <T>(req: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

export const itemsStore = {
  getAll: () => tx(["items"], "readonly", (t) => wrap(t.objectStore("items").getAll() as IDBRequest<Item[]>)),
  get: (id: string) => tx(["items"], "readonly", (t) => wrap(t.objectStore("items").get(id) as IDBRequest<Item | undefined>)),
  put: (item: Item) => tx(["items"], "readwrite", (t) => wrap(t.objectStore("items").put(item))),
  delete: (id: string) => tx(["items"], "readwrite", (t) => wrap(t.objectStore("items").delete(id))),
  clear: () => tx(["items"], "readwrite", (t) => wrap(t.objectStore("items").clear())),
};

export const opsStore = {
  getAll: () => tx(["ops"], "readonly", (t) => wrap(t.objectStore("ops").getAll() as IDBRequest<Op[]>)),
  put: (op: Op) => tx(["ops"], "readwrite", (t) => wrap(t.objectStore("ops").put(op))),
  clear: () => tx(["ops"], "readwrite", (t) => wrap(t.objectStore("ops").clear())),
};

export const mirrorMembersStore = {
  getAll: () => tx(["mirrorMembers"], "readonly", (t) => wrap(t.objectStore("mirrorMembers").getAll() as IDBRequest<MirrorMember[]>)),
  put: (m: MirrorMember) => tx(["mirrorMembers"], "readwrite", (t) => wrap(t.objectStore("mirrorMembers").put(m))),
  delete: (peerGroupId: string, itemId: string) =>
    tx(["mirrorMembers"], "readwrite", (t) => wrap(t.objectStore("mirrorMembers").delete([peerGroupId, itemId]))),
  clear: () => tx(["mirrorMembers"], "readwrite", (t) => wrap(t.objectStore("mirrorMembers").clear())),
};

export const sharesStore = {
  getAll: () => tx(["shares"], "readonly", (t) => wrap(t.objectStore("shares").getAll() as IDBRequest<ShareGrant[]>)),
  get: (id: string) => tx(["shares"], "readonly", (t) => wrap(t.objectStore("shares").get(id) as IDBRequest<ShareGrant | undefined>)),
  put: (s: ShareGrant) => tx(["shares"], "readwrite", (t) => wrap(t.objectStore("shares").put(s))),
  clear: () => tx(["shares"], "readwrite", (t) => wrap(t.objectStore("shares").clear())),
};

export const boardColumnsStore = {
  getAll: () => tx(["boardColumns"], "readonly", (t) => wrap(t.objectStore("boardColumns").getAll() as IDBRequest<BoardColumn[]>)),
  put: (c: BoardColumn) => tx(["boardColumns"], "readwrite", (t) => wrap(t.objectStore("boardColumns").put(c))),
  clear: () => tx(["boardColumns"], "readwrite", (t) => wrap(t.objectStore("boardColumns").clear())),
};

export const syncQueueStore = {
  getAll: () => tx(["syncQueue"], "readonly", (t) => wrap(t.objectStore("syncQueue").getAll() as IDBRequest<QueuedOp[]>)),
  put: (q: QueuedOp) => tx(["syncQueue"], "readwrite", (t) => wrap(t.objectStore("syncQueue").put(q))),
  delete: (queueId: string) => tx(["syncQueue"], "readwrite", (t) => wrap(t.objectStore("syncQueue").delete(queueId))),
  clear: () => tx(["syncQueue"], "readwrite", (t) => wrap(t.objectStore("syncQueue").clear())),
};

export async function resetAll() {
  await itemsStore.clear();
  await opsStore.clear();
  await mirrorMembersStore.clear();
  await sharesStore.clear();
  await boardColumnsStore.clear();
  await syncQueueStore.clear();
}
