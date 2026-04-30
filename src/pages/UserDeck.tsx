import { DeckShell } from "@/deck/DeckShell";
import { userSlides } from "@/deck/user-slides";

export default function UserDeck() {
  return <DeckShell slides={userSlides} title="WorkFlowy — User Management" />;
}
