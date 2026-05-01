// Seed corpus for /search-sim. Self-contained — does NOT touch IndexedDB
// because the sim is purely about parser + ranking semantics.
// 24 items chosen to exercise every tier of the §16.1 algorithm
// and every supported keyword from the grammar subset.

import type { Item } from "@/lib/applyOp/types";

const T = (daysAgo: number, hour = 12) => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

function mk(
  id: string,
  content: string,
  opts: {
    note?: string;
    type?: Item["ItemType"];
    completed?: boolean;
    starred?: boolean;
    mirror?: boolean;
    template?: boolean;
    trashed?: boolean;
    daysOld?: number;
  } = {},
): Item {
  const tags: string[] = [];
  if (opts.starred) tags.push("starred");
  if (opts.template) tags.push("template");
  return {
    Id: id,
    ParentId: null,
    Content: content,
    ItemType: opts.type ?? "Bullet",
    Sort: id,
    IsCompleted: opts.completed ?? false,
    Note: opts.note ?? null,
    Tags: tags,
    ColumnId: null,
    PeerGroupId: opts.mirror ? `pg-${id}` : null,
    CreatedAt: T(opts.daysOld ?? 30),
    UpdatedAt: T(opts.daysOld ?? 30, 9 + (id.charCodeAt(2) % 8)),
    CompletedAt: opts.completed ? T(opts.daysOld ?? 30) : null,
    TrashedAt: opts.trashed ? T(opts.daysOld ?? 30) : null,
  };
}

export const SEED_ITEMS: Item[] = [
  // Exact-whole + exact-substring tier (high score)
  mk("s-01", "search ranking",                              { daysOld: 0 }),  // exact-whole hit for "search ranking"
  mk("s-02", "search ranking algorithm overview",           { daysOld: 5 }),  // exact-substring + recency
  mk("s-03", "Implement search ranking buckets",            { daysOld: 1, note: "Score / 20 floor; sort by UpdatedAt desc within bucket." }),
  mk("s-04", "Notes on the ranking algorithm",              { daysOld: 12, note: "search appears here in the note only" }),

  // All-terms-present (in-order vs any-order)
  mk("s-05", "ranking the search results",                  { daysOld: 2 }),  // all in different order
  mk("s-06", "Sort and rank — search later",                { daysOld: 8 }),  // some terms

  // Some-terms tier
  mk("s-07", "Build a query parser",                        { daysOld: 3 }),
  mk("s-08", "Parser conformance fixtures",                 { daysOld: 7 }),

  // is:todo / is:complete fixtures
  mk("s-09", "Refactor search parser",                      { daysOld: 1 }),
  mk("s-10", "Write parser tests",                          { daysOld: 4, completed: true }),
  mk("s-11", "Ship FTS5 endpoint",                          { daysOld: 0 }),

  // is:starred / has:note / templates / mirrors
  mk("s-12", "Quarterly OKRs",                              { daysOld: 6, starred: true, note: "Top-of-mind goals." }),
  mk("s-13", "Standup template",                            { daysOld: 90, template: true }),
  mk("s-14", "Weekly review (mirrored)",                    { daysOld: 2, mirror: true }),

  // Trashed (excluded by default)
  mk("s-15", "Old draft about ranking",                     { daysOld: 40, trashed: true }),

  // Today / yesterday / this-week fixtures (date-keyword tests)
  mk("s-16", "Read the spec",                               { daysOld: 0, hour: 9 } as never),
  mk("s-17", "Yesterday's notes",                           { daysOld: 1 }),
  mk("s-18", "Last week's retro",                           { daysOld: 9 }),

  // Negation fodder + irrelevant baseline
  mk("s-19", "Grocery list",                                { daysOld: 3 }),
  mk("s-20", "Travel itinerary",                            { daysOld: 11 }),
  mk("s-21", "Random thought",                              { daysOld: 15 }),

  // Long content / note
  mk("s-22", "Hybrid relevance-then-recency strategy explained in detail",
      { daysOld: 18, note: "Bucket size is 20 score points; five buckets total. UpdatedAt desc within each bucket." }),
  mk("s-23", "Empty query behaviour",                       { daysOld: 25, note: "No results — never falls back to all items by recency." }),
  mk("s-24", "Edge case: title-exact beats note-substring", { daysOld: 30 }),
];
