import { SlideLayout } from "../SlideLayout";
import { KV, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-2 · Auth" title="Token lifecycle (5 kinds)"
      subtitle="Forbidden: localStorage / sessionStorage / IndexedDB for any token.">
      <KV rows={[
        { k: "WPSession", v: "WP login cookie · HttpOnly · 14 d default · sent every request" },
        { k: "AccessToken", v: <><strong>15 min idle / 8 h absolute</strong> · memory only · Bearer header</> },
        { k: "RefreshToken", v: <><strong>7 d idle / 30 d absolute</strong> · HttpOnly Secure SameSite=Strict cookie · only on /auth/refresh</> },
        { k: "SSEToken", v: <>One-shot ticket · 30 s to connect · channel lives until AccessToken expires</> },
        { k: "CsrfToken", v: "Double-submit cookie + X-WF-CSRF header on POST/PUT/DELETE" },
      ]} />
      <Footer at="AT-USERMANAGEMENT-09" gate="G-25-TOKEN-LIFECYCLE-COVERAGE"
        rule="RefreshToken is never readable by JS; AccessToken is never persisted; rotation MUST happen on every privilege change." />
    </SlideLayout>
  );
}
