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
