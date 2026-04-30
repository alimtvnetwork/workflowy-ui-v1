import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 3 · Recursive rendering" title="Every row renders its children">
      <Wireframe caption="The page itself is just <Item> at depth 0. Each Item renders its own children.">{`<Page itemId={focusedId}>
  └─ <Item id="1">  Q3 Roadmap
       ├─ <Item id="2">  • Ship onboarding v2
       │     ├─ <Item id="5">  ☐ Wire signup
       │     └─ <Item id="6">  ☐ Welcome email
       ├─ <Item id="3">  • Hire 2 engineers
       └─ <Item id="4">  ▣ Design system  (Board)
             ├─ Todo  → children rendered as cards
             ├─ Doing
             └─ Done`}</Wireframe>
      <p className="mt-8 text-2xl text-muted-foreground">
        Same component, called recursively. The renderer chooses a sub-component based on{" "}
        <span className="font-mono text-foreground">ItemTypeId</span>.
      </p>
    </SlideLayout>
  );
}
