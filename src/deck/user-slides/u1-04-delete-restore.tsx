import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-1 · Account" title="Delete account & restore from backup"
      subtitle="Soft delete with 30-day grace · daily backups, destructive restore takes a safety snapshot first.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <Code label="Delete account">{`POST /me/account
{
  "Password": "…",
  "Confirm": "delete my account"
}
→ soft-delete · 30-day grace
→ login during grace cancels
→ daily WP cron purges expired
   User + cascaded Item / Mirror / Share rows`}</Code>
        <Code label="Restore from backup">{`GET  /me/backups        → list (30 nightly)
POST /me/backups/{id}/restore
   1. snapshot current tree (safety)
   2. overwrite with backup state
   3. push safety snapshot to top of list
→ destructive · diff summary shown first`}</Code>
      </div>
      <Footer at="AT-USERMANAGEMENT-04"
        rule="Account delete is soft + reversible for 30 days; restore is destructive but always preceded by an automatic safety snapshot." />
    </SlideLayout>
  );
}
