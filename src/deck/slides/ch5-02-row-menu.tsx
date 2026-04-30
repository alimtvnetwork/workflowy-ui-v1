import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 5 · Row menu (⋮)" title="What every option does">
      <div className="grid grid-cols-2 gap-10">
        <ul className="space-y-3 text-xl">
          <li>📋 <span className="text-foreground">Duplicate</span> — copy item + subtree</li>
          <li>➜ <span className="text-foreground">Move to…</span> — picker dialog</li>
          <li>🪞 <span className="text-foreground">Mirror to…</span> — create placeholder</li>
          <li>🔗 <span className="text-foreground">Copy link</span> — /item/:id URL</li>
          <li>📤 <span className="text-foreground">Share</span> — opens share dialog</li>
          <li>⭐ <span className="text-foreground">Add to favourites</span></li>
        </ul>
        <StepList
          steps={[
            { action: "Hover the row → ⋮ appears at the left margin", result: "Or press ⌘/ on the focused row" },
            { action: "Click ⋮", result: "Menu opens beside the bullet" },
            { action: "Choose an action", result: "Dialog opens or action runs immediately" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
