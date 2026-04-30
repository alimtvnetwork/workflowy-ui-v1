import { SlideLayout } from "../SlideLayout";
import { Link } from "react-router-dom";

export default function Closing() {
  return (
    <SlideLayout chapter="Closing" title="Three things to take with you"
      subtitle="If you remember nothing else from this deck, remember these.">
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">1</div>
          <div className="text-xl font-medium mb-2">Closed enums everywhere</div>
          <p className="text-base text-muted-foreground">FeedbackType (4) and FeedbackStatus (6). The transition matrix is one Record. Adding a value = ADR + migration + Zod bump in the same PR.</p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">2</div>
          <div className="text-xl font-medium mb-2">One writer per column</div>
          <p className="text-base text-muted-foreground">submitFeedback creates rows. transitionFeedback owns Status. PurgeJob owns delete. DeleteMyFeedback owns user-scoped delete. CI enforces it.</p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">3</div>
          <div className="text-xl font-medium mb-2">Retention is a constant</div>
          <p className="text-base text-muted-foreground">90 days, computed at INSERT, indexed. Soft-delete is forbidden. GDPR delete is atomic, hashed in telemetry, and logs counts only.</p>
        </div>
      </div>
      <div className="mt-12 text-center text-base text-muted-foreground">
        Live reference impl at{" "}
        <Link to="/feedback" className="text-foreground underline">/feedback</Link>
        {" · "}deck index at <Link to="/" className="text-foreground underline">/</Link>
      </div>
    </SlideLayout>
  );
}
