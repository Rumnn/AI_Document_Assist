export type DocumentStatus =
  | "uploaded"
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "deleting";

export interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  page_start?: number;
  page_end?: number;
  content: string;
  token_count?: number;
  metadata?: Record<string, unknown>;
}

export interface DocumentItem {
  id: string;
  workspace_id: string;
  folder_id?: string | null;
  uploaded_by?: string | null;
  name: string;
  file_type: "pdf" | "docx" | "txt";
  mime_type: string;
  file_size: number;
  storage_key: string;
  checksum?: string;
  status: DocumentStatus;
  page_count?: number;
  chunk_count?: number;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FolderItem {
  id: string;
  workspace_id: string;
  name: string;
  parent_id?: string | null;
  doc_count?: number;
}
