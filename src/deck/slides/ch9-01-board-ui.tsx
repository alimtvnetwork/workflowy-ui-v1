import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockNavbar, Chip } from "../components/MockUI";

function Card({ title, tag }: { title: string; tag?: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-3 text-sm shadow-sm">
      <div className="text-foreground">{title}</div>
      {tag && <div className="mt-2"><Chip tone="primary">{tag}</Chip></div>}
    </div>
  );
}

function Column({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-0 rounded-lg bg-muted/40 p-3 space-y-2">
      <div className="flex items-center justify-between text-sm font-semibold text-foreground px-1">
        <span>{title}</span>
        <Chip>{count}</Chip>
      </div>
      {children}
      <button className="w-full text-left text-xs text-muted-foreground py-1.5 px-1 hover:text-foreground">＋ Add card</button>
    </div>
  );
}

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 9 · Board view" title="A BoardProject renders its children as columns">
      <MockWindow className="mx-auto max-w-[1400px]">
        <MockNavbar breadcrumb="Home › Work › ▣ Q3 Roadmap" />
        <div className="p-6 bg-background min-h-[480px] flex gap-3">
          <Column title="Todo" count={3}>
            <Card title="Land design system" tag="#design" />
            <Card title="Q3 OKRs" />
            <Card title="Pricing v2" tag="#growth" />
          </Column>
          <Column title="Doing" count={2}>
            <Card title="Hire 2 engineers" />
            <Card title="Refactor sync" tag="#tech" />
          </Column>
          <Column title="Done" count={2}>
            <Card title="✓ Onboarding v2" />
            <Card title="✓ Launch site" />
          </Column>
          <div className="flex-1 min-w-0 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
            ＋ Column
          </div>
        </div>
      </MockWindow>
      <p className="mt-4 text-center text-base text-muted-foreground">
        Each column = a child Item (BoardColumn). Each card = a grandchild Item. Drag updates ParentItemId + FractionalIndex.
      </p>
    </SlideLayout>
  );
}
