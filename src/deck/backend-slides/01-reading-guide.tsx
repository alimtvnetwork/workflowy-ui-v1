import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout
      chapter="Reading guide"
      title="What this deck assumes"
      subtitle="If you've already seen the frontend deck, this is its other half."
    >
      <div className="grid grid-cols-3 gap-8 mt-6">
        <Card label="Audience" body="Engineers building, debugging, or extending the backend." />
        <Card label="Style" body="One concept per slide. SQL, sequence diagrams, code snippets — no UI wireframes." />
        <Card label="Source" body="spec/31-app/06-endpoints, 07-db-diagram, 02-workflows + spec/35-enforcement-rules." />
      </div>
      <div className="mt-12 grid grid-cols-2 gap-8">
        <Box title="What we cover">
          <Bullet>Two-DB architecture & boundary rules</Bullet>
          <Bullet>Sync protocol (ops, LWW, cursors, SSE)</Bullet>
          <Bullet>Item ops · mirrors · templates · sharing</Bullet>
          <Bullet>Trash reaper · search FTS5 · activity capture</Bullet>
          <Bullet>Migrations · indexes · enforcement rules</Bullet>
        </Box>
        <Box title="What we don't cover">
          <Bullet>UI components & screens (see frontend deck)</Bullet>
          <Bullet>Deployment ops detail (separate runbook)</Bullet>
          <Bullet>Marketing / product positioning</Bullet>
        </Box>
      </div>
    </SlideLayout>
  );
}

function Card({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <div className="text-sm tracking-widest uppercase text-muted-foreground">{label}</div>
      <p className="mt-4 text-xl text-muted-foreground">{body}</p>
    </div>
  );
}
function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border p-8">
      <div className="text-2xl font-semibold mb-4">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Bullet({ children }: { children: React.ReactNode }) {
  return <div className="text-xl text-muted-foreground">• {children}</div>;
}
