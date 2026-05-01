import { DeckShell } from "@/deck/DeckShell";
import { activitySlides } from "@/deck/activity-slides";

export default function ActivityDeck() {
  return <DeckShell slides={activitySlides} title="WorkFlowy — Activity Feed" />;
}
