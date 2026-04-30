import { SlideLayout } from "../SlideLayout";
import { KV, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-1 · Account" title="Settings panel anatomy"
      subtitle="One dialog, left sub-nav, autosave on blur. No global Save button.">
      <KV rows={[
        { k: "Entry", v: <>Sidebar avatar → <em>Settings</em> · hotkey <kbd>⌘,</kbd></> },
        { k: "Layout", v: "Left sub-nav (Account, Email, Security, Backup, Theme, Labs, Referrals, Help) → right pane sub-panel" },
        { k: "Save", v: "Autosave on blur / toggle change · transient `settings-save-toast` confirms each write" },
        { k: "Storage", v: <code>UserSetting (UserId + Key PK, Value TEXT JSON)</code> },
        { k: "REST", v: <code>GET / PATCH /wp-json/workflowy/v1/me/settings</code> · PascalCase envelope</code> },
      ]} />
      <Footer at="AT-USERMANAGEMENT-01"
        rule="Every user-facing setting persists via /me/settings; UI never writes to localStorage as the source of truth." />
    </SlideLayout>
  );
}
