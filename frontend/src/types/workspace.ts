export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface WorkspaceItem {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  member_count?: number;
  doc_count?: number;
  storage_bytes?: number;
}

export interface WorkspaceMemberItem {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  user_name: string;
  user_email: string;
  avatar_url?: string;
  joined_at: string;
}
