import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 10 · Mirrors" title="The same item in many places">
      <Wireframe>{`   Home
   ├─ • Work
   │   └─ • 🪞 Hire 2 engineers   ──┐
   └─ • Personal                     │   both rows point to the
       └─ • 🪞 Hire 2 engineers   ──┤   SAME canonical Item
                                     │   (peer group)
   Edit either row → both update.   ◀┘
   Delete either row → only that placeholder is removed;
   the canonical item lives until the LAST mirror is deleted.`}</Wireframe>
    </SlideLayout>
  );
}
