import { SlideLayout } from "../SlideLayout";
import { StepList } from "../components/StepList";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 12 · Permissions" title="Three roles, inherited down the subtree">
      <div className="grid grid-cols-2 gap-10">
        <div className="rounded-2xl border border-border p-8">
          <div className="text-2xl font-semibold mb-4">Roles</div>
          <ul className="space-y-3 text-xl text-muted-foreground">
            <li>👁 <span className="text-foreground">Viewer</span> — read only</li>
            <li>✎ <span className="text-foreground">Editor</span> — edit + comment</li>
            <li>👑 <span className="text-foreground">Owner</span> — share + delete</li>
          </ul>
          <p className="mt-6 text-lg text-muted-foreground">
            Permissions cascade to all descendants. A grant on a deeper node can <em>add</em>, never reduce.
          </p>
        </div>
        <StepList
          steps={[
            { action: "Type email + role → Invite", result: "Share row created (GranteeEmail until accepted)" },
            { action: "Invitee accepts via emailed link", result: "GranteeUserId set, GranteeEmail cleared (C5)" },
            { action: "Toggle 'Public link'", result: "PublicSlug generated; anyone-with-link access" },
            { action: "⋮ → Revoke", result: "RevokedAt set; access ends immediately" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
