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
];

