import type { SlideMeta } from "../types";
import CoverSlide from "./00-cover";
import ReadingGuideSlide from "./01-reading-guide";

export const slides: SlideMeta[] = [
  { id: "cover", chapter: "Cover", title: "WorkFlowy — Frontend Deck", Component: CoverSlide },
  { id: "reading-guide", chapter: "Chapter 0", title: "How to read this deck", Component: ReadingGuideSlide },
];
