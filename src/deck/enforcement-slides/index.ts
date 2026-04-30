import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import Guide from "./01-reading-guide";
import E1S1 from "./e1-01-no-any";
import E1S2 from "./e1-02-no-unknown";
import E1S3 from "./e1-03-no-phantom";
import E1S4 from "./e1-04-preserve-brand";
import E2S1 from "./e2-01-parse-boundary";
import E2S2 from "./e2-02-envelope";
import E2S3 from "./e2-03-brand-ids";
import E2S4 from "./e2-04-strict-and-fail";
import E3S1 from "./e3-01-plugin-layout";
import E3S2 from "./e3-02-naming-registration";
import E3S3 from "./e3-03-tester-severity";
import E4S1 from "./e4-01-chokepoint";
import E4S2 from "./e4-02-loader-parse";
import E4S3 from "./e4-03-pipeline";
import Closing from "./e9-closing";

export const enforcementSlides: SlideMeta[] = [
  { id: "e-cover", chapter: "Cover",         title: "Make CI fail before review",   Component: Cover },
  { id: "e-guide", chapter: "Reading guide", title: "Why this deck exists",         Component: Guide },

  { id: "e1-divider", chapter: "Phase E-1", title: "Compile-time generics",
    Component: makeDivider("Phase E-1", "Compile-time generics", "Four rules that keep `any` and `unknown` out of public surfaces.") },
  { id: "e1-1", chapter: "Phase E-1", title: "R1 — No bare `any`",         Component: E1S1 },
  { id: "e1-2", chapter: "Phase E-1", title: "R2 — No `unknown` returns", Component: E1S2 },
  { id: "e1-3", chapter: "Phase E-1", title: "R3 — No phantom generics",  Component: E1S3 },
  { id: "e1-4", chapter: "Phase E-1", title: "R4 — Preserve the brand",   Component: E1S4 },

  { id: "e2-divider", chapter: "Phase E-2", title: "Runtime validation",
    Component: makeDivider("Phase E-2", "Runtime validation", "Generics protect in-process types. Zod protects everything that crosses a trust boundary.") },
  { id: "e2-1", chapter: "Phase E-2", title: "R1 — Parse at every boundary", Component: E2S1 },
  { id: "e2-2", chapter: "Phase E-2", title: "R2 — Envelope schema",         Component: E2S2 },
  { id: "e2-3", chapter: "Phase E-2", title: "R3 — Brand at the parse",      Component: E2S3 },
  { id: "e2-4", chapter: "Phase E-2", title: "R4–5 — Strict + typed failures", Component: E2S4 },

  { id: "e3-divider", chapter: "Phase E-3", title: "Authoring ESLint rules",
    Component: makeDivider("Phase E-3", "Authoring ESLint rules", "How custom rules are laid out, named, registered, tested, and shipped.") },
  { id: "e3-1", chapter: "Phase E-3", title: "Plugin layout & factory",   Component: E3S1 },
  { id: "e3-2", chapter: "Phase E-3", title: "Naming & registration",     Component: E3S2 },
  { id: "e3-3", chapter: "Phase E-3", title: "RuleTester & severity",     Component: E3S3 },

  { id: "e4-divider", chapter: "Phase E-4", title: "Boundary chokepoints",
    Component: makeDivider("Phase E-4", "Boundary chokepoints", "One module per external primitive. Loaders parse. The four layers wired into CI.") },
  { id: "e4-1", chapter: "Phase E-4", title: "Chokepoint principle",      Component: E4S1 },
  { id: "e4-2", chapter: "Phase E-4", title: "Loaders parse params",      Component: E4S2 },
  { id: "e4-3", chapter: "Phase E-4", title: "The four-layer pipeline",   Component: E4S3 },

  { id: "e9-closing", chapter: "Closing", title: "Three things to take with you", Component: Closing },
];
