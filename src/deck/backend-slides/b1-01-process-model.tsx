import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="B-1 · Architecture" title="Process model & two-DB split">
      <Wireframe size={18}>{`         ┌─────────────────── Single Node.js process ──────────────────┐
         │                                                              │
  HTTPS  │   ┌────────────┐    ┌────────────┐    ┌────────────────┐    │
  ──────▶│   │ HTTP layer │ ─▶ │  Handlers  │ ─▶ │ Service layer  │    │
         │   │ (REST+SSE) │    │ (Zod parse)│    │ (business code)│    │
         │   └────────────┘    └────────────┘    └────┬───────────┘    │
         │                                            │                 │
         │                       ┌────────────────────┼───────────────┐ │
         │                       ▼                    ▼               │ │
         │              ┌─────────────────┐  ┌──────────────────┐    │ │
         │              │   Root DB       │  │   App DB pool    │    │ │
         │              │ workflowy_root  │  │ one SQLite file  │    │ │
         │              │  identity +     │  │  per Workspace   │    │ │
         │              │  workspace map  │  │  item tree, etc. │    │ │
         │              └─────────────────┘  └──────────────────┘    │ │
         │                       ▲                    ▲               │ │
         │                       └─── NO SQL JOIN ─────┘              │ │
         │                                                            │ │
         │   ┌────────────┐    ┌────────────┐    ┌────────────────┐  │ │
         │   │ Reaper job │    │ Purge job  │    │ SSE fan-out    │  │ │
         │   │ daily      │    │ nightly    │    │ in-process bus │  │ │
         │   └────────────┘    └────────────┘    └────────────────┘  │ │
         └──────────────────────────────────────────────────────────────┘`}</Wireframe>
    </SlideLayout>
  );
}
