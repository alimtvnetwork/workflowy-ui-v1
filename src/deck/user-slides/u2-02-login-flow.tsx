import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-2 · Auth" title="Login state machine"
      subtitle="Five states. Every transition has a binding AT row.">
      <div className="mt-8 flex justify-center">
        <Code label="States">{`            ┌──────────┐
            │ anonymous│
            └────┬─────┘
                 │ submit credentials
                 ▼
            ┌──────────┐ wrong pw   ┌──────────┐
            │credentials│──────────▶│ rejected │
            │  pending  │            └──────────┘
            └────┬─────┘
   has MFA?     │
   ┌────────────┴─────────────┐
   ▼                          ▼
┌──────────┐  6-digit ok  ┌────────────┐
│ mfa-     │─────────────▶│ session-   │
│ challenge│              │  active    │
└──────────┘              └────┬───────┘
                               │ /me/logout
                               ▼
                          ┌──────────┐
                          │ revoked  │
                          └──────────┘`}</Code>
      </div>
      <Footer at="AT-USERMANAGEMENT-08"
        rule="Every transition is server-driven; the client never marks itself authenticated without a server-issued AccessToken." />
    </SlideLayout>
  );
}
