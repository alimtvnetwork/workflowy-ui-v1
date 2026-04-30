import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 18 · Feedback" title="Submit · review · resolve">
      <Wireframe>{`  USER SIDE                            ADMIN SIDE  (/admin/feedback)
  ──────────────────────────           ────────────────────────────────
  ⋮ → Send feedback                    Status   Subject          From
  ┌────────────────────────┐           ──────────────────────────────────
  │ Type   ▾ Bug / Idea     │          🟡 Open   Tab outdent broken  alice
  │ Subject [           ]   │          🟢 Done   Add dark theme      bob
  │ Body                    │          🔴 Wont   Mobile widget       carol
  │ [                    ]  │
  │ [✓] Attach diagnostics  │          Click row → details + reply
  │ [Send]                  │          Buttons: [Open] [In progress]
  └────────────────────────┘                    [Resolved] [Won't fix]`}</Wireframe>
    </SlideLayout>
  );
}
