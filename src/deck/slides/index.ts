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
];
