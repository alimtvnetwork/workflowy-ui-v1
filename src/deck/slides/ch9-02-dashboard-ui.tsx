import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 9 · Dashboard view" title="Aggregated counts across the workspace">
      <Wireframe size={20}>{`  ┌─ Tasks open ──┐  ┌─ Due today ──┐  ┌─ Overdue ────┐  ┌─ Done 7d ───┐
  │     127       │  │      8       │  │      3       │  │     42      │
  └───────────────┘  └──────────────┘  └──────────────┘  └─────────────┘

  ┌─ Activity (last 14 days) ────────────────────────────────────────┐
  │  ▁▂▃▅▇▆▃▂▄▆▇▇▅▃                                                 │
  └──────────────────────────────────────────────────────────────────┘

  ┌─ Top tags ──────────┐   ┌─ Recently completed ───────────────────┐
  │ #q3   #design  #bug │   │ ☑ Pay rent                              │
  │ #spike #ux     #mvp │   │ ☑ Review PR                             │
  └─────────────────────┘   └─────────────────────────────────────────┘`}</Wireframe>
    </SlideLayout>
  );
}
