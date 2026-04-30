import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import ReadingGuide from "./01-reading-guide";
import B1S1 from "./b1-01-process-model";
import B1S2 from "./b1-02-two-db";
import B1S3 from "./b1-03-request-lifecycle";
import B2S1 from "./b2-01-password-storage";
import B2S2 from "./b2-02-sessions";
import B2S3 from "./b2-03-reset-tokens";
import B2S4 from "./b2-04-rbac";
import B3S1 from "./b3-01-op-shapes";
import B3S2 from "./b3-02-lww";
import B3S3 from "./b3-03-cursors";
import B3S4 from "./b3-04-sequence";
import B3S5 from "./b3-05-sse";
import B3S6 from "./b3-06-offline-replay";
import B4S1 from "./b4-01-move-atomicity";
import B4S2 from "./b4-02-fractional-index";
import B4S3 from "./b4-03-rebalance";
import B4S4 from "./b4-04-soft-delete";
import B5S1 from "./b5-01-peer-groups";
import B5S2 from "./b5-02-cycle-detection";
import B5S3 from "./b5-03-broken-at";
import B6S1 from "./b6-01-snapshot";
import B6S2 from "./b6-02-deep-copy";
import B6S3 from "./b6-03-cascading-perms";
import B7S1 from "./b7-01-job-runner";
import B7S2 from "./b7-02-trash-reaper";
import B7S3 from "./b7-03-activity-purge";
import B7S4 from "./b7-04-sse-fanout";
import B8S1 from "./b8-01-fts5";
import B8S2 from "./b8-02-operator-parser";
import B8S3 from "./b8-03-write-hooks";
import B9S1 from "./b9-01-versioning";
import B9S2 from "./b9-02-v2-example";
import B9S3 from "./b9-03-query-plans";
import B10S1 from "./b10-01-zod";
import B10S2 from "./b10-02-eslint-boundary";
import B10S3 from "./b10-03-runbook";
import B10S4 from "./b10-04-closing";

export const backendSlides: SlideMeta[] = [
  { id: "b-cover", chapter: "Cover", title: "WorkFlowy — Backend Deck", Component: Cover },
  { id: "b-guide", chapter: "Reading guide", title: "What this deck assumes", Component: ReadingGuide },

  { id: "b1-divider", chapter: "Phase B-1", title: "Architecture overview", Component: makeDivider("Phase B-1", "Architecture overview", "Process model · two-DB split · request lifecycle.") },
  { id: "b1-1", chapter: "Phase B-1", title: "Process model", Component: B1S1 },
  { id: "b1-2", chapter: "Phase B-1", title: "Two-DB split & boundary rule", Component: B1S2 },
  { id: "b1-3", chapter: "Phase B-1", title: "Request lifecycle", Component: B1S3 },

  { id: "b2-divider", chapter: "Phase B-2", title: "Auth & sessions", Component: makeDivider("Phase B-2", "Auth & sessions", "Password storage · cookies · reset tokens · RBAC.") },
  { id: "b2-1", chapter: "Phase B-2", title: "Password storage (Argon2id)", Component: B2S1 },
  { id: "b2-2", chapter: "Phase B-2", title: "Sessions & cookies", Component: B2S2 },
  { id: "b2-3", chapter: "Phase B-2", title: "Forgot-password reset tokens", Component: B2S3 },
  { id: "b2-4", chapter: "Phase B-2", title: "RBAC: has_role + workspace", Component: B2S4 },

  { id: "b3-divider", chapter: "Phase B-3", title: "Sync protocol", Component: makeDivider("Phase B-3", "Sync protocol", "Op shapes · LWW · cursors · SSE · offline replay.") },
  { id: "b3-1", chapter: "Phase B-3", title: "Op shapes", Component: B3S1 },
  { id: "b3-2", chapter: "Phase B-3", title: "LWW resolution", Component: B3S2 },
  { id: "b3-3", chapter: "Phase B-3", title: "Cursors", Component: B3S3 },
  { id: "b3-4", chapter: "Phase B-3", title: "Sync sequence", Component: B3S4 },
  { id: "b3-5", chapter: "Phase B-3", title: "SSE transport", Component: B3S5 },
  { id: "b3-6", chapter: "Phase B-3", title: "Offline replay (outbox)", Component: B3S6 },

  { id: "b4-divider", chapter: "Phase B-4", title: "Item operations", Component: makeDivider("Phase B-4", "Item operations", "Move atomicity · fractional indexing · rebalance · soft-delete.") },
  { id: "b4-1", chapter: "Phase B-4", title: "Move / indent / outdent atomicity", Component: B4S1 },
  { id: "b4-2", chapter: "Phase B-4", title: "Fractional indexing math", Component: B4S2 },
  { id: "b4-3", chapter: "Phase B-4", title: "Rebalance & conflict cases", Component: B4S3 },
  { id: "b4-4", chapter: "Phase B-4", title: "Soft-delete & restore", Component: B4S4 },

  { id: "b5-divider", chapter: "Phase B-5", title: "Mirrors", Component: makeDivider("Phase B-5", "Mirrors", "Peer groups · cycle detection · BrokenAt propagation.") },
  { id: "b5-1", chapter: "Phase B-5", title: "Peer-group resolution", Component: B5S1 },
  { id: "b5-2", chapter: "Phase B-5", title: "Cycle detection", Component: B5S2 },
  { id: "b5-3", chapter: "Phase B-5", title: "BrokenAt propagation", Component: B5S3 },

  { id: "b6-divider", chapter: "Phase B-6", title: "Templates & sharing", Component: makeDivider("Phase B-6", "Templates & sharing", "Snapshot serialization · deep-copy · cascading permissions.") },
  { id: "b6-1", chapter: "Phase B-6", title: "Snapshot serialization", Component: B6S1 },
  { id: "b6-2", chapter: "Phase B-6", title: "Deep-copy on instantiate", Component: B6S2 },
  { id: "b6-3", chapter: "Phase B-6", title: "Cascading permissions", Component: B6S3 },

  { id: "b7-divider", chapter: "Phase B-7", title: "Background jobs", Component: makeDivider("Phase B-7", "Background jobs", "Job runner · trash reaper · activity purge · SSE fan-out.") },
  { id: "b7-1", chapter: "Phase B-7", title: "Job runner architecture", Component: B7S1 },
  { id: "b7-2", chapter: "Phase B-7", title: "Trash reaper", Component: B7S2 },
  { id: "b7-3", chapter: "Phase B-7", title: "Activity purge", Component: B7S3 },
  { id: "b7-4", chapter: "Phase B-7", title: "SSE fan-out", Component: B7S4 },

  { id: "b8-divider", chapter: "Phase B-8", title: "Search & activity", Component: makeDivider("Phase B-8", "Search & activity capture", "FTS5 · operator parser · write-path hooks.") },
  { id: "b8-1", chapter: "Phase B-8", title: "FTS5 virtual table", Component: B8S1 },
  { id: "b8-2", chapter: "Phase B-8", title: "Operator parser", Component: B8S2 },
  { id: "b8-3", chapter: "Phase B-8", title: "Write-path hooks", Component: B8S3 },

  { id: "b9-divider", chapter: "Phase B-9", title: "Migrations & indexes", Component: makeDivider("Phase B-9", "Migrations & indexes", "Versioning · v2 example · query plans.") },
  { id: "b9-1", chapter: "Phase B-9", title: "Versioning & runner", Component: B9S1 },
  { id: "b9-2", chapter: "Phase B-9", title: "v2 example: add mirrorOfItemId", Component: B9S2 },
  { id: "b9-3", chapter: "Phase B-9", title: "Query plans & hot indexes", Component: B9S3 },
];

