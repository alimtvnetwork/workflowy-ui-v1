import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 14 · Tabs & data" title="Three tabs, three sources">
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { name: "Handbook", body: "Static MDX bundled with the app. Searchable within panel." },
          { name: "Hotkeys", body: "Generated from the Phase-8 hotkey registry (~30 entries, Cmd/Ctrl aware)." },
          { name: "What's New", body: "Versioned changelog feed; unread badge on the ⓘ icon." },
        ].map((t) => (
          <div key={t.name} className="rounded-xl border border-border bg-card p-6">
            <div className="text-2xl font-semibold">{t.name}</div>
            <p className="mt-2 text-lg text-muted-foreground">{t.body}</p>
          </div>
        ))}
      </div>
      <EndpointTable
        endpoints={[
          { method: "GET", path: "/wf/v1/whats-new", purpose: "Changelog entries since user.LastSeenChangelogAt" },
          { method: "POST", path: "/wf/v1/whats-new/seen", purpose: "Mark all as read (clears badge)" },
        ]}
      />
    </SlideLayout>
  );
}
