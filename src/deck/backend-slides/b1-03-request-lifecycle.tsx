import { SlideLayout } from "../../SlideLayout";
import { Wireframe } from "../../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="B-1 · Request lifecycle" title="From cookie to commit, in 9 steps">
      <Wireframe size={18}>{`  Browser         HTTP layer       Handler            Service          DB
  ────────        ──────────       ────────           ────────         ────
  POST /sync ───▶ parse cookie ─▶  authenticate(s) ─▶ resolveWorkspace ─▶ Root DB
                                                       │
                  validate body ◀── Zod schema         ▼
                  (reject 400)                      acquire App DB conn
                                                       │
                                   apply ops in tx ───▶ App DB (BEGIN)
                                       │                  ├─ INSERT/UPDATE Item
                                       │                  └─ INSERT ActivityLog
                                       ▼
                                   compute newCursor
                                       │
                                   COMMIT ─────────────▶ App DB
                                       │
                                   publish to SSE bus
                                       │
                  serialize ack ◀──────┘
  200 OK ◀──── { newCursor, remoteOps }`}</Wireframe>
      <p className="mt-6 text-xl text-muted-foreground">
        Every endpoint follows this skeleton. Variation lives in the service layer, never in the HTTP layer.
      </p>
    </SlideLayout>
  );
}
