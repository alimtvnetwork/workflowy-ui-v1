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
];

