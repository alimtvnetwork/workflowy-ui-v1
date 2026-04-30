import { DeckShell } from "@/deck/DeckShell";
import { enforcementSlides } from "@/deck/enforcement-slides";

export default function EnforcementDeck() {
  return <DeckShell slides={enforcementSlides} title="WorkFlowy — Enforcement Rules" />;
}
