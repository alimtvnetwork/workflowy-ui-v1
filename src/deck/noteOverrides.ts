// localStorage-backed per-slide note overrides.
// Override > hand-written (notes.ts) > generated (notes.generated.ts).

const KEY = "deck.noteOverrides.v1";

type Map = Record<string, string>;

function read(): Map {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Map) : {};
  } catch {
    return {};
  }
}

function write(map: Map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode — silently ignore */
  }
}

export function getOverride(slideId: string): string | undefined {
  return read()[slideId];
}

export function getAllOverrides(): Map {
  return read();
}

export function setOverride(slideId: string, text: string) {
  const m = read();
  m[slideId] = text;
  write(m);
}

export function clearOverride(slideId: string) {
  const m = read();
  delete m[slideId];
  write(m);
}

export function clearAllOverrides() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KEY);
}

export function exportOverridesAsJson(): string {
  return JSON.stringify(read(), null, 2);
}

export interface ImportResult {
  ok: boolean;
  imported: number;
  skipped: number;
  total: number;
  error?: string;
}

/**
 * Merge or replace overrides from a JSON blob. Accepts either:
 *   { "<slideId>": "<note text>", ... }
 * or the same shape nested under a top-level `overrides` key (forward-compat).
 *
 * Skips entries whose key or value is not a non-empty string.
 */
export function importOverridesFromJson(
  json: string,
  opts: { mode: "merge" | "replace" } = { mode: "merge" },
): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { ok: false, imported: 0, skipped: 0, total: 0, error: "Invalid JSON" };
  }
  const raw =
    parsed && typeof parsed === "object" && !Array.isArray(parsed) && "overrides" in (parsed as Record<string, unknown>)
      ? (parsed as { overrides: unknown }).overrides
      : parsed;

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, imported: 0, skipped: 0, total: 0, error: "Expected an object of slideId → text" };
  }

  const incoming = raw as Record<string, unknown>;
  const next: Map = opts.mode === "replace" ? {} : { ...read() };
  let imported = 0;
  let skipped = 0;
  const total = Object.keys(incoming).length;

  for (const [k, v] of Object.entries(incoming)) {
    if (typeof k !== "string" || !k.trim() || typeof v !== "string" || !v.trim()) {
      skipped++;
      continue;
    }
    next[k] = v;
    imported++;
  }

  write(next);
  return { ok: true, imported, skipped, total };
}

