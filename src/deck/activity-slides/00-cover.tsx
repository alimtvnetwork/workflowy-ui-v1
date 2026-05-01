import { SlideLayout } from "../SlideLayout";

export default function Cover() {
  return (
    <SlideLayout bare>
      <div className="m-auto text-center">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
          Activity Feed · Deep Dive
        </div>
        <h1 className="text-[120px] leading-none font-semibold tracking-tight text-foreground">
          One chokepoint.<br />Eight event types.<br />30-day reaper.
        </h1>
        <p className="mt-10 text-3xl text-muted-foreground max-w-[1400px] mx-auto">
          Every mutation flows through one capture function. Every payload is
          validated by a closed Zod schema. Every row purges itself.
        </p>
        <div className="mt-16 text-base tracking-[0.2em] uppercase text-muted-foreground">
          spec/34-activity-feed · 16 ATs · ~30 gates · activity.db (split)
        </div>
      </div>
    </SlideLayout>
  );
}
