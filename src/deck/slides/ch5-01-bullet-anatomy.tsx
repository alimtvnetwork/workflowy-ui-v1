import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 5 · Bullet anatomy" title="Three things hide on every row">
      <Wireframe>{`     ⋮      •     The quick brown fox
     ▲      ▲     ▲
     │      │     │
     │      │     └── Content area: editable rich text
     │      └──────── Bullet (●): drag handle + zoom-in target
     └─────────────── Row menu (⋮): appears on hover or ⌘/

  Hovering also reveals:
     ► expand/collapse triangle    (when item has children)
     ☐ task checkbox              (when ItemTypeId = Task)
     📅 due date chip              (when DueDate set)
     🪞 mirror badge               (when MirrorOfItemId set)`}</Wireframe>
    </SlideLayout>
  );
}
