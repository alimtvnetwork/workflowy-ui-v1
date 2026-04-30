import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 15 · Endpoints & DB" title="Persisting preferences">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/settings", purpose: "Current user's appearance + editor prefs" },
            { method: "PATCH", path: "/wf/v1/settings", purpose: "Update theme / font / density / toggles" },
            { method: "PATCH", path: "/wf/v1/me", purpose: "Update DisplayName / Timezone / Avatar" },
          ]}
        />
        <DbTable
          tables={[
            { table: "User", columns: ["DisplayName", "Timezone", "AvatarPath"], note: "Root DB" },
            { table: "UserSettings", columns: ["UserId FK", "Theme", "Font", "Density", "EditorFlags JSON"], note: "Root DB · 1:1 with User" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
