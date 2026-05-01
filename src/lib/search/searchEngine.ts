// Reference search engine that mirrors the spec contracts:
//   - spec/32-ui-design/06-workflowy-ui/02-search/06-query-grammar.md  (subset)
//   - spec/31-app/01-features/16-search-ranking.md                    (full algorithm)
//
// Subset of grammar implemented (covers the AT-SR-* acceptance suite):
//   Term     := Negated | KeyValue | Standalone | FreeText
//   KeyValue := ("is"|"has"|"text"|"highlight") ":" UnquotedAtom
//   Standalone := "today" | "yesterday" | "this-week" | "last-week"
//   Negated  := "-" Term
//
// Out of scope (left as future work, called out via tokenIssue):
//   in:, @mention, date:, day-of-week, quoted strings with spaces, OR keyword.

import type { Item } from "@/lib/applyOp/types";

export type TokenKind =
  | "free"          // bare word — substring match against Content / Note
  | "is"            // is:todo, is:complete, is:starred, is:trashed
  | "has"           // has:note, has:date  (limited set)
  | "text"          // text:phrase (same as free, but quoted intent)
  | "highlight"     // highlight:<color>  (always a no-op match here — no Color column)
  | "standalone"    // today, yesterday, this-week, last-week
  | "unsupported";  // recognised but not implementable on the local store

export interface ParsedToken {
  Raw: string;
  Kind: TokenKind;
  Key?: string;                       // for KeyValue: the key
  Value: string;                      // normalised value or the bare word
  Negated: boolean;
  /** Human-readable reason if Kind = "unsupported". */
  Issue?: string;
}

export interface ParsedQuery {
  Tokens: ParsedToken[];
  /** Free-text terms only (after lowercasing) — used for the relevance tier check. */
  TextTerms: string[];
}

const STANDALONES = new Set([
  "today", "yesterday", "tomorrow",
  "this-week", "last-week", "next-week",
  "this-month", "last-month", "next-month",
]);

const SUPPORTED_KEYS = new Set(["is", "has", "text", "highlight"]);
const UNSUPPORTED_KEYS = new Set([
  "in", "date", "date-before", "date-after", "day-of-week",
  "changed", "created", "link",
]);

export function parseQuery(raw: string): ParsedQuery {
  const tokens: ParsedToken[] = [];
  const textTerms: string[] = [];
  const parts = raw.trim().split(/\s+/).filter(Boolean);

  for (const part of parts) {
    const negated = part.startsWith("-");
    const body = negated ? part.slice(1) : part;
    if (!body) continue;

    const colon = body.indexOf(":");
    if (colon > 0) {
      const key = body.slice(0, colon).toLowerCase();
      const value = body.slice(colon + 1).toLowerCase();
      if (SUPPORTED_KEYS.has(key)) {
        tokens.push({ Raw: part, Kind: key as TokenKind, Key: key, Value: value, Negated: negated });
        continue;
      }
      if (UNSUPPORTED_KEYS.has(key)) {
        tokens.push({
          Raw: part, Kind: "unsupported", Key: key, Value: value, Negated: negated,
          Issue: `${key}: needs server-side fan-out (cross-DB or scope ID resolution)`,
        });
        continue;
      }
      // Unknown key — treat as free text including the colon (lenient, matches spec note).
      tokens.push({ Raw: part, Kind: "free", Value: body.toLowerCase(), Negated: negated });
      if (!negated) textTerms.push(body.toLowerCase());
      continue;
    }

    const lower = body.toLowerCase();
    if (STANDALONES.has(lower)) {
      tokens.push({ Raw: part, Kind: "standalone", Value: lower, Negated: negated });
      continue;
    }

    tokens.push({ Raw: part, Kind: "free", Value: lower, Negated: negated });
    if (!negated) textTerms.push(lower);
  }

  return { Tokens: tokens, TextTerms: textTerms };
}

// ===========================================================================
// Filter pass — removes anything ineligible BEFORE scoring (per §16.1).
// ===========================================================================

export interface FilterResult {
  PassesFilter: boolean;
  /** Why a candidate was excluded — useful for the UI's "filter trace". */
  Reason?: string;
}

export function applyFilters(item: Item, q: ParsedQuery, nowIso: string): FilterResult {
  // Trash/completed default-exclusion (AT-SR-04).
  const wantsTrashed = q.Tokens.some((t) => t.Kind === "is" && t.Value === "trashed" && !t.Negated);
  const wantsCompleted = q.Tokens.some((t) => t.Kind === "is" && t.Value === "complete" && !t.Negated);
  if (item.TrashedAt && !wantsTrashed) return { PassesFilter: false, Reason: "trashed" };
  if (item.IsCompleted && !wantsCompleted) return { PassesFilter: false, Reason: "completed" };

  for (const t of q.Tokens) {
    const matched = matchToken(item, t, nowIso);
    if (t.Negated && matched) return { PassesFilter: false, Reason: `negated ${t.Raw}` };
    if (!t.Negated && t.Kind !== "free" && t.Kind !== "text" && t.Kind !== "unsupported" && !matched) {
      return { PassesFilter: false, Reason: `missing ${t.Raw}` };
    }
  }
  return { PassesFilter: true };
}

function matchToken(item: Item, t: ParsedToken, nowIso: string): boolean {
  switch (t.Kind) {
    case "is": {
      switch (t.Value) {
        case "todo":      return item.ItemType === "Bullet" && !item.IsCompleted;
        case "complete":  return item.IsCompleted;
        case "trashed":   return item.TrashedAt !== null;
        case "starred":   return item.Tags.includes("starred");
        case "shared":    return item.Tags.includes("shared");
        case "mirror":    return item.PeerGroupId !== null;
        case "template":  return item.Tags.includes("template");
        case "heading":   return item.Tags.includes("heading");
        default:          return false;
      }
    }
    case "has": {
      switch (t.Value) {
        case "note": return (item.Note ?? "").length > 0;
        case "date": return item.Tags.some((x) => x.startsWith("date:"));
        case "tag":  return item.Tags.length > 0;
        default:     return false;
      }
    }
    case "highlight":  return false; // local store has no color column — always misses
    case "standalone": return matchStandaloneDate(item.UpdatedAt, t.Value, nowIso);
    case "free":
    case "text":       return substringHit(item, t.Value);
    case "unsupported": return true; // do not filter out; we already reported the issue
  }
}

function matchStandaloneDate(iso: string, kw: string, nowIso: string): boolean {
  const d = new Date(iso);
  const now = new Date(nowIso);
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const ms = d.getTime();
  const today0 = startOfDay(now);
  const day = 86_400_000;
  switch (kw) {
    case "today":      return ms >= today0 && ms < today0 + day;
    case "yesterday":  return ms >= today0 - day && ms < today0;
    case "tomorrow":   return ms >= today0 + day && ms < today0 + 2 * day;
    case "this-week":  return ms >= today0 - 6 * day && ms < today0 + day;
    case "last-week":  return ms >= today0 - 13 * day && ms < today0 - 6 * day;
    default:           return false;
  }
}

function substringHit(item: Item, needle: string): boolean {
  if (!needle) return true;
  return item.Content.toLowerCase().includes(needle)
      || (item.Note ?? "").toLowerCase().includes(needle);
}

// ===========================================================================
// Scoring — implements §16.1 verbatim:
//   Field score by match kind (highest wins):
//     Exact phrase, whole field    → 100
//     Exact phrase, substring      →  80
//     All terms present, in order  →  60
//     All terms present, any order →  40
//     Some terms present (≥1)      →  20
//   Field weight: Content × 1.5, Note × 1.0
//   Final = max field-score across {Content, Note}.
// ===========================================================================

export type MatchKind = "exact-whole" | "exact-substring" | "all-in-order" | "all-any-order" | "some" | "none";

const TIER: Record<MatchKind, number> = {
  "exact-whole":   100,
  "exact-substring": 80,
  "all-in-order":   60,
  "all-any-order":  40,
  "some":           20,
  "none":            0,
};

export interface FieldScore {
  Field: "Content" | "Note";
  Kind: MatchKind;
  Tier: number;
  Weight: number;
  Score: number;
}

export interface ScoredItem {
  Item: Item;
  Fields: FieldScore[];
  Score: number;        // max(field.Score)
  Bucket: number;       // floor(Score / 20), capped at 5
}

export function scoreItem(item: Item, q: ParsedQuery): ScoredItem {
  // No free-text terms → filter-only query (AT note: score = 60 for everything that passes).
  if (q.TextTerms.length === 0) {
    const f: FieldScore = { Field: "Content", Kind: "all-in-order", Tier: 60, Weight: 1.5, Score: 60 };
    return { Item: item, Fields: [f], Score: 60, Bucket: 3 };
  }

  const fields: FieldScore[] = [
    fieldScore("Content", item.Content, q.TextTerms, 1.5),
    fieldScore("Note",    item.Note ?? "", q.TextTerms, 1.0),
  ];
  const max = fields.reduce((m, f) => (f.Score > m ? f.Score : m), 0);
  return { Item: item, Fields: fields, Score: max, Bucket: Math.min(5, Math.floor(max / 20)) };
}

function fieldScore(field: "Content" | "Note", text: string, terms: string[], weight: number): FieldScore {
  const t = text.toLowerCase();
  const phrase = terms.join(" ");
  const kind = matchKind(t, phrase, terms);
  const tier = TIER[kind];
  return { Field: field, Kind: kind, Tier: tier, Weight: weight, Score: tier * weight };
}

function matchKind(text: string, phrase: string, terms: string[]): MatchKind {
  if (!text) return "none";
  if (text === phrase) return "exact-whole";
  if (text.includes(phrase) && phrase.length > 0) return "exact-substring";

  const positions = terms.map((tm) => text.indexOf(tm));
  if (positions.every((p) => p >= 0)) {
    const sorted = [...positions].sort((a, b) => a - b);
    const inOrder = positions.every((p, i) => p === sorted[i]);
    return inOrder ? "all-in-order" : "all-any-order";
  }
  if (positions.some((p) => p >= 0)) return "some";
  return "none";
}

// ===========================================================================
// Bucket sort — relevance bucket DESC, UpdatedAt DESC, OwnerId-equivalent ASC.
// Local store has no OwnerId, so we tiebreak on Item.Id (deterministic).
// ===========================================================================

export interface Buckets {
  Buckets: Map<number, ScoredItem[]>;
  /** Flattened, ranked output; the order the UI should render. */
  Ranked: ScoredItem[];
}

export function rank(scored: ScoredItem[]): Buckets {
  const buckets = new Map<number, ScoredItem[]>();
  for (const s of scored) {
    const arr = buckets.get(s.Bucket) ?? [];
    arr.push(s);
    buckets.set(s.Bucket, arr);
  }
  for (const [, arr] of buckets) {
    arr.sort((a, b) => {
      const t = b.Item.UpdatedAt.localeCompare(a.Item.UpdatedAt);
      return t !== 0 ? t : a.Item.Id.localeCompare(b.Item.Id);
    });
  }
  const orderedKeys = [...buckets.keys()].sort((a, b) => b - a);
  const ranked: ScoredItem[] = [];
  for (const k of orderedKeys) ranked.push(...(buckets.get(k) ?? []));
  return { Buckets: buckets, Ranked: ranked };
}

// ===========================================================================
// One-call wrapper used by the page.
// ===========================================================================

export interface SearchTrace {
  Query: ParsedQuery;
  TotalItems: number;
  ExcludedByFilter: number;
  ExcludeReasons: Map<string, number>;
  Buckets: Buckets;
  /** AT-SR I-SR-04: viewport cap of 250. Reported but not rendered beyond. */
  Cap: number;
}

export function search(items: Item[], rawQuery: string, nowIso: string = new Date().toISOString()): SearchTrace {
  const Query = parseQuery(rawQuery);
  const ExcludeReasons = new Map<string, number>();
  let ExcludedByFilter = 0;
  const passing: Item[] = [];

  for (const item of items) {
    const r = applyFilters(item, Query, nowIso);
    if (!r.PassesFilter) {
      ExcludedByFilter++;
      const k = r.Reason ?? "unknown";
      ExcludeReasons.set(k, (ExcludeReasons.get(k) ?? 0) + 1);
      continue;
    }
    passing.push(item);
  }

  const scored = passing.map((it) => scoreItem(it, Query)).filter((s) => s.Score > 0);
  const buckets = rank(scored);
  return {
    Query,
    TotalItems: items.length,
    ExcludedByFilter,
    ExcludeReasons,
    Buckets: buckets,
    Cap: 250,
  };
}
