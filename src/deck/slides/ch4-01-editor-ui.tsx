import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 4 · Editor" title="Inside an editable row">
      <Wireframe>{`        ┌─[ floating toolbar appears on selection ]──────────────┐
        │  B  I  U  S   H1 H2 H3   • A▾  ⬛▾   <>  ❝   🔗      │
        └─────────────────────────────────────────────────────────┘
   ⋮  •   The quick brown |fox jumps over the lazy dog
   ▲   ▲   ▲                ▲
   │   │   │                └─ caret (text editing)
   │   │   └─ row content (rich text: bold/italic/colors/code/quote/H1-H5)
   │   └─ bullet (drag handle, click = zoom)
   └─ ⋮  context menu (Move, Duplicate, Mirror, Share, Delete, …)`}</Wireframe>
    </SlideLayout>
  );
}
