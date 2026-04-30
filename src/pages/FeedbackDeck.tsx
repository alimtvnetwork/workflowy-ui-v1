import { DeckShell } from "@/deck/DeckShell";
import { feedbackSlides } from "@/deck/feedback-slides";

export default function FeedbackDeck() {
  return <DeckShell slides={feedbackSlides} title="WorkFlowy — Feedback Report" />;
}
