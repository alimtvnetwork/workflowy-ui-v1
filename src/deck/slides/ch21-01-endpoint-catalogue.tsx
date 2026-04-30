import { SlideLayout } from "../SlideLayout";
import { EndpointTable } from "../components/EndpointTable";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 21 · Endpoint catalogue" title="The whole REST surface, on one page">
      <div className="overflow-auto pr-2 max-h-[850px]">
        <EndpointTable
          endpoints={[
            { method: "GET", path: "/wf/v1/me", purpose: "Current user + role + workspaces" },
            { method: "POST", path: "/wf/v1/auth/signup | signin | signout | forgot", purpose: "Auth lifecycle" },
            { method: "GET", path: "/wf/v1/sidebar", purpose: "Special nodes + favourites" },
            { method: "GET", path: "/wf/v1/items/:id", purpose: "Single item" },
            { method: "GET", path: "/wf/v1/items/:id/tree", purpose: "Subtree (lazy expand)" },
            { method: "POST", path: "/wf/v1/items", purpose: "Create" },
            { method: "PATCH", path: "/wf/v1/items/:id", purpose: "Update" },
            { method: "POST", path: "/wf/v1/items/:id/move | indent | outdent | complete | duplicate", purpose: "Editor ops" },
            { method: "POST", path: "/wf/v1/items/bulk-move | bulk-mirror | bulk-complete | bulk-tag", purpose: "Multi-select" },
            { method: "DELETE", path: "/wf/v1/items/:id  · /wf/v1/items/bulk", purpose: "Soft-delete" },
            { method: "POST", path: "/wf/v1/items/:id/restore  ·  DELETE /wf/v1/trash", purpose: "Trash" },
            { method: "POST", path: "/wf/v1/mirrors  ·  /:id/detach", purpose: "Mirrors" },
            { method: "POST", path: "/wf/v1/templates  ·  /:id/apply", purpose: "Templates" },
            { method: "POST", path: "/wf/v1/shares  ·  /:id/accept", purpose: "Sharing" },
            { method: "GET", path: "/wf/v1/today  ·  /calendar  ·  /dashboard", purpose: "Date / aggregate views" },
            { method: "GET", path: "/wf/v1/search  ·  POST /saved-searches", purpose: "Search" },
            { method: "POST", path: "/wf/v1/sync  ·  GET /events (SSE)", purpose: "Concurrency" },
            { method: "POST", path: "/wf/v1/feedback  ·  GET/PATCH /admin/feedback", purpose: "Feedback" },
            { method: "GET", path: "/wf/v1/admin/users  ·  POST /:id/roles  ·  GET /admin/activity", purpose: "Admin" },
          ]}
        />
      </div>
    </SlideLayout>
  );
}
