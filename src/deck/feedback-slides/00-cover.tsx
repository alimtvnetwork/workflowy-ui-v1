import { SlideLayout } from "../SlideLayout";

export default function Cover() {
  return (
    <SlideLayout bare>
      <div className="m-auto text-center">
        <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
          Feedback Report · Deep Dive
        </div>
        <h1 className="text-[120px] leading-none font-semibold tracking-tight text-foreground">
          One inbox.<br />Closed enums.<br />90-day reaper.
        </h1>
        <p className="mt-10 text-3xl text-muted-foreground max-w-[1400px] mx-auto">
          A privacy-bounded feedback pipeline — single egress, single writer per
          column, fixed retention, GDPR-atomic deletion.
        </p>
        <div className="mt-16 text-base tracking-[0.2em] uppercase text-muted-foreground">
          spec/33-feedback-report · 14 ATs · ~50 gates · feedback.db (split)
        </div>
      </div>
    </SlideLayout>
  );
}
