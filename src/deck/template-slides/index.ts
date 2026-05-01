import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import Guide from "./01-reading-guide";
import T1S1 from "./t1-01-decision";
import T1S2 from "./t1-02-payload-shape";
import T2S1 from "./t2-01-snapshot-algo";
import T2S2 from "./t2-02-mirror-flatten";
import T2S3 from "./t2-03-trash-exclude";
import T2S4 from "./t2-04-edges";
import T3S1 from "./t3-01-apply-algo";
import T3S2 from "./t3-02-ownership";
import T3S3 from "./t3-03-apply-errors";
import T3S4 from "./t3-04-divergence";
import T4S1 from "./t4-01-acceptance";
import T4S2 from "./t4-02-nongoals";
import T4S3 from "./t4-03-component-contract";
import Closing from "./t9-closing";

export const templateSlides: SlideMeta[] = [
  { id: "tp-cover", chapter: "Cover",         title: "One stamp, zero links, forever divergent", Component: Cover },
  { id: "tp-guide", chapter: "Reading guide", title: "Why this deck exists",                     Component: Guide },

  { id: "t1-divider", chapter: "Phase T-1", title: "Decision",
    Component: makeDivider("Phase T-1", "Decision", "Snapshot copies. No back-link in either direction. Six rows that close out future ambiguity.") },
  { id: "t1-1", chapter: "Phase T-1", title: "Decision table",            Component: T1S1 },
  { id: "t1-2", chapter: "Phase T-1", title: "Payload shape",             Component: T1S2 },

  { id: "t2-divider", chapter: "Phase T-2", title: "Snapshot",
    Component: makeDivider("Phase T-2", "Snapshot", "DFS clone with mirror flatten and trash exclusion. Cap check is a post-condition.") },
  { id: "t2-1", chapter: "Phase T-2", title: "Snapshot algorithm",        Component: T2S1 },
  { id: "t2-2", chapter: "Phase T-2", title: "Mirror flatten",            Component: T2S2 },
  { id: "t2-3", chapter: "Phase T-2", title: "Trash exclusion",           Component: T2S3 },
  { id: "t2-4", chapter: "Phase T-2", title: "Edge cases",                Component: T2S4 },

  { id: "t3-divider", chapter: "Phase T-3", title: "Apply",
    Component: makeDivider("Phase T-3", "Apply", "DFS clone with fresh UUIDs. Ownership rewrites to the instantiator. Fail before WAL.") },
  { id: "t3-1", chapter: "Phase T-3", title: "Apply algorithm",           Component: T3S1 },
  { id: "t3-2", chapter: "Phase T-3", title: "Ownership rewrite",         Component: T3S2 },
  { id: "t3-3", chapter: "Phase T-3", title: "Apply errors",              Component: T3S3 },
  { id: "t3-4", chapter: "Phase T-3", title: "Divergence proof",          Component: T3S4 },

  { id: "t4-divider", chapter: "Phase T-4", title: "Acceptance & implementation",
    Component: makeDivider("Phase T-4", "Acceptance & impl", "Ten ATs, four non-goals, two server-side files. The whole feature in one column.") },
  { id: "t4-1", chapter: "Phase T-4", title: "Acceptance tests (10)",     Component: T4S1 },
  { id: "t4-2", chapter: "Phase T-4", title: "Non-goals",                 Component: T4S2 },
  { id: "t4-3", chapter: "Phase T-4", title: "Component contract",        Component: T4S3 },

  { id: "t9-closing", chapter: "Closing", title: "Three things to take with you", Component: Closing },
];
