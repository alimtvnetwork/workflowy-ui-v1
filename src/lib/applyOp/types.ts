// Op-journal + envelope types — mirrors spec/31-app/06-endpoints/97b-endpoint-envelope-fixtures.md
// PascalCase end-to-end (DB → ORM → JSON → frontend) per spec convention.

export type ItemType = "Root" | "Bullet" | "Board" | "Note";

export interface Item {
  Id: string;
  ParentId: string | null;
  Content: string;
  ItemType: ItemType;
  Sort: string;
  IsCompleted: boolean;
  Note: string | null;
  Tags: string[];
  /** Optional board column id (only meaningful when ParentId points to a Board). */
  ColumnId: string | null;
  /** Peer-group id when this item participates in a mirror group (per spec 09b). */
  PeerGroupId: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  CompletedAt: string | null;
  TrashedAt: string | null;
}

/** Per spec/31-app/01-features/09b — mirror identity is a peer group, not source/copy. */
export interface MirrorGroup {
  PeerGroupId: string;
  CreatedAt: string;
}
export interface MirrorMember {
  PeerGroupId: string;
  ItemId: string;
  ParentId: string | null;
  Sort: string;
  CreatedAt: string;
}

export type SharePermission = "View" | "Edit" | "Admin";

export interface ShareGrant {
  ShareId: string;
  ItemId: string;
  GranteeEmail: string;
  Permission: SharePermission;
  CreatedAt: string;
  RevokedAt: string | null;
}

/** Board columns are children of a Board item; cards are items with ColumnId set. */
export interface BoardColumn {
  ColumnId: string;
  BoardItemId: string;
  Title: string;
  Sort: string;
  CreatedAt: string;
}

export type OpKind =
  | "items.create"
  | "items.update"
  | "items.complete"
  | "items.move"
  | "items.delete"
  | "items.restore"
  | "mirrors.create"
  | "mirrors.detach"
  | "shares.grant"
  | "shares.revoke"
  | "boards.addColumn"
  | "boards.moveCard";

export interface Op<P = unknown> {
  OpId: string;
  Kind: OpKind;
  Payload: P;
  ClientTs: string;
  AppliedTs: string | null;
  Status: "Pending" | "Applied" | "Failed";
  ErrorMessage: string | null;
}

export interface EnvelopeStatus {
  IsSuccess: boolean;
  IsFailed: boolean;
  Code: number;
  Message: string;
  Timestamp: string;
}

export interface EnvelopeAttributes {
  RequestedAt: string;
  RequestDelegatedAt: string;
  HasAnyErrors: boolean;
  IsSingle: boolean;
  IsMultiple: boolean;
  IsEmpty: boolean;
  TotalRecords: number;
  PerPage: number;
  TotalPages: number;
  CurrentPage: number;
}

export interface Envelope<T> {
  Status: EnvelopeStatus;
  Attributes: EnvelopeAttributes;
  Results: T[];
  Errors?: {
    BackendMessage: string;
    DelegatedServiceErrorStack: string[];
    Backend: string[];
    Frontend: string[];
  } | null;
}

// ---- Payloads ----
export interface CreatePayload {
  ParentId: string | null;
  Content: string;
  ItemType: ItemType;
  AfterSort?: string;
  ColumnId?: string | null;
}
export interface UpdatePayload {
  Id: string;
  Content?: string;
  Note?: string | null;
  Tags?: string[];
}
export interface CompletePayload {
  Id: string;
  IsCompleted: boolean;
}
export interface MovePayload {
  Id: string;
  NewParentId: string | null;
  AfterSort?: string;
}
export interface DeletePayload {
  Id: string;
}
export interface RestorePayload {
  Id: string;
}

/** Mirror an existing item under a new parent. Both items end up in the same peer group. */
export interface MirrorCreatePayload {
  SourceItemId: string;
  NewParentId: string | null;
}
/** Detach a single member from its peer group. Per spec 09b a singleton peer-group dissolves. */
export interface MirrorDetachPayload {
  ItemId: string;
}

export interface ShareGrantPayload {
  ItemId: string;
  GranteeEmail: string;
  Permission: SharePermission;
}
export interface ShareRevokePayload {
  ShareId: string;
}

export interface BoardAddColumnPayload {
  BoardItemId: string;
  Title: string;
}
export interface BoardMoveCardPayload {
  CardItemId: string;
  TargetColumnId: string;
  AfterSort?: string;
}
