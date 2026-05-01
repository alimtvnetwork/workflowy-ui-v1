import { DeckShell } from "@/deck/DeckShell";
import { searchSlides } from "@/deck/search-slides";

export default function SearchDeck() {
  return <DeckShell slides={searchSlides} title="WorkFlowy — Search & Ranking" />;
}
