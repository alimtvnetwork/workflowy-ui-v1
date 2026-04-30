import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 8 · Today & Calendar" title="Date-driven views over the same items">
      <Wireframe>{`  TODAY (★)                          CALENDAR (📅)
  ─────────────────────────         ──────────────────────────────
  Wed · 30 Apr 2026                 ◀  April 2026  ▶
                                    Mo Tu We Th Fr Sa Su
  ☐ Pay rent                         . . 1  2  3  4  5
  ☐ Standup notes                    6 7 8  9 10 11 12
  ☑ Review PR                       13 14 15 16 17 18 19
  ─────────────────────────         20 21 22 23 24 25 26
  + Add item to today               27 28 29 [30] · ·  ← items appear as dots

  Quick Add (⌘⇧N) appends to Inbox with optional due-date pill.`}</Wireframe>
    </SlideLayout>
  );
}
