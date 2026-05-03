import { SlideLayout } from "../SlideLayout";
import { BehaviorCard } from "../components/BehaviorCard";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 2 · Navbar" title="What every icon does" subtitle="Top bar — always visible.">
      <BehaviorCard
        items={[
          { trigger: "☰  Menu",      result: "Toggles the left Sidebar (offcanvas on mobile)." },
          { trigger: "WorkFlowy",    result: "Logo. Click to go Home." },
          { trigger: "Breadcrumb",   result: "Home › Work › Q3 — each segment is clickable to zoom out." },
          { trigger: "🔍  Search",   result: "Opens the Search popover.", detail: "⌘K" },
          { trigger: "＋  Quick add", result: "Appends a new item to Inbox.", detail: "⌘⇧N" },
          { trigger: "ⓘ  Info",      result: "Toggles the Right-Side Panel (Handbook · Hotkeys · What's New)." },
          { trigger: "👤  Account",  result: "Profile, settings, sign out." },
          { trigger: "⋮  App menu",  result: "Theme, font, density, settings, admin (if role)." },
        ]}
      />
    </SlideLayout>
  );
}
