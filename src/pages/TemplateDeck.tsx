import { DeckShell } from "@/deck/DeckShell";
import { templateSlides } from "@/deck/template-slides";

export default function TemplateDeck() {
  return <DeckShell slides={templateSlides} title="WorkFlowy — Templates & Snapshot Semantics" />;
}
