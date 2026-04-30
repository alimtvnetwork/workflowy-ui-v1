import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 22 · Database map" title="Two databases, one logical link">
      <Wireframe size={18}>{`  ┌──────────── ROOT DB (workflowy_root.db) ───────────┐
  │  User ─┬─ UserRole ─ RoleType                       │
  │        ├─ WorkspaceMember ─ WorkspaceRoleType       │
  │        └─ UserSettings                              │
  │  Workspace ──────── (AppDbPath ──────┐ )            │
  │  FeedbackReport / FeedbackReply       │             │
  └───────────────────────────────────────┼─────────────┘
                                          │  no SQL JOIN
                                          │  crosses this line
  ┌───────────────────────────────────────▼─────────────┐
  │  APP DB (one file per Workspace)                    │
  │                                                     │
  │  Item ─┬─ Item   (parent/child)                     │
  │        ├─ ItemType                                  │
  │        ├─ Mirror ─ Item (source)                    │
  │        ├─ ItemTag ─ Tag                             │
  │        ├─ Share ─ ShareRoleType                     │
  │        ├─ Comment / Attachment / Mention            │
  │        ├─ Favorite                                  │
  │        ├─ Template                                  │
  │        └─ ActivityLog                               │
  │  SyncCursor                                         │
  └─────────────────────────────────────────────────────┘`}</Wireframe>
    </SlideLayout>
  );
}
