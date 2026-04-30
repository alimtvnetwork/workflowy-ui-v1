import { SlideLayout } from "../../SlideLayout";

export default function CoverSlide() {
  return (
    <SlideLayout bare>
      <div className="m-auto text-center">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
          Backend Deck
        </div>
        <h1 className="text-[140px] leading-none font-semibold tracking-tight text-foreground">
          WorkFlowy
        </h1>
        <p className="mt-10 text-4xl text-muted-foreground max-w-[1500px] mx-auto">
          A tour of the engine room — schema, sync protocol, jobs, and the rules that keep two databases honest.
        </p>
        <div className="mt-20 text-xl text-muted-foreground">
          Press <kbd className="px-3 py-1 rounded bg-muted border border-border mx-1">→</kbd> to begin · pair with the
          <a href="/deck" className="underline mx-2">frontend deck</a>
        </div>
      </div>
    </SlideLayout>
  );
}
