import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import Guide from "./01-reading-guide";
import A1S1 from "./a1-01-split-db";
import A1S2 from "./a1-02-table-ddl";
import A1S3 from "./a1-03-event-enum";
import A1S4 from "./a1-04-payload-schemas";
import A1S5 from "./a1-05-cursor-sse";
import A2S1 from "./a2-01-five-stages";
import A2S2 from "./a2-02-intent";
import A2S3 from "./a2-03-capture";
import A2S4 from "./a2-04-persist-replay";
import A2S5 from "./a2-05-broadcast";
import A3S1 from "./a3-01-routes";
import A3S2 from "./a3-02-loader";
import A3S3 from "./a3-03-dispatcher";
import A3S4 from "./a3-04-restore";
import A3S5 from "./a3-05-authz";
import A4S1 from "./a4-01-constants";
import A4S2 from "./a4-02-purge-job";
import A4S3 from "./a4-03-mirror-compact";
import Closing from "./a9-closing";

export const activitySlides: SlideMeta[] = [
  { id: "act-cover", chapter: "Cover",         title: "One chokepoint, 8 event types, 30-day reaper", Component: Cover },
  { id: "act-guide", chapter: "Reading guide", title: "Why this deck exists",                          Component: Guide },

  { id: "a1-divider", chapter: "Phase A-1", title: "Schema",
    Component: makeDivider("Phase A-1", "Schema", "Dedicated activity.db, one append-only table, 8-value closed enum, per-type strict Zod payloads.") },
  { id: "a1-1", chapter: "Phase A-1", title: "Why activity.db is its own SQLite",     Component: A1S1 },
  { id: "a1-2", chapter: "Phase A-1", title: "ActivityEvent table DDL",               Component: A1S2 },
  { id: "a1-3", chapter: "Phase A-1", title: "EventType — exactly 8",                 Component: A1S3 },
  { id: "a1-4", chapter: "Phase A-1", title: "Per-type Zod payloads",                 Component: A1S4 },
  { id: "a1-5", chapter: "Phase A-1", title: "Cursor format + SSE frame",             Component: A1S5 },

  { id: "a2-divider", chapter: "Phase A-2", title: "Capture pipeline",
    Component: makeDivider("Phase A-2", "Capture pipeline", "Five stages: Intent → Capture → Persist → Replay → Broadcast. One chokepoint. Atomic mirror+queue.") },
  { id: "a2-1", chapter: "Phase A-2", title: "Five stages, no more",                  Component: A2S1 },
  { id: "a2-2", chapter: "Phase A-2", title: "Stage 1 — Intent (action handler)",     Component: A2S2 },
  { id: "a2-3", chapter: "Phase A-2", title: "Stage 2 — captureEvent (chokepoint)",   Component: A2S3 },
  { id: "a2-4", chapter: "Phase A-2", title: "Stages 3 & 4 — Persist + Replay",       Component: A2S4 },
  { id: "a2-5", chapter: "Phase A-2", title: "Stage 5 — Broadcast (SSE read-only)",   Component: A2S5 },

  { id: "a3-divider", chapter: "Phase A-3", title: "Feed UI",
    Component: makeDivider("Phase A-3", "Feed UI", "Two routes, one named boundary. Mirror-first loader. Exhaustive dispatcher. Restore via captureEvent.") },
  { id: "a3-1", chapter: "Phase A-3", title: "Routes + named boundary",               Component: A3S1 },
  { id: "a3-2", chapter: "Phase A-3", title: "Mirror-first loader",                   Component: A3S2 },
  { id: "a3-3", chapter: "Phase A-3", title: "Row dispatcher — no `default:`",        Component: A3S3 },
  { id: "a3-4", chapter: "Phase A-3", title: "Restore — via the editor action",       Component: A3S4 },
  { id: "a3-5", chapter: "Phase A-3", title: "Authorization — server-side, hasRole",  Component: A3S5 },

  { id: "a4-divider", chapter: "Phase A-4", title: "Retention & purge",
    Component: makeDivider("Phase A-4", "Retention & purge", "30 days, indexed, batched, exclusive-locked, cursor-pinned mirror compaction.") },
  { id: "a4-1", chapter: "Phase A-4", title: "Four closed constants",                 Component: A4S1 },
  { id: "a4-2", chapter: "Phase A-4", title: "Server purge — batched + exclusive",    Component: A4S2 },
  { id: "a4-3", chapter: "Phase A-4", title: "Mirror compaction — cursor-pinned",     Component: A4S3 },

  { id: "a9-closing", chapter: "Closing", title: "Three things to take with you",     Component: Closing },
];
