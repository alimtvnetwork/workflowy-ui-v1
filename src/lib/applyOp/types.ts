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
  CreatedAt: string;
  UpdatedAt: string;
  CompletedAt: string | null;
  TrashedAt: string | null;
}

export type OpKind =
  | "items.create"
  | "items.update"
  | "items.complete"
  | "items.move"
  | "items.delete"
  | "items.restore";

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

// Payloads
export interface CreatePayload {
  ParentId: string | null;
  Content: string;
  ItemType: ItemType;
  AfterSort?: string;
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
