import type { SlideMeta } from "../types";
import { makeDivider } from "../slides/section-divider";
import Cover from "./00-cover";
import Guide from "./01-reading-guide";
import O1S1 from "./o1-01-slos";
import O1S2 from "./o1-02-error-budget";
import O2S1 from "./o2-01-metrics-surface";
import O2S2 from "./o2-02-logs-traces";
import O2S3 from "./o2-03-health-checks";
import O3S1 from "./o3-01-pages";
import O3S2 from "./o3-02-tickets";
import O4S1 from "./o4-01-overview-dashboard";
import O4S2 from "./o4-02-sync-deep-dive";
import O4S3 from "./o4-03-storage-jobs";
import O5S1 from "./o5-01-on-call";
import O5S2 from "./o5-02-playbook-sync-errors";
import O5S3 from "./o5-03-playbook-db-locked";
import O5S4 from "./o5-04-playbook-rollback";
import O5S5 from "./o5-05-playbook-restore";
import O5S6 from "./o5-06-closing";

export const opsSlides: SlideMeta[] = [
  { id: "o-cover",  chapter: "Cover",         title: "WorkFlowy — Operations",  Component: Cover },
  { id: "o-guide",  chapter: "Reading guide", title: "What this deck assumes", Component: Guide },

  { id: "o1-divider", chapter: "Phase O-1", title: "SLOs & error budget", Component: makeDivider("Phase O-1", "SLOs & error budget", "Three objectives. Policy for what we do when budget runs out.") },
  { id: "o1-1", chapter: "Phase O-1", title: "Service-level objectives", Component: O1S1 },
  { id: "o1-2", chapter: "Phase O-1", title: "Error budget policy",      Component: O1S2 },

  { id: "o2-divider", chapter: "Phase O-2", title: "Metrics, logs, health", Component: makeDivider("Phase O-2", "Metrics, logs, health", "What we expose, how we read it, what 'healthy' means.") },
  { id: "o2-1", chapter: "Phase O-2", title: "Prometheus surface", Component: O2S1 },
  { id: "o2-2", chapter: "Phase O-2", title: "Logs & traces",      Component: O2S2 },
  { id: "o2-3", chapter: "Phase O-2", title: "Health checks",      Component: O2S3 },

  { id: "o3-divider", chapter: "Phase O-3", title: "Alerts", Component: makeDivider("Phase O-3", "Alerts", "What pages, what tickets, why the split is binary.") },
  { id: "o3-1", chapter: "Phase O-3", title: "Page-worthy alerts",   Component: O3S1 },
  { id: "o3-2", chapter: "Phase O-3", title: "Ticket-worthy alerts", Component: O3S2 },

  { id: "o4-divider", chapter: "Phase O-4", title: "Dashboards", Component: makeDivider("Phase O-4", "Dashboards", "Three dashboards: overview · sync deep-dive · storage & jobs.") },
  { id: "o4-1", chapter: "Phase O-4", title: "Overview dashboard",      Component: O4S1 },
  { id: "o4-2", chapter: "Phase O-4", title: "Sync deep-dive dashboard",Component: O4S2 },
  { id: "o4-3", chapter: "Phase O-4", title: "Storage & jobs dashboard",Component: O4S3 },

  { id: "o5-divider", chapter: "Phase O-5", title: "On-call & playbooks", Component: makeDivider("Phase O-5", "On-call & playbooks", "Rotation, four playbooks, closing.") },
  { id: "o5-1", chapter: "Phase O-5", title: "On-call rotation",                Component: O5S1 },
  { id: "o5-2", chapter: "Phase O-5", title: "Playbook: Sync errors spiking",   Component: O5S2 },
  { id: "o5-3", chapter: "Phase O-5", title: "Playbook: SQLite busy / locked",  Component: O5S3 },
  { id: "o5-4", chapter: "Phase O-5", title: "Playbook: Bad deploy rollback",   Component: O5S4 },
  { id: "o5-5", chapter: "Phase O-5", title: "Playbook: Restore from backup",   Component: O5S5 },
  { id: "o5-closing", chapter: "Closing", title: "That's ops", Component: O5S6 },
];
