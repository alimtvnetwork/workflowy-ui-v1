import { SlideLayout } from "../SlideLayout";
import { Link } from "react-router-dom";

export default function Closing() {
  return (
    <SlideLayout chapter="Closing" title="Three things to take with you"
      subtitle="If you remember nothing else from this deck, remember these.">
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">1</div>
          <div className="text-xl font-medium mb-2">One chokepoint</div>
          <p className="text-base text-muted-foreground">
            Every <code>ActivityEvent</code> originates in <code>captureEvent</code>.
            No direct INSERTs. No ad-hoc emitters. The compiler + grep + a CI gate
            keep it that way.
          </p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">2</div>
          <div className="text-xl font-medium mb-2">Eight closed event types</div>
          <p className="text-base text-muted-foreground">
            The <code>EventType</code> enum, the SQLite CHECK, the Zod payload
            map, and the row dispatcher all carry the same 8 values. Adding a
            ninth = four edits in one PR.
          </p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">3</div>
          <div className="text-xl font-medium mb-2">PurgeAfter is a column</div>
          <p className="text-base text-muted-foreground">
            Computed at INSERT, indexed, used in every WHERE clause. Mirror
            compaction is clamped by open cursors. The number 30 lives in code,
            not config.
          </p>
        </div>
      </div>
      <div className="mt-12 text-center text-base text-muted-foreground">
        Live reference impl at{" "}
        <Link to="/activity-feed" className="text-foreground underline">/activity-feed</Link>
        {" · "}deck index at <Link to="/" className="text-foreground underline">/</Link>
      </div>
    </SlideLayout>
  );
}
