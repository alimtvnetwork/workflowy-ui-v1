import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockNavbar, MockOutline, Chip } from "../components/MockUI";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 3 · Recursive rendering" title="Every row renders its children">
      <MockWindow url="workflowy.app/item/q3-roadmap" className="mx-auto max-w-[1300px]">
        <MockNavbar breadcrumb="Home › Q3 Roadmap" />
        <div className="p-8 bg-background min-h-[480px]">
          <MockOutline
            rows={[
              {
                text: <span className="font-semibold">Q3 Roadmap</span>,
                children: [
                  {
                    text: "Ship onboarding v2",
                    children: [
                      { text: "Wire signup", badges: <Chip>☐ Task</Chip> },
                      { text: "Welcome email", badges: <Chip>☐ Task</Chip> },
                    ],
                  },
                  { text: "Hire 2 engineers" },
                  {
                    text: "Design system",
                    badges: <Chip tone="primary">▣ Board</Chip>,
                    children: [
                      { text: "Todo — children render as cards", muted: true },
                      { text: "Doing", muted: true },
                      { text: "Done", muted: true },
                    ],
                  },
                ],
              },
            ]}
          />
        </div>
      </MockWindow>
      <p className="mt-6 text-center text-xl text-muted-foreground">
        Same component, called recursively. The renderer chooses a sub-component based on{" "}
        <span className="font-mono text-foreground">ItemTypeId</span>.
      </p>
    </SlideLayout>
  );
}
