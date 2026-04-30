import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 2 · Left Sidebar" title="Special nodes & favourites">
      <div className="grid grid-cols-2 gap-10">
        <div>
          <div className="text-2xl font-semibold mb-4">Default items</div>
          <ul className="space-y-3 text-xl text-muted-foreground">
            <li>★ <span className="text-foreground">Today</span> — items due today</li>
            <li>🏠 <span className="text-foreground">Home</span> — root of your tree</li>
            <li>☐ <span className="text-foreground">Inbox</span> — capture node</li>
            <li>✎ <span className="text-foreground">Drafts</span> — staging area</li>
            <li>@ <span className="text-foreground">Mentions</span> — items @-ing you</li>
            <li>📅 <span className="text-foreground">Calendar</span> — dated items</li>
            <li>🗑 <span className="text-foreground">Trash</span> — soft-deleted</li>
            <li>＋ <span className="text-foreground">New node</span> — create root child</li>
          </ul>
        </div>
        <div>
          <div className="text-2xl font-semibold mb-4">Favourites (drag to reorder)</div>
          <StepList
            steps={[
              { action: "Drag any item from the page onto the sidebar", result: "Adds a Favorite row (sidebar shortcut)" },
              { action: "Hold ⌥ while dragging", result: "Creates a Mirror in the sidebar instead of moving" },
              { action: "Drag rows within the sidebar", result: "Updates Favorite.FractionalIndex" },
            ]}
          />
        </div>
      </div>
    </SlideLayout>
  );
}
