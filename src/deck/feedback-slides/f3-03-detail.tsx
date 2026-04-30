import { SlideLayout } from "../SlideLayout";

const ROWS = [
  { section: "Header", content: "Title · FeedbackType badge · FeedbackStatus badge", gate: "G-33-AR-HEADER-COMPLETE" },
  { section: "Body", content: "Plain text with <pre>-like wrapping — never Markdown / dangerouslySetInnerHTML", gate: "G-33-AR-BODY-PLAIN-TEXT" },
  { section: "Diagnostics", content: "<dl> of the 9 schema keys — collapsed by default", gate: "G-33-AR-DIAG-COLLAPSED" },
  { section: "Screenshot", content: "Lazy <img>; only rendered if ScreenshotBlobRef !== null", gate: "G-33-AR-SCREENSHOT-LAZY" },
  { section: "Submitter", content: "SubmittedByUserId resolved to display name — never raw ID", gate: "G-33-AR-SUBMITTER-RESOLVED" },
  { section: "Timeline", content: "SubmittedAt, ResolvedAt — relative time + UTC tooltip", gate: "G-33-AR-TIMELINE" },
  { section: "Transition", content: "<Select> populated from ALLOWED_TRANSITIONS[currentStatus]", gate: "G-33-AR-TRANSITION-FROM-SSOT" },
];

export default function Slide() {
  return (
    <SlideLayout chapter="Phase F-3 · Admin" title="Detail drawer — XSS surface lives here"
      subtitle="Submitter Body is untrusted. Render as plain text. Auto-fetching screenshots before drawer open is a privacy + bandwidth bug.">
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left text-base">
          <thead className="bg-muted/60 text-sm">
            <tr>
              <th className="px-5 py-3 w-40">Section</th>
              <th className="px-5 py-3">Rule</th>
              <th className="px-5 py-3 w-56">Gate</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.gate} className="border-t border-border align-top">
                <td className="px-5 py-3 font-medium">{r.section}</td>
                <td className="px-5 py-3 text-foreground text-sm">{r.content}</td>
                <td className="px-5 py-3"><span className="px-2 py-0.5 rounded bg-primary/15 text-primary font-mono text-xs">{r.gate}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideLayout>
  );
}
