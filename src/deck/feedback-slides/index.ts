import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import Guide from "./01-reading-guide";
import F1S1 from "./f1-01-split-db";
import F1S2 from "./f1-02-schema";
import F1S3 from "./f1-03-enums";
import F1S4 from "./f1-04-transition-matrix";
import F1S5 from "./f1-05-diagnostics";
import F2S1 from "./f2-01-submit-pipeline";
import F2S2 from "./f2-02-rest-create";
import F2S3 from "./f2-03-retry";
import F3S1 from "./f3-01-admin-route";
import F3S2 from "./f3-02-inbox";
import F3S3 from "./f3-03-detail";
import F3S4 from "./f3-04-transition-writer";
import F4S1 from "./f4-01-retention";
import F4S2 from "./f4-02-purge-cascade";
import F4S3 from "./f4-03-gdpr";
import F4S4 from "./f4-04-csv-export";
import Closing from "./f9-closing";

export const feedbackSlides: SlideMeta[] = [
  { id: "fb-cover", chapter: "Cover",         title: "One inbox, closed enums, 90-day reaper", Component: Cover },
  { id: "fb-guide", chapter: "Reading guide", title: "Why this deck exists",                   Component: Guide },

  { id: "f1-divider", chapter: "Phase F-1", title: "Storage & schema",
    Component: makeDivider("Phase F-1", "Storage & schema", "Dedicated feedback.db, one table, two closed enums, one transition matrix, strict diagnostics JSON.") },
  { id: "f1-1", chapter: "Phase F-1", title: "Dedicated feedback.db",     Component: F1S1 },
  { id: "f1-2", chapter: "Phase F-1", title: "FeedbackReport schema",     Component: F1S2 },
  { id: "f1-3", chapter: "Phase F-1", title: "Two closed enums",          Component: F1S3 },
  { id: "f1-4", chapter: "Phase F-1", title: "Transition matrix is a Record", Component: F1S4 },
  { id: "f1-5", chapter: "Phase F-1", title: "Diagnostics — strict, capped, PII-bounded", Component: F1S5 },

  { id: "f2-divider", chapter: "Phase F-2", title: "Submission",
    Component: makeDivider("Phase F-2", "Submission", "Single egress. Mirror + queue in one IDB transaction. Server re-validates everything.") },
  { id: "f2-1", chapter: "Phase F-2", title: "submitFeedback pipeline",   Component: F2S1 },
  { id: "f2-2", chapter: "Phase F-2", title: "POST /feedback contract",   Component: F2S2 },
  { id: "f2-3", chapter: "Phase F-2", title: "Retry behaviour",           Component: F2S3 },

  { id: "f3-divider", chapter: "Phase F-3", title: "Admin review",
    Component: makeDivider("Phase F-3", "Admin review", "Server is the role authority. URL-state filters. Body renders as plain text. Single transition writer.") },
  { id: "f3-1", chapter: "Phase F-3", title: "Route gating + boundary",   Component: F3S1 },
  { id: "f3-2", chapter: "Phase F-3", title: "Inbox — URL state + cursor", Component: F3S2 },
  { id: "f3-3", chapter: "Phase F-3", title: "Detail drawer rules",       Component: F3S3 },
  { id: "f3-4", chapter: "Phase F-3", title: "transitionFeedback — sole writer", Component: F3S4 },

  { id: "f4-divider", chapter: "Phase F-4", title: "Retention & GDPR",
    Component: makeDivider("Phase F-4", "Retention & GDPR", "90-day reaper, fixed cascade order, atomic GDPR delete, streamed CSV export.") },
  { id: "f4-1", chapter: "Phase F-4", title: "Five closed constants",     Component: F4S1 },
  { id: "f4-2", chapter: "Phase F-4", title: "Daily purge cascade",       Component: F4S2 },
  { id: "f4-3", chapter: "Phase F-4", title: "DeleteMyFeedback — atomic GDPR", Component: F4S3 },
  { id: "f4-4", chapter: "Phase F-4", title: "CSV export — streamed",     Component: F4S4 },

  { id: "f9-closing", chapter: "Closing", title: "Three things to take with you", Component: Closing },
];
