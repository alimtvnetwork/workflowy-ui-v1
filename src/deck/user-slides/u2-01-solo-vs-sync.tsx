import { SlideLayout } from "../SlideLayout";
import { KV, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-2 · Auth" title="Solo vs Sync mode"
      subtitle="Same UI, different identity model. Solo never reaches the network for auth.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <div className="rounded-lg border border-border p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Solo</div>
          <div className="text-2xl font-semibold mb-3">Local-only account</div>
          <ul className="text-base space-y-1.5 text-foreground">
            <li>· Single SQLite file under user data dir</li>
            <li>· No password, no MFA, no sessions</li>
            <li>· `currentUserId` = device-bound UUID</li>
            <li>· Backups are local zips</li>
          </ul>
        </div>
        <div className="rounded-lg border border-primary/40 p-6">
          <div className="text-xs uppercase tracking-wider text-primary mb-2">Sync</div>
          <div className="text-2xl font-semibold mb-3">Server-issued identity</div>
          <ul className="text-base space-y-1.5 text-foreground">
            <li>· Argon2id password · optional MFA</li>
            <li>· Session cookie + AccessToken + RefreshToken</li>
            <li>· `currentUserId` from `WPSession` only</li>
            <li>· Daily server-side backup snapshots</li>
          </ul>
        </div>
      </div>
      <Footer at="AT-USERMANAGEMENT-07"
        rule="Solo and sync share the same UI shell; auth code paths diverge at the AuthBoundary, never inside feature components." />
    </SlideLayout>
  );
}
