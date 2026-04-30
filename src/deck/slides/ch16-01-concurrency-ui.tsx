import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 16 · Concurrency" title="Edit offline, replay on reconnect">
      <Wireframe>{`  CLIENT (your browser)            SERVER
  ──────────────────────           ─────────────────────────
  type 'hello'  ──┐                 ┌──> applies ops
  press Tab     ──┤  outbox (FIFO)  │    LWW per (Item, field)
  delete 'x'    ──┘                 │    returns new cursor
                  │                 │
                  ▼                 ▲
   POST /sync  ──────────────────►  │
   { ops:[…], cursor:"abc" } ◄──────┘
                  ▼
   ack {newCursor:"def", remoteOps:[…]}
                  │
                  └──► merge remote ops, advance cursor

  • Outbox persists in IndexedDB while offline.
  • Conflicts resolved Last-Write-Wins per field.`}</Wireframe>
    </SlideLayout>
  );
}
