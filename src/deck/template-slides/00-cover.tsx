import { SlideLayout } from "../SlideLayout";

export default function Cover() {
  return (
    <SlideLayout bare>
      <div className="m-auto text-center">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
          Templates · Snapshot Semantics · Deep Dive
        </div>
        <h1 className="text-[120px] leading-none font-semibold tracking-tight text-foreground">
          One stamp.<br />Zero links.<br />Forever divergent.
        </h1>
        <p className="mt-10 text-3xl text-muted-foreground max-w-[1400px] mx-auto">
          A serialised JSON tree, a DFS clone with fresh UUIDs,
          and an explicit promise that templates and instances never speak again.
        </p>
        <div className="mt-16 text-base tracking-[0.2em] uppercase text-muted-foreground">
          spec/31-app §13 + §13b · 10 ATs · live impl at /template-sim
        </div>
      </div>
    </SlideLayout>
  );
}
