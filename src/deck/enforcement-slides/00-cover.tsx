import { SlideLayout } from "../SlideLayout";

export default function Cover() {
  return (
    <SlideLayout bare>
      <div className="m-auto text-center">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
          Enforcement Rules · Deep Dive
        </div>
        <h1 className="text-[120px] leading-none font-semibold tracking-tight text-foreground">
          Make CI fail<br />before review.
        </h1>
        <p className="mt-10 text-3xl text-muted-foreground max-w-[1400px] mx-auto">
          Four mechanical layers — compile, lint, runtime, test — that turn
          every project guideline into a CI gate.
        </p>
        <div className="mt-16 text-base tracking-[0.2em] uppercase text-muted-foreground">
          spec/35-enforcement-rules · 14 ATs · 26 gates
        </div>
      </div>
    </SlideLayout>
  );
}
