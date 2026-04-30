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
];
