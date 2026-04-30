import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 2 · Navbar" title="What every icon does" subtitle="Top bar — always visible.">
      <Wireframe size={20}>{`☰          → Toggles the left Sidebar (offcanvas).
WorkFlowy  → Logo. Click to go Home.
Breadcrumb → Home › Work › Q3   (each segment is clickable; ancestor zoom-out)
🔍         → Opens the Search popover (⌘K).
＋          → Quick Add modal: appends a new item to Inbox (⌘⇧N).
ⓘ          → Toggles the Right-Side Panel (Handbook · Hotkeys · What's New).
👤         → Account menu: profile, settings, sign out.
⋮          → App menu: theme, font, density, settings, admin (if role).`}</Wireframe>
    </SlideLayout>
  );
}
