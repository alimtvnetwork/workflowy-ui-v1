import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 4 · Slash menu" title="Type / to transform a row">
      <Wireframe>{`     • |
       ┌──── slash menu ──────────────────┐
       │ 🔠  Heading 1 / 2 / 3            │
       │ ☐  Task                          │
       │ 📋 Note                          │
       │ ▣  Board project                 │
       │ 📅 Date / due                    │
       │ <> Code block                    │
       │ ❝  Quote                         │
       │ 🔗 Mention / link                │
       │ 🪞 Mirror of…                    │
       │ 📎 Attachment                    │
       └──────────────────────────────────┘
    Filter by typing: /h1, /code, /board …`}</Wireframe>
    </SlideLayout>
  );
}
