// Feedback report reference impl — models spec/33-feedback-report/.
// Single file: schema + transition matrix + persistence + capture chokepoint.
// Lives in `src/lib/applyOp/` so it shares the IndexedDB lifecycle with the
// other reference impls. The WordPress plugin's FeedbackController.php is the
// production target.

import { openDb } from "./db";

export type FeedbackType = "Bug" | "Idea" | "Praise" | "Question";
export type FeedbackStatus =
  | "New" | "Triaged" | "InProgress" | "Resolved" | "WontFix" | "Duplicate";

export const FEEDBACK_TYPES: FeedbackType[] = ["Bug", "Idea", "Praise", "Question"];
export const FEEDBACK_STATUSES: FeedbackStatus[] = [
  "New", "Triaged", "InProgress", "Resolved", "WontFix", "Duplicate",
];
export const TERMINAL_STATUSES: ReadonlyArray<FeedbackStatus> = ["Resolved", "WontFix", "Duplicate"];

/** Spec 33-01: closed transition matrix — terminal states have no outbound edges. */
export const TRANSITIONS: Record<FeedbackStatus, ReadonlyArray<FeedbackStatus>> = {
  New:        ["Triaged", "InProgress", "WontFix", "Duplicate"],
  Triaged:    ["InProgress", "Resolved", "WontFix", "Duplicate"],
  InProgress: ["Resolved", "WontFix", "Duplicate"],
  Resolved:   [],
  WontFix:    [],
  Duplicate:  [],
};

export interface Diagnostics {
  ClientBuildSha: string;
  CurrentItemId: string | null;
  BreadcrumbPath: string[];
  Route: string;
  ViewportPx: { Width: number; Height: number };
  UserAgent: string;
}

export interface FeedbackReport {
  FeedbackReportId: number;
  SubmittedByUserId: string;
  FeedbackType: FeedbackType;
  Title: string;
  Body: string;
  DiagnosticsJson: string;
  ScreenshotBlobRef: string | null;
  Status: FeedbackStatus;
  SubmittedAt: string;
  ResolvedAt: string | null;
  PurgeAfter: string;
}

const STORE = "feedbackReports";
const RETENTION_MS = 90 * 86400_000;

const listeners = new Set<() => void>();
export function subscribeFeedback(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
function notify() { listeners.forEach((l) => l()); }

export interface SubmitFeedbackInput {
  FeedbackType: FeedbackType;
  Title: string;
  Body: string;
  Diagnostics: Diagnostics;
  ScreenshotBlobRef?: string | null;
  SubmittedByUserId?: string;
}

/** Validation mirrors SQL CHECK constraints (spec 33-01 §G-33-DM-LENGTH-MIRROR). */
export function validateFeedback(input: SubmitFeedbackInput): string | null {
  if (!FEEDBACK_TYPES.includes(input.FeedbackType)) return "Invalid FeedbackType";
  const titleLen = input.Title.trim().length;
  if (titleLen < 1 || titleLen > 120) return "Title must be 1–120 chars";
  const bodyLen = input.Body.trim().length;
  if (bodyLen < 1 || bodyLen > 2000) return "Body must be 1–2000 chars";
  return null;
}

export async function submitFeedback(input: SubmitFeedbackInput): Promise<FeedbackReport> {
  const err = validateFeedback(input);
  if (err) throw new Error(err);
  const submittedAt = new Date().toISOString();
  const purgeAfter = new Date(Date.now() + RETENTION_MS).toISOString();
  const row: Omit<FeedbackReport, "FeedbackReportId"> = {
    SubmittedByUserId: input.SubmittedByUserId ?? "user-1",
    FeedbackType: input.FeedbackType,
    Title: input.Title.trim(),
    Body: input.Body.trim(),
    DiagnosticsJson: JSON.stringify(input.Diagnostics),
    ScreenshotBlobRef: input.ScreenshotBlobRef ?? null,
    Status: "New",
    SubmittedAt: submittedAt,
    ResolvedAt: null,
    PurgeAfter: purgeAfter,
  };
  const db = await openDb();
  return new Promise<FeedbackReport>((resolve, reject) => {
    const t = db.transaction([STORE], "readwrite");
    const req = t.objectStore(STORE).add(row);
    req.onsuccess = () => {
      const full: FeedbackReport = { ...row, FeedbackReportId: req.result as number };
      notify();
      resolve(full);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function listFeedback(opts?: {
  status?: FeedbackStatus;
  type?: FeedbackType;
}): Promise<FeedbackReport[]> {
  const db = await openDb();
  return new Promise<FeedbackReport[]>((resolve, reject) => {
    const t = db.transaction([STORE], "readonly");
    const req = t.objectStore(STORE).getAll();
    req.onsuccess = () => {
      let rows = req.result as FeedbackReport[];
      if (opts?.status) rows = rows.filter((r) => r.Status === opts.status);
      if (opts?.type) rows = rows.filter((r) => r.FeedbackType === opts.type);
      rows.sort((a, b) => (a.SubmittedAt < b.SubmittedAt ? 1 : -1));
      resolve(rows);
    };
    req.onerror = () => reject(req.error);
  });
}

/** Enforces the transition matrix; throws on illegal transitions. */
export async function transitionFeedback(
  id: number,
  to: FeedbackStatus,
): Promise<FeedbackReport> {
  const db = await openDb();
  const cur = await new Promise<FeedbackReport | undefined>((resolve, reject) => {
    const t = db.transaction([STORE], "readonly");
    const req = t.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as FeedbackReport | undefined);
    req.onerror = () => reject(req.error);
  });
  if (!cur) throw new Error(`Feedback #${id} not found`);
  const allowed = TRANSITIONS[cur.Status];
  if (!allowed.includes(to)) {
    throw new Error(`Illegal transition: ${cur.Status} → ${to}`);
  }
  const next: FeedbackReport = {
    ...cur,
    Status: to,
    ResolvedAt: TERMINAL_STATUSES.includes(to) ? new Date().toISOString() : cur.ResolvedAt,
  };
  return new Promise<FeedbackReport>((resolve, reject) => {
    const t = db.transaction([STORE], "readwrite");
    const req = t.objectStore(STORE).put(next);
    req.onsuccess = () => { notify(); resolve(next); };
    req.onerror = () => reject(req.error);
  });
}

export async function purgeExpiredFeedback(nowMs = Date.now()): Promise<number> {
  const all = await listFeedback();
  const expired = all.filter((r) => new Date(r.PurgeAfter).getTime() < nowMs);
  if (expired.length === 0) return 0;
  const db = await openDb();
  await Promise.all(expired.map((r) => new Promise<void>((resolve, reject) => {
    const t = db.transaction([STORE], "readwrite");
    const req = t.objectStore(STORE).delete(r.FeedbackReportId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  })));
  notify();
  return expired.length;
}

export async function clearFeedback(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction([STORE], "readwrite");
    const req = t.objectStore(STORE).clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  notify();
}

/** Pure helper used by the form — builds a synthetic Diagnostics object. */
export function captureDiagnostics(): Diagnostics {
  return {
    ClientBuildSha: "abc1234",
    CurrentItemId: null,
    BreadcrumbPath: [],
    Route: typeof window !== "undefined" ? window.location.pathname : "/",
    ViewportPx: {
      Width: typeof window !== "undefined" ? window.innerWidth : 0,
      Height: typeof window !== "undefined" ? window.innerHeight : 0,
    },
    UserAgent: typeof navigator !== "undefined" ? navigator.userAgent : "node",
  };
}
