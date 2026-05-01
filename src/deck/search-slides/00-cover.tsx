import { SlideLayout } from "../SlideLayout";

export default function Cover() {
  return (
    <SlideLayout bare>
      <div className="m-auto text-center">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
          Search & Ranking · Deep Dive
        </div>
        <h1 className="text-[120px] leading-none font-semibold tracking-tight text-foreground">
          One grammar.<br />Five buckets.<br />Sub-300 ms.
        </h1>
        <p className="mt-10 text-3xl text-muted-foreground max-w-[1400px] mx-auto">
          A deterministic relevance-then-recency search built on FTS5,
          driven by a closed EBNF grammar and rendered through one popover.
        </p>
        <div className="mt-16 text-base tracking-[0.2em] uppercase text-muted-foreground">
          spec/31-app §16 · spec/32-ui-design §06/02 · 5 ATs · live impl at /search-sim
        </div>
      </div>
    </SlideLayout>
  );
}
