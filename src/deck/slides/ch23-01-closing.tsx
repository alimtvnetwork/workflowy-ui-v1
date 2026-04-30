import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout bare>
      <div className="m-auto text-center">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
          End of frontend deck
        </div>
        <h1 className="text-[120px] leading-none font-semibold tracking-tight text-foreground">
          That's WorkFlowy.
        </h1>
        <p className="mt-10 text-3xl text-muted-foreground max-w-[1500px] mx-auto">
          One Item table, recursive rendering, and a small set of REST endpoints —
          everything you saw is built from those three things.
        </p>
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-[1400px] mx-auto text-left">
          <div className="rounded-2xl border border-border p-6">
            <div className="text-sm uppercase tracking-widest text-muted-foreground">Up next</div>
            <div className="mt-2 text-2xl font-semibold">Backend deck</div>
            <p className="mt-2 text-base text-muted-foreground">Schema deep-dives, sync protocol, reapers, SSE.</p>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <div className="text-sm uppercase tracking-widest text-muted-foreground">Source</div>
            <div className="mt-2 text-2xl font-semibold">spec/31–36</div>
            <p className="mt-2 text-base text-muted-foreground">Every slide cites the folder it came from.</p>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <div className="text-sm uppercase tracking-widest text-muted-foreground">Navigate</div>
            <div className="mt-2 text-2xl font-semibold">G · F · ← →</div>
            <p className="mt-2 text-base text-muted-foreground">Grid · fullscreen · prev/next.</p>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
