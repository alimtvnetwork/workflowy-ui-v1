import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import Guide from "./01-reading-guide";
import S1S1 from "./s1-01-ebnf";
import S1S2 from "./s1-02-keywords";
import S1S3 from "./s1-03-combination";
import S1S4 from "./s1-04-test-vectors";
import S1S5 from "./s1-05-errors";
import S2S1 from "./s2-01-scoring";
import S2S2 from "./s2-02-buckets";
import S2S3 from "./s2-03-invariants";
import S2S4 from "./s2-04-edge-cases";
import S2S5 from "./s2-05-acceptance";
import S3S1 from "./s3-01-popover";
import S3S2 from "./s3-02-tokens";
import S3S3 from "./s3-03-hints";
import S3S4 from "./s3-04-keyboard";
import S3S5 from "./s3-05-states";
import S3S6 from "./s3-06-results";
import S4S1 from "./s4-01-fts5-schema";
import S4S2 from "./s4-02-fanout";
import S4S3 from "./s4-03-endpoint";
import S4S4 from "./s4-04-permissions";
import S4S5 from "./s4-05-sse";
import S4S6 from "./s4-06-perf";
import Closing from "./s9-closing";

export const searchSlides: SlideMeta[] = [
  { id: "sr-cover", chapter: "Cover",         title: "One grammar, five buckets, sub-300 ms", Component: Cover },
  { id: "sr-guide", chapter: "Reading guide", title: "Why this deck exists",                  Component: Guide },

  { id: "s1-divider", chapter: "Phase S-1", title: "Grammar",
    Component: makeDivider("Phase S-1", "Grammar", "Closed EBNF, twelve keys, twelve normative test vectors, no explicit OR.") },
  { id: "s1-1", chapter: "Phase S-1", title: "EBNF",                       Component: S1S1 },
  { id: "s1-2", chapter: "Phase S-1", title: "Keyword reference",          Component: S1S2 },
  { id: "s1-3", chapter: "Phase S-1", title: "Combination semantics",      Component: S1S3 },
  { id: "s1-4", chapter: "Phase S-1", title: "Twelve normative vectors",   Component: S1S4 },
  { id: "s1-5", chapter: "Phase S-1", title: "Parser error cases",         Component: S1S5 },

  { id: "s2-divider", chapter: "Phase S-2", title: "Ranking",
    Component: makeDivider("Phase S-2", "Ranking", "Hybrid relevance-then-recency. Five buckets. Determinism is a contract.") },
  { id: "s2-1", chapter: "Phase S-2", title: "Scoring algorithm",          Component: S2S1 },
  { id: "s2-2", chapter: "Phase S-2", title: "Five buckets",               Component: S2S2 },
  { id: "s2-3", chapter: "Phase S-2", title: "Four invariants (I-SR-*)",   Component: S2S3 },
  { id: "s2-4", chapter: "Phase S-2", title: "Edge cases",                 Component: S2S4 },
  { id: "s2-5", chapter: "Phase S-2", title: "Acceptance tests (AT-SR-*)", Component: S2S5 },

  { id: "s3-divider", chapter: "Phase S-3", title: "Surface",
    Component: makeDivider("Phase S-3", "Surface", "One popover, six states, eight keys, sanitised highlighting, no client re-rank.") },
  { id: "s3-1", chapter: "Phase S-3", title: "Popover anatomy",            Component: S3S1 },
  { id: "s3-2", chapter: "Phase S-3", title: "Token / chip system",        Component: S3S2 },
  { id: "s3-3", chapter: "Phase S-3", title: "Hints & value pickers",      Component: S3S3 },
  { id: "s3-4", chapter: "Phase S-3", title: "Keyboard shortcuts",         Component: S3S4 },
  { id: "s3-5", chapter: "Phase S-3", title: "Six explicit states",        Component: S3S5 },
  { id: "s3-6", chapter: "Phase S-3", title: "Results & highlighting",     Component: S3S6 },

  { id: "s4-divider", chapter: "Phase S-4", title: "Backend",
    Component: makeDivider("Phase S-4", "Backend", "FTS5 per App-DB, application-side fan-out merge, six error codes, perf SLA enforced.") },
  { id: "s4-1", chapter: "Phase S-4", title: "FTS5 schema",                Component: S4S1 },
  { id: "s4-2", chapter: "Phase S-4", title: "Cross-workspace fan-out",    Component: S4S2 },
  { id: "s4-3", chapter: "Phase S-4", title: "EP-SEARCH-QUERY contract",   Component: S4S3 },
  { id: "s4-4", chapter: "Phase S-4", title: "Permissions",                Component: S4S4 },
  { id: "s4-5", chapter: "Phase S-4", title: "SSE & realtime",             Component: S4S5 },
  { id: "s4-6", chapter: "Phase S-4", title: "Performance budget",         Component: S4S6 },

  { id: "s9-closing", chapter: "Closing", title: "Three things to take with you", Component: Closing },
];
