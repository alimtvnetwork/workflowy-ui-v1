import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";
import { DbTable } from "../components/DbTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 18 · Endpoints & DB" title="Feedback plumbing">
      <div className="space-y-6">
        <EndpointTable
          endpoints={[
            { method: "POST", path: "/wf/v1/feedback", purpose: "User submits a report (+ optional diagnostics)" },
            { method: "GET", path: "/wf/v1/admin/feedback", purpose: "Admin list with status filter" },
            { method: "PATCH", path: "/wf/v1/admin/feedback/:id", purpose: "Update status / add admin reply" },
            { method: "GET", path: "/wf/v1/admin/feedback/export.csv", purpose: "Export filtered set" },
          ]}
        />
        <DbTable
          tables={[
            { table: "FeedbackReport", columns: ["FeedbackId", "AuthorUserId", "Type", "Subject", "Body", "Status", "DiagnosticsJSON", "CreatedAt"], note: "Root DB · admin-scoped" },
            { table: "FeedbackReply", columns: ["FeedbackId", "AdminUserId", "Body", "CreatedAt"], note: "Threaded admin replies" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
