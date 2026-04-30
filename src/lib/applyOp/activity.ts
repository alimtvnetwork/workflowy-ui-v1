// Activity-feed capture pipeline — models spec/34-activity-feed/.
// Single chokepoint: every applyOp call funnels through `recordActivity`,
// which validates intent and writes an ActivityEvent row. The feed UI reads
// from this same store via getFeed().
//
// Reference impl: client-side mock; the WordPress plugin's ActivityRecorder
// PHP class is the production target (see spec/34-activity-feed/02-capture-pipeline.md).

import { openDb } from "./db";
import type { OpKind } from "./types";

export type EventType =
  | "ItemCreated"
  | "ItemUpdated"
  | "ItemMoved"
  | "ItemDeleted"
  | "ItemRestored"
  | "ItemMirrored"
  | "BoardColumnReordered"
  | "TemplateApplied";

export interface ActivityEvent {
  ActivityEventId: number;
  EventType: EventType;
  ActorUserId: number;
  TargetItemId: string;
  ParentItemId: string | null;
  PageItemId: string;
  PayloadJson: string;
  OccurredAt: string;
  IngestedAt: string;
  Reversible: 0 | 1;
  /** OccurredAt + 30 days (spec §G-34-ES-PURGE-AFTER-COMPUTED). */
  PurgeAfter: string;
}

export interface ActivityIntent {
  EventType: EventType;
  ActorUserId: number;
  TargetItemId: string;
  ParentItemId: string | null;
  PageItemId: string;
  OccurredAt: string;
  Payload: unknown;
  Reversible?: boolean;
}

const STORE = "activityEvents";
const RETENTION_MS = 30 * 86400_000;

/** Invoked once on first import to ensure the store exists in the shared DB. */
async function ensureStore(): Promise<void> {
  // The store is created via DB upgrade in db.ts (DB_VERSION bump).
  await openDb();
}

/** Write one event to IndexedDB. Returns the assigned id. */
export async function recordActivity(intent: ActivityIntent): Promise<ActivityEvent> {
  await ensureStore();
  const db = await openDb();
  return new Promise<ActivityEvent>((resolve, reject) => {
    const t = db.transaction([STORE], "readwrite");
    const store = t.objectStore(STORE);
    const occurredMs = new Date(intent.OccurredAt).getTime();
    const event: Omit<ActivityEvent, "ActivityEventId"> = {
      EventType: intent.EventType,
      ActorUserId: intent.ActorUserId,
      TargetItemId: intent.TargetItemId,
      ParentItemId: intent.ParentItemId,
      PageItemId: intent.PageItemId,
      PayloadJson: JSON.stringify(intent.Payload ?? {}),
      OccurredAt: intent.OccurredAt,
      IngestedAt: new Date().toISOString(),
      Reversible: intent.Reversible === false ? 0 : 1,
      PurgeAfter: new Date(occurredMs + RETENTION_MS).toISOString(),
    };
    const req = store.add(event);
    req.onsuccess = () => {
      resolve({ ...event, ActivityEventId: req.result as number });
      notify();
    };
    req.onerror = () => reject(req.error);
  });
}

/** Returns the feed sorted newest-first, optionally filtered by page. */
export async function getFeed(opts?: { pageItemId?: string; limit?: number }): Promise<ActivityEvent[]> {
  await ensureStore();
  const db = await openDb();
  return new Promise<ActivityEvent[]>((resolve, reject) => {
    const t = db.transaction([STORE], "readonly");
    const req = t.objectStore(STORE).getAll();
    req.onsuccess = () => {
      let rows = req.result as ActivityEvent[];
      if (opts?.pageItemId) rows = rows.filter((e) => e.PageItemId === opts.pageItemId);
      rows.sort((a, b) => (a.OccurredAt < b.OccurredAt ? 1 : -1));
      if (opts?.limit) rows = rows.slice(0, opts.limit);
      resolve(rows);
    };
    req.onerror = () => reject(req.error);
  });
}

/** Purge events past their PurgeAfter — sim of the daily reaper. */
export async function purgeExpired(nowMs = Date.now()): Promise<number> {
  await ensureStore();
  const db = await openDb();
  return new Promise<number>((resolve, reject) => {
    const t = db.transaction([STORE], "readwrite");
    const req = t.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const rows = req.result as ActivityEvent[];
      const expired = rows.filter((e) => new Date(e.PurgeAfter).getTime() < nowMs);
      const store = db.transaction([STORE], "readwrite").objectStore(STORE);
      let done = 0;
      if (expired.length === 0) return resolve(0);
      for (const e of expired) {
        const d = store.delete(e.ActivityEventId);
        d.onsuccess = () => { done++; if (done === expired.length) { notify(); resolve(expired.length); } };
        d.onerror = () => reject(d.error);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearActivity(): Promise<void> {
  await ensureStore();
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const t = db.transaction([STORE], "readwrite");
    const req = t.objectStore(STORE).clear();
    req.onsuccess = () => { notify(); resolve(); };
    req.onerror = () => reject(req.error);
  });
}

// ---- Pub/sub for the UI ----
const listeners = new Set<() => void>();
export function subscribeActivity(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
function notify() { listeners.forEach((l) => l()); }

// ---- OpKind → EventType mapper used by the applyOp wrapper ----
const KIND_TO_EVENT: Partial<Record<OpKind, EventType>> = {
  "items.create": "ItemCreated",
  "items.update": "ItemUpdated",
  "items.move": "ItemMoved",
  "items.delete": "ItemDeleted",
  "items.restore": "ItemRestored",
  "mirrors.create": "ItemMirrored",
  "boards.moveCard": "ItemMoved",
};

export function eventTypeFor(kind: OpKind): EventType | null {
  return KIND_TO_EVENT[kind] ?? null;
}
