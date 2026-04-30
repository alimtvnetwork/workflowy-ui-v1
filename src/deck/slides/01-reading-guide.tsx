import { SlideLayout } from "../SlideLayout";

export default function ReadingGuideSlide() {
  return (
    <SlideLayout chapter="Chapter 0" title="How to read this deck" subtitle="Three slides per feature, written for first-time users.">
      <div className="grid grid-cols-3 gap-8 mt-6">
        <Card label="Slide A" title="UI Walkthrough" body="An ASCII wireframe of the screen, with each region labeled in plain English." />
        <Card label="Slide B" title="How it Works" body="Numbered steps: where you click, what opens, what happens next." />
        <Card label="Slide C" title="Endpoints & DB" body="The REST endpoints called and the database tables touched. Technical." />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-8">
        <Legend title="Keyboard">
          <KeyRow keys="← / →" desc="Previous / next slide" />
          <KeyRow keys="Space" desc="Next slide" />
          <KeyRow keys="G" desc="Grid view (overview)" />
          <KeyRow keys="F" desc="Fullscreen present" />
          <KeyRow keys="Esc" desc="Exit fullscreen / grid" />
        </Legend>
        <Legend title="Source folders covered">
          <Bullet>spec/31-app · App behavior</Bullet>
          <Bullet>spec/32-ui-design · UI &amp; visual</Bullet>
          <Bullet>spec/33-feedback-report</Bullet>
          <Bullet>spec/34-activity-feed</Bullet>
          <Bullet>spec/35-enforcement-rules</Bullet>
          <Bullet>spec/36-user-management</Bullet>
        </Legend>
      </div>
    </SlideLayout>
  );
}

function Card({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 h-full">
      <div className="text-sm tracking-widest uppercase text-muted-foreground">{label}</div>
      <div className="mt-3 text-4xl font-semibold text-foreground">{title}</div>
      <p className="mt-4 text-xl text-muted-foreground">{body}</p>
    </div>
  );
}

function Legend({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border p-8">
      <div className="text-2xl font-semibold text-foreground mb-4">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function KeyRow({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 text-xl">
      <kbd className="px-3 py-1 rounded bg-muted border border-border font-mono min-w-[110px] text-center">
        {keys}
      </kbd>
      <span className="text-muted-foreground">{desc}</span>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return <div className="text-xl text-muted-foreground">• {children}</div>;
}
