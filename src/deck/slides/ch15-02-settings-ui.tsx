import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 15 · Settings page" title="Everything per-user, all in one place">
      <Wireframe>{`  ⚙  Settings
  ───────────────────────────────────────────────
  Account
   Display name   [ Alex Lee            ]
   Email          alex@acme.com  (verified)
   Timezone       [ Asia/Kuala_Lumpur ▾ ]
   Avatar         👤  [Upload]

  Appearance
   Theme          ◐ Light  ● Dark  ○ System
   Font           ● Sans  ○ Serif  ○ Mono
   Density        ● Cosy  ○ Compact

  Editor
   Markdown shortcuts        [ ✓ ]
   Smart-quote auto-convert  [ ✓ ]
   Fractal conversations     [   ]

   [Save changes]    [Reset to defaults]`}</Wireframe>
    </SlideLayout>
  );
}
