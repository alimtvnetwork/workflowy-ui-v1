import type { SlideMeta } from "../types";
import CoverSlide from "./00-cover";
import ReadingGuideSlide from "./01-reading-guide";
import { makeDivider } from "./section-divider";

// Chapter 1
import Ch1S1 from "./ch1-01-what-is-workflowy";
import Ch1S2 from "./ch1-02-item-model";
import Ch1S3 from "./ch1-03-views-over-tree";
// Chapter 2
import Ch2S1 from "./ch2-01-app-shell-ui";
import Ch2S2 from "./ch2-02-navbar";
import Ch2S3 from "./ch2-03-sidebar";
import Ch2S4 from "./ch2-04-shell-tech";
// Chapter 3
import Ch3S1 from "./ch3-01-recursive-ui";
import Ch3S2 from "./ch3-02-zoom";
import Ch3S3 from "./ch3-03-recursive-tech";
// Chapter 4
import Ch4S1 from "./ch4-01-editor-ui";
import Ch4S2 from "./ch4-02-keys";
import Ch4S3 from "./ch4-03-slash-menu";
import Ch4S4 from "./ch4-04-toolbar";
import Ch4S5 from "./ch4-05-editor-tech";
// Chapter 5
import Ch5S1 from "./ch5-01-bullet-anatomy";
import Ch5S2 from "./ch5-02-row-menu";
import Ch5S3 from "./ch5-03-bullet-tech";
// Chapter 6
import Ch6S1 from "./ch6-01-multiselect";
import Ch6S2 from "./ch6-02-dnd";
import Ch6S3 from "./ch6-03-multiselect-tech";
// Chapter 7
import Ch7S1 from "./ch7-01-search-ui";
import Ch7S2 from "./ch7-02-search-flow";
import Ch7S3 from "./ch7-03-search-tech";
// Chapter 8
import Ch8S1 from "./ch8-01-today-calendar-ui";
import Ch8S2 from "./ch8-02-today-flow";
import Ch8S3 from "./ch8-03-today-tech";
// Chapter 9
import Ch9S1 from "./ch9-01-board-ui";
import Ch9S2 from "./ch9-02-dashboard-ui";
import Ch9S3 from "./ch9-03-board-dash-tech";
// Chapter 10
import Ch10S1 from "./ch10-01-mirrors-ui";
import Ch10S2 from "./ch10-02-mirrors-flow";
import Ch10S3 from "./ch10-03-mirrors-tech";
// Chapter 11
import Ch11S1 from "./ch11-01-templates-ui";
import Ch11S2 from "./ch11-02-templates-tech";
// Chapter 12
import Ch12S1 from "./ch12-01-share-ui";
import Ch12S2 from "./ch12-02-permissions";
import Ch12S3 from "./ch12-03-share-tech";
// Chapter 13
import Ch13S1 from "./ch13-01-trash-ui";
import Ch13S2 from "./ch13-02-trash-flow";
import Ch13S3 from "./ch13-03-trash-tech";
// Chapter 14
import Ch14S1 from "./ch14-01-right-panel-ui";
import Ch14S2 from "./ch14-02-right-panel-tech";
// Chapter 15
import Ch15S1 from "./ch15-01-app-menu-ui";
import Ch15S2 from "./ch15-02-settings-ui";
import Ch15S3 from "./ch15-03-settings-tech";
// Chapter 16
import Ch16S1 from "./ch16-01-concurrency-ui";
import Ch16S2 from "./ch16-02-sync-flow";
import Ch16S3 from "./ch16-03-sync-tech";
// Chapter 17
import Ch17S1 from "./ch17-01-auth-ui";
import Ch17S2 from "./ch17-02-rbac";
import Ch17S3 from "./ch17-03-admin-ui";
import Ch17S4 from "./ch17-04-auth-tech";
// Chapter 18-23
import Ch18S1 from "./ch18-01-feedback-ui";
import Ch18S2 from "./ch18-02-feedback-tech";
import Ch19S1 from "./ch19-01-activity-ui";
import Ch19S2 from "./ch19-02-activity-tech";
import Ch20S1 from "./ch20-01-enforcement";
import Ch21S1 from "./ch21-01-endpoint-catalogue";
import Ch22S1 from "./ch22-01-db-map";
import Ch22S2 from "./ch22-02-constraints";
import Ch23S1 from "./ch23-01-closing";

export const slides: SlideMeta[] = [
  { id: "cover", chapter: "Cover", title: "WorkFlowy — Frontend Deck", Component: CoverSlide },
  { id: "reading-guide", chapter: "Chapter 0", title: "How to read this deck", Component: ReadingGuideSlide },

  { id: "ch1-divider", chapter: "Chapter 1", title: "WorkFlowy in 60 seconds", Component: makeDivider("Chapter 1", "WorkFlowy in 60 seconds", "One model, one tree, many views.") },
  { id: "ch1-1", chapter: "Chapter 1", title: "The big idea", Component: Ch1S1 },
  { id: "ch1-2", chapter: "Chapter 1", title: "The Item model", Component: Ch1S2 },
  { id: "ch1-3", chapter: "Chapter 1", title: "Views over the tree", Component: Ch1S3 },

  { id: "ch2-divider", chapter: "Chapter 2", title: "App Shell", Component: makeDivider("Chapter 2", "App Shell", "The frame around every page.") },
  { id: "ch2-1", chapter: "Chapter 2", title: "App Shell — UI", Component: Ch2S1 },
  { id: "ch2-2", chapter: "Chapter 2", title: "Navbar", Component: Ch2S2 },
  { id: "ch2-3", chapter: "Chapter 2", title: "Left Sidebar", Component: Ch2S3 },
  { id: "ch2-4", chapter: "Chapter 2", title: "Endpoints & DB", Component: Ch2S4 },

  { id: "ch3-divider", chapter: "Chapter 3", title: "Recursive Rendering", Component: makeDivider("Chapter 3", "Recursive Rendering", "Every Item renders its own children.") },
  { id: "ch3-1", chapter: "Chapter 3", title: "Recursive UI", Component: Ch3S1 },
  { id: "ch3-2", chapter: "Chapter 3", title: "Zoom in / out", Component: Ch3S2 },
  { id: "ch3-3", chapter: "Chapter 3", title: "Endpoints & DB", Component: Ch3S3 },

  { id: "ch4-divider", chapter: "Chapter 4", title: "Editor & Interactions", Component: makeDivider("Chapter 4", "Editor & Interactions", "Keys, slash menu, toolbar.") },
  { id: "ch4-1", chapter: "Chapter 4", title: "Editor — UI", Component: Ch4S1 },
  { id: "ch4-2", chapter: "Chapter 4", title: "Keyboard", Component: Ch4S2 },
  { id: "ch4-3", chapter: "Chapter 4", title: "Slash menu", Component: Ch4S3 },
  { id: "ch4-4", chapter: "Chapter 4", title: "Floating toolbar", Component: Ch4S4 },
  { id: "ch4-5", chapter: "Chapter 4", title: "Endpoints & DB", Component: Ch4S5 },

  { id: "ch5-divider", chapter: "Chapter 5", title: "Bullet Anatomy", Component: makeDivider("Chapter 5", "Bullet Anatomy", "The bullet, the row, the ⋮ menu.") },
  { id: "ch5-1", chapter: "Chapter 5", title: "Bullet anatomy", Component: Ch5S1 },
  { id: "ch5-2", chapter: "Chapter 5", title: "Row menu (⋮)", Component: Ch5S2 },
  { id: "ch5-3", chapter: "Chapter 5", title: "Endpoints & DB", Component: Ch5S3 },

  { id: "ch6-divider", chapter: "Chapter 6", title: "Multi-Select & Drag-and-Drop", Component: makeDivider("Chapter 6", "Multi-Select & DnD", "Pick many, act once. Drag to move.") },
  { id: "ch6-1", chapter: "Chapter 6", title: "Multi-select", Component: Ch6S1 },
  { id: "ch6-2", chapter: "Chapter 6", title: "Drag & drop", Component: Ch6S2 },
  { id: "ch6-3", chapter: "Chapter 6", title: "Endpoints & DB", Component: Ch6S3 },

  { id: "ch7-divider", chapter: "Chapter 7", title: "Search", Component: makeDivider("Chapter 7", "Search Popover", "⌘K from anywhere — items, tags, commands.") },
  { id: "ch7-1", chapter: "Chapter 7", title: "Search — UI", Component: Ch7S1 },
  { id: "ch7-2", chapter: "Chapter 7", title: "How it works", Component: Ch7S2 },
  { id: "ch7-3", chapter: "Chapter 7", title: "Endpoints & DB", Component: Ch7S3 },

  { id: "ch8-divider", chapter: "Chapter 8", title: "Today & Calendar", Component: makeDivider("Chapter 8", "Today & Calendar", "Date-driven views + Quick Add.") },
  { id: "ch8-1", chapter: "Chapter 8", title: "Today & Calendar — UI", Component: Ch8S1 },
  { id: "ch8-2", chapter: "Chapter 8", title: "How it works", Component: Ch8S2 },
  { id: "ch8-3", chapter: "Chapter 8", title: "Endpoints & DB", Component: Ch8S3 },

  { id: "ch9-divider", chapter: "Chapter 9", title: "Board & Dashboard", Component: makeDivider("Chapter 9", "Board & Dashboard", "Kanban + workspace metrics.") },
  { id: "ch9-1", chapter: "Chapter 9", title: "Board view", Component: Ch9S1 },
  { id: "ch9-2", chapter: "Chapter 9", title: "Dashboard view", Component: Ch9S2 },
  { id: "ch9-3", chapter: "Chapter 9", title: "Endpoints & DB", Component: Ch9S3 },

  { id: "ch10-divider", chapter: "Chapter 10", title: "Mirrors", Component: makeDivider("Chapter 10", "Mirrors", "The same item in many places.") },
  { id: "ch10-1", chapter: "Chapter 10", title: "Mirrors — UI", Component: Ch10S1 },
  { id: "ch10-2", chapter: "Chapter 10", title: "Create / detach / cycles", Component: Ch10S2 },
  { id: "ch10-3", chapter: "Chapter 10", title: "Endpoints & DB", Component: Ch10S3 },

  { id: "ch11-divider", chapter: "Chapter 11", title: "Templates", Component: makeDivider("Chapter 11", "Templates", "Save a subtree, stamp it anywhere.") },
  { id: "ch11-1", chapter: "Chapter 11", title: "Templates — UI", Component: Ch11S1 },
  { id: "ch11-2", chapter: "Chapter 11", title: "Endpoints & DB", Component: Ch11S2 },

  { id: "ch12-divider", chapter: "Chapter 12", title: "Share & Permissions", Component: makeDivider("Chapter 12", "Share & Permissions", "Three roles, inherited down the subtree.") },
  { id: "ch12-1", chapter: "Chapter 12", title: "Share dialog", Component: Ch12S1 },
  { id: "ch12-2", chapter: "Chapter 12", title: "Permissions model", Component: Ch12S2 },
  { id: "ch12-3", chapter: "Chapter 12", title: "Endpoints & DB", Component: Ch12S3 },

  { id: "ch13-divider", chapter: "Chapter 13", title: "Trash", Component: makeDivider("Chapter 13", "Trash", "Soft-delete + 30-day reaper.") },
  { id: "ch13-1", chapter: "Chapter 13", title: "Trash — UI", Component: Ch13S1 },
  { id: "ch13-2", chapter: "Chapter 13", title: "Restore & reaper", Component: Ch13S2 },
  { id: "ch13-3", chapter: "Chapter 13", title: "Endpoints & DB", Component: Ch13S3 },

  { id: "ch14-divider", chapter: "Chapter 14", title: "Right-side panel", Component: makeDivider("Chapter 14", "Right-side panel", "Handbook · Hotkeys · What's New.") },
  { id: "ch14-1", chapter: "Chapter 14", title: "Right panel — UI", Component: Ch14S1 },
  { id: "ch14-2", chapter: "Chapter 14", title: "Tabs & data", Component: Ch14S2 },

  { id: "ch15-divider", chapter: "Chapter 15", title: "App menu, themes, settings", Component: makeDivider("Chapter 15", "App menu & Settings", "Theme · font · density · per-user prefs.") },
  { id: "ch15-1", chapter: "Chapter 15", title: "App menu (⋮)", Component: Ch15S1 },
  { id: "ch15-2", chapter: "Chapter 15", title: "Settings page", Component: Ch15S2 },
  { id: "ch15-3", chapter: "Chapter 15", title: "Endpoints & DB", Component: Ch15S3 },

  { id: "ch16-divider", chapter: "Chapter 16", title: "Concurrency, sync, offline", Component: makeDivider("Chapter 16", "Concurrency & Sync", "Edit offline, replay on reconnect.") },
  { id: "ch16-1", chapter: "Chapter 16", title: "Concurrency model", Component: Ch16S1 },
  { id: "ch16-2", chapter: "Chapter 16", title: "Sync flow", Component: Ch16S2 },
  { id: "ch16-3", chapter: "Chapter 16", title: "Endpoints & DB", Component: Ch16S3 },

  { id: "ch17-divider", chapter: "Chapter 17", title: "User management", Component: makeDivider("Chapter 17", "User Management", "Auth · roles · admin console.") },
  { id: "ch17-1", chapter: "Chapter 17", title: "Auth flow", Component: Ch17S1 },
  { id: "ch17-2", chapter: "Chapter 17", title: "RBAC roles", Component: Ch17S2 },
  { id: "ch17-3", chapter: "Chapter 17", title: "Admin UI", Component: Ch17S3 },
  { id: "ch17-4", chapter: "Chapter 17", title: "Endpoints & DB", Component: Ch17S4 },

  { id: "ch18-divider", chapter: "Chapter 18", title: "Feedback Reporting", Component: makeDivider("Chapter 18", "Feedback Reporting", "User submits · admin reviews.") },
  { id: "ch18-1", chapter: "Chapter 18", title: "Feedback — UI", Component: Ch18S1 },
  { id: "ch18-2", chapter: "Chapter 18", title: "Endpoints & DB", Component: Ch18S2 },

  { id: "ch19-divider", chapter: "Chapter 19", title: "Activity Feed", Component: makeDivider("Chapter 19", "Activity Feed", "Who did what, when.") },
  { id: "ch19-1", chapter: "Chapter 19", title: "Activity — UI", Component: Ch19S1 },
  { id: "ch19-2", chapter: "Chapter 19", title: "Endpoints & DB", Component: Ch19S2 },

  { id: "ch20-divider", chapter: "Chapter 20", title: "Enforcement Rules", Component: makeDivider("Chapter 20", "Enforcement Rules", "Guardrails the codebase enforces.") },
  { id: "ch20-1", chapter: "Chapter 20", title: "Four guardrails", Component: Ch20S1 },

  { id: "ch21-divider", chapter: "Chapter 21", title: "Endpoint Catalogue", Component: makeDivider("Chapter 21", "Endpoint Catalogue", "Every REST route on one page.") },
  { id: "ch21-1", chapter: "Chapter 21", title: "All endpoints", Component: Ch21S1 },

  { id: "ch22-divider", chapter: "Chapter 22", title: "Database Map", Component: makeDivider("Chapter 22", "Database Map", "Two DBs, one logical link.") },
  { id: "ch22-1", chapter: "Chapter 22", title: "ERD overview", Component: Ch22S1 },
  { id: "ch22-2", chapter: "Chapter 22", title: "Key constraints", Component: Ch22S2 },

  { id: "ch23-closing", chapter: "Chapter 23", title: "That's WorkFlowy", Component: Ch23S1 },
];
