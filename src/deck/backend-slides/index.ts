import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import ReadingGuide from "./01-reading-guide";
import B1S1 from "./b1-01-process-model";
import B1S2 from "./b1-02-two-db";
import B1S3 from "./b1-03-request-lifecycle";

export const backendSlides: SlideMeta[] = [
  { id: "b-cover", chapter: "Cover", title: "WorkFlowy — Backend Deck", Component: Cover },
  { id: "b-guide", chapter: "Reading guide", title: "What this deck assumes", Component: ReadingGuide },

  { id: "b1-divider", chapter: "Phase B-1", title: "Architecture overview", Component: makeDivider("Phase B-1", "Architecture overview", "Process model · two-DB split · request lifecycle.") },
  { id: "b1-1", chapter: "Phase B-1", title: "Process model", Component: B1S1 },
  { id: "b1-2", chapter: "Phase B-1", title: "Two-DB split & boundary rule", Component: B1S2 },
  { id: "b1-3", chapter: "Phase B-1", title: "Request lifecycle", Component: B1S3 },
];
