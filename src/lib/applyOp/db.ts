// Tiny IndexedDB wrapper — no deps. Two stores: `items`, `ops` (the journal).
import type { Item, Op } from "./types";

const DB_NAME = "spec-applyop-playground";
const DB_VERSION = 1;

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

export async function resetAll() {
  await itemsStore.clear();
  await opsStore.clear();
}
