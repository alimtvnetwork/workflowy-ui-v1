import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import Guide from "./01-reading-guide";
import U1S1 from "./u1-01-settings-panel";
import U1S2 from "./u1-02-password-email";
import U1S3 from "./u1-03-mfa-enrol";
import U1S4 from "./u1-04-delete-restore";
import U2S1 from "./u2-01-solo-vs-sync";
import U2S2 from "./u2-02-login-flow";
import U2S3 from "./u2-03-tokens";
import U2S4 from "./u2-04-mfa-challenge";
import U3S1 from "./u3-01-has-role";
import U3S2 from "./u3-02-require-role";
import U3S3 from "./u3-03-escalation";
import U4S1 from "./u4-01-routes-guards";
import U4S2 from "./u4-02-invite-deactivate";
import U4S3 from "./u4-03-audit";
import Closing from "./u9-closing";

export const userSlides: SlideMeta[] = [
  { id: "u-cover", chapter: "Cover", title: "Who you are. What you can do.", Component: Cover },
  { id: "u-guide", chapter: "Reading guide", title: "Four phases, one principle", Component: Guide },

  { id: "u1-divider", chapter: "Phase U-1", title: "Account & Settings",
    Component: makeDivider("Phase U-1", "Account & Settings", "The owner's view: settings panel, password, email, MFA, delete, restore.") },
  { id: "u1-1", chapter: "Phase U-1", title: "Settings panel anatomy",         Component: U1S1 },
  { id: "u1-2", chapter: "Phase U-1", title: "Set password & change email",    Component: U1S2 },
  { id: "u1-3", chapter: "Phase U-1", title: "MFA enrolment",                  Component: U1S3 },
  { id: "u1-4", chapter: "Phase U-1", title: "Delete account & restore",       Component: U1S4 },

  { id: "u2-divider", chapter: "Phase U-2", title: "Auth Flow",
    Component: makeDivider("Phase U-2", "Auth Flow", "Solo vs sync, login state machine, tokens, MFA challenge.") },
  { id: "u2-1", chapter: "Phase U-2", title: "Solo vs Sync mode",              Component: U2S1 },
  { id: "u2-2", chapter: "Phase U-2", title: "Login state machine",            Component: U2S2 },
  { id: "u2-3", chapter: "Phase U-2", title: "Token lifecycle",                Component: U2S3 },
  { id: "u2-4", chapter: "Phase U-2", title: "MFA challenge & recovery",       Component: U2S4 },

  { id: "u3-divider", chapter: "Phase U-3", title: "RBAC Helpers",
    Component: makeDivider("Phase U-3", "RBAC Helpers", "One central hasRole. One requireRole. Role escalation as a lifecycle event.") },
  { id: "u3-1", chapter: "Phase U-3", title: "One central `hasRole`",          Component: U3S1 },
  { id: "u3-2", chapter: "Phase U-3", title: "`requireRole` — loader guard",   Component: U3S2 },
  { id: "u3-3", chapter: "Phase U-3", title: "Role escalation lifecycle",      Component: U3S3 },

  { id: "u4-divider", chapter: "Phase U-4", title: "Admin UI",
    Component: makeDivider("Phase U-4", "Admin UI", "Routes guarded by requireAdmin. Invite, deactivate, audit.") },
  { id: "u4-1", chapter: "Phase U-4", title: "Routes & guards",                Component: U4S1 },
  { id: "u4-2", chapter: "Phase U-4", title: "Invite & deactivate",            Component: U4S2 },
  { id: "u4-3", chapter: "Phase U-4", title: "Audit log surface",              Component: U4S3 },

  { id: "u9-closing", chapter: "Closing", title: "Three things to take with you", Component: Closing },
];
