import type { SlideMeta } from "./types";

/**
 * Speaker notes by slide id. Kept separate from the slide registry so
 * notes can be edited without touching component imports.
 *
 * Conventions:
 *  - 1-3 short paragraphs, ~30-60 seconds of talk per slide
 *  - First line is the "headline" — what to say if you're rushed
 *  - Use `--` for sub-points the speaker can drop into
 */
export const NOTES: Record<string, string> = {
  // ---------- Frontend deck ----------
  "cover": `Welcome. This deck walks through every screen of the WorkFlowy clone — what users see and why.

-- Audience: PMs, designers, and engineers onboarding to the product.
-- We'll cover ~65 slides across 23 chapters; 35-40 minutes at a steady pace.
-- Backend internals are in a separate /backend-deck.`,

  "guide": `One thing to keep in mind: every screen in this deck is backed by a real
spec under spec/31-app/ through spec/36-user-management/. If you see something
that contradicts the spec, the spec wins — flag it and we'll update the slide.

-- Skip the divider slides if you're tight on time.`,

  // ---------- Backend deck ----------
  "b-cover": `This is the systems deck. We assume the audience has seen the frontend deck
or used a WorkFlowy-style outliner before.

-- We'll move from architecture (B-1) down to deployment (B-10).
-- Every code snippet is real-shape TypeScript — not pseudocode. You should be
   able to grep the repo and find the matching file.`,

  "b-guide": `Three things to assume going in:
1. One Node process, two SQLite files (app + templates).
2. All mutations flow through one "op" funnel — no direct table writes from
   route handlers.
3. We optimize for correctness and operability over throughput. This isn't
   designed to scale past a single host yet.`,

  "b1-1": `The whole server is one Node process. We use better-sqlite3 in WAL mode,
which means readers don't block writers and we get one-writer-at-a-time
serialization for free — no need for a queue.

-- The "two-DB" split is the next slide; the short version is: app data and
   template snapshots live in different files so we can back them up,
   migrate, and reason about them independently.`,

  "b3-2": `LWW is the part everyone gets wrong. The tie-break order matters:
(timestamp, actorUserId, clientOpId). Without the actor and op id, two
clients can produce indistinguishable updates and you get flapping.

-- We store the winning stamp per field, not per row. This means a content
   edit and a tag change at the same wall-clock time both apply.`,

  "b4-2": `Fractional indexing is how we avoid renumbering siblings on every move.
The mental model: each sibling has a base-62 string, and "between(a,b)"
returns a string that sorts strictly between them.

-- Worst case is one extra char per ~62 inserts at the same gap.
-- We do a lazy rebalance (B-7) when any group exceeds 32 chars.`,

  "b5-2": `Mirror cycles are the one thing the server absolutely must reject. If a
mirror lives inside its own source's subtree, reading it loops forever.

-- The recursive CTE walks UP from the target parent and bails the moment
   it sees the source ID.
-- Note we also forbid "mirror of a mirror" — there's only ever one source.`,

  "b7-2": `The trash reaper is hourly, chunks of 500. The chunking matters: SQLite's
single-writer model means a giant DELETE blocks every other write for the
duration. 500 keeps each transaction under ~50 ms in practice.

-- Mirrors pointing at reaped sources stay in brokenAt state. We do NOT
   touch them — the user decides whether to restore or delete.`,

  "b10-1": `Zod is the boundary. The rule is: untrusted data hits exactly one
schema parser, and after that point we have a fully typed value. No "as any",
no manual typeof checks deeper in the call stack.

-- The schemas live in src/contracts/ and are imported by both the route
   handler and the client SDK — one source of truth, type-checked on both
   sides.`,

  "b10-closing": `That's the backend in 45 slides. Three takeaways:

1. One process, two SQLite files. Boring is a feature.
2. Ops are the only mutation API — every behavior in this deck eventually
   becomes an applyOp() call.
3. Boundaries are enforced by the type system and the linter, not by
   discipline. If you can write the wrong code, eventually someone will.

Questions?`,
};

export function attachNotes<T extends SlideMeta>(slides: T[]): T[] {
  return slides.map((s) => (s.notes ? s : { ...s, notes: NOTES[s.id] }));
}
