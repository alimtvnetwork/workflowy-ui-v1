import { DeckShell } from "@/deck/DeckShell";
import { opsSlides } from "@/deck/ops-slides";

export default function OpsDeck() {
  return <DeckShell slides={opsSlides} title="WorkFlowy — Operations" />;
}
