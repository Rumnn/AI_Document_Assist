export type MessageRole = "user" | "assistant" | "system";

export interface CitationItem {
  id: string;
  citation_index: number;
  message_id: string;
  chunk_id: string;
  document_name: string;
  page_number?: number;
  semantic_match?: number; // e.g. 94 (%)
  snippet: string;
  highlighted_text?: string;
  chunk_tag?: string;
}

export interface ChatMessageItem {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  model_name?: string;
  latency_ms?: number;
  created_at: string;
  citations?: CitationItem[];
}

export interface ConversationItem {
  id: string;
  workspace_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at?: string;
  active?: boolean;
  document_ids?: string[];
  message_count?: number;
}
