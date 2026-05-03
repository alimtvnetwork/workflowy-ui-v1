import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockNavbar, MockSidebar, MockOutline, MockPanel, Chip } from "../components/MockUI";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 2 · App Shell" title="The frame around every page">
      <MockWindow url="workflowy.app/item/q3-roadmap" className="mx-auto max-w-[1500px]">
        <MockNavbar breadcrumb="Home › Work › Q3 Roadmap" />
        <div className="grid grid-cols-[224px_1fr_280px] h-[520px]">
          <MockSidebar
            items={[
              { icon: "★", label: "Today" },
              { icon: "🏠", label: "Home" },
              { icon: "☐", label: "Inbox" },
              { icon: "✎", label: "Drafts" },
              { icon: "@", label: "Mentions" },
              { icon: "📅", label: "Calendar" },
              { icon: "🗑", label: "Trash" },
              { icon: "＋", label: "New node" },
            ]}
          />
          <div className="p-8 bg-background">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Q3 Roadmap</h2>
            <MockOutline
              rows={[
                { text: "Ship onboarding v2", badges: <Chip tone="primary">Task</Chip> },
                { text: "Hire 2 engineers" },
                { text: "Land design system", badges: <Chip tone="success">Done</Chip> },
              ]}
            />
          </div>
          <div className="border-l border-border p-4 bg-muted/20 space-y-3">
            <MockPanel title="Right panel">Handbook</MockPanel>
            <MockPanel>Hotkeys</MockPanel>
            <MockPanel>What's New</MockPanel>
          </div>
        </div>
      </MockWindow>
      <p className="mt-6 text-center text-xl text-muted-foreground">
        Top: Navbar · Left: Sidebar · Center: page · Right: collapsible panel.
      </p>
    </SlideLayout>
  );
}
