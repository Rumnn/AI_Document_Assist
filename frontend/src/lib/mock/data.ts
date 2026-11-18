import { DocumentItem, FolderItem } from "@/types/document";
import { ConversationItem, ChatMessageItem } from "@/types/chat";
import { WorkspaceItem, WorkspaceMemberItem } from "@/types/workspace";
import { UserProfile } from "@/types/user";

export const MOCK_USER: UserProfile = {
  id: "usr-01",
  email: "elena@acme.io",
  full_name: "Elena Vance",
  avatar_url:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  is_active: true,
  is_superuser: true,
};

export const MOCK_WORKSPACES: WorkspaceItem[] = [
  {
    id: "ws-01",
    name: "Acme Corp Labs",
    owner_id: "usr-01",
    created_at: "2024-01-10T08:00:00Z",
    member_count: 14,
    doc_count: 24,
    storage_bytes: 4509715660, // ~4.2 GB
  },
  {
    id: "ws-02",
    name: "Global Legal & M&A",
    owner_id: "usr-01",
    created_at: "2024-02-15T08:00:00Z",
    member_count: 6,
    doc_count: 12,
    storage_bytes: 1825361100,
  },
  {
    id: "ws-03",
    name: "Engineering Infra & Cloud",
    owner_id: "usr-01",
    created_at: "2024-03-01T08:00:00Z",
    member_count: 22,
    doc_count: 45,
    storage_bytes: 8589934592,
  },
];

export const MOCK_FOLDERS: FolderItem[] = [
  { id: "f-01", workspace_id: "ws-01", name: "Legal & Compliance", doc_count: 8 },
  { id: "f-02", workspace_id: "ws-01", name: "Financial Reports", doc_count: 6 },
  { id: "f-03", workspace_id: "ws-01", name: "Engineering & Specs", doc_count: 7 },
  { id: "f-04", workspace_id: "ws-01", name: "HR & People Ops", doc_count: 3 },
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-01",
    workspace_id: "ws-01",
    folder_id: "f-01",
    name: "SOC2_Compliance_Audit_2024.docx",
    file_type: "docx",
    mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    file_size: 14680064, // 14 MB
    storage_key: "documents/soc2_2024.docx",
    status: "completed",
    page_count: 118,
    chunk_count: 412,
    created_at: "2024-09-12T14:30:00Z",
    updated_at: "2024-09-12T14:35:00Z",
  },
  {
    id: "doc-02",
    workspace_id: "ws-01",
    folder_id: "f-01",
    name: "Vendor_MSA_Master_Agreement.pdf",
    file_type: "pdf",
    mime_type: "application/pdf",
    file_size: 8912896, // 8.5 MB
    storage_key: "documents/vendor_msa.pdf",
    status: "completed",
    page_count: 84,
    chunk_count: 260,
    created_at: "2024-09-10T11:20:00Z",
    updated_at: "2024-09-10T11:22:00Z",
  },
  {
    id: "doc-03",
    workspace_id: "ws-01",
    folder_id: "f-02",
    name: "Q3_Financial_Forecast_v2.pdf",
    file_type: "pdf",
    mime_type: "application/pdf",
    file_size: 4404019, // 4.2 MB
    storage_key: "documents/q3_forecast.pdf",
    status: "completed",
    page_count: 42,
    chunk_count: 120,
    created_at: "2024-09-08T09:15:00Z",
    updated_at: "2024-09-08T09:18:00Z",
  },
  {
    id: "doc-04",
    workspace_id: "ws-01",
    folder_id: "f-04",
    name: "Annual_Employee_Handbook_2024.pdf",
    file_type: "pdf",
    mime_type: "application/pdf",
    file_size: 6710886, // 6.4 MB
    storage_key: "documents/employee_handbook.pdf",
    status: "completed",
    page_count: 64,
    chunk_count: 198,
    created_at: "2024-09-02T16:00:00Z",
    updated_at: "2024-09-02T16:03:00Z",
  },
  {
    id: "doc-05",
    workspace_id: "ws-01",
    folder_id: "f-03",
    name: "Product_Requirements_Doc_RAG.txt",
    file_type: "txt",
    mime_type: "text/plain",
    file_size: 245760, // 240 KB
    storage_key: "documents/prd_rag.txt",
    status: "completed",
    page_count: 12,
    chunk_count: 48,
    created_at: "2024-08-28T10:00:00Z",
    updated_at: "2024-08-28T10:01:00Z",
  },
  {
    id: "doc-06",
    workspace_id: "ws-01",
    folder_id: "f-03",
    name: "Kubernetes_Cluster_Architecture_v3.pdf",
    file_type: "pdf",
    mime_type: "application/pdf",
    file_size: 19922944, // 19 MB
    storage_key: "documents/k8s_arch.pdf",
    status: "processing",
    page_count: 76,
    chunk_count: 180,
    created_at: "2024-09-18T10:15:00Z",
    updated_at: "2024-09-18T10:15:00Z",
  },
  {
    id: "doc-07",
    workspace_id: "ws-01",
    folder_id: "f-02",
    name: "Audit_Risk_Assessment_Draft.docx",
    file_type: "docx",
    mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    file_size: 3145728, // 3 MB
    storage_key: "documents/risk_assessment.docx",
    status: "failed",
    error_message: "Corrupted XML signature in block stream",
    created_at: "2024-09-17T08:45:00Z",
    updated_at: "2024-09-17T08:46:00Z",
  },
];

export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: "conv-01",
    workspace_id: "ws-01",
    user_id: "usr-01",
    title: "SOC2 & Security Compliance Analysis",
    created_at: "2024-09-18T10:40:00Z",
    active: true,
    document_ids: ["doc-01", "doc-02"],
    message_count: 8,
  },
  {
    id: "conv-02",
    workspace_id: "ws-01",
    user_id: "usr-01",
    title: "Q3 EBITDA & Growth Drivers",
    created_at: "2024-09-17T15:20:00Z",
    active: false,
    document_ids: ["doc-03"],
    message_count: 14,
  },
  {
    id: "conv-03",
    workspace_id: "ws-01",
    user_id: "usr-01",
    title: "Vendor Indemnity Clauses Review",
    created_at: "2024-09-15T09:10:00Z",
    active: false,
    document_ids: ["doc-02"],
    message_count: 6,
  },
];

export const MOCK_MESSAGES: ChatMessageItem[] = [
  {
    id: "msg-01",
    conversation_id: "conv-01",
    role: "user",
    content:
      "What encryption standards are enforced for customer data at rest, and how frequently are keys rotated according to the audit?",
    created_at: "2024-09-18T10:42:00Z",
  },
  {
    id: "msg-02",
    conversation_id: "conv-01",
    role: "assistant",
    model_name: "Claude 3.5 Sonnet + RAG v2",
    latency_ms: 210,
    created_at: "2024-09-18T10:42:02Z",
    content: `Based on the **SOC2 Compliance Audit 2024**, here are the documented encryption and key management standards:

* **Data at Rest Encryption:** All customer data stored at rest is encrypted using \`AES-256\` across all primary databases and storage volumes.
* **Key Management & Rotation:** Cryptographic keys are managed within **AWS KMS**. Automatic rotation is strictly enforced on a \`90-day mandatory schedule\`.
* **In-Transit Protection:** All external calls and internal microservices communication enforce **TLS 1.3** protocols.
* **Geo-Replication:** Backups are encrypted before geo-replication between \`us-east-1\` and \`us-west-2\`.`,
    citations: [
      {
        id: "cit-01",
        citation_index: 1,
        message_id: "msg-02",
        chunk_id: "chunk-142",
        document_name: "SOC2_Compliance_Audit_2024.docx",
        page_number: 42,
        semantic_match: 94,
        snippet:
          "All customer data at rest is encrypted using AES-256 with keys managed in AWS KMS. Key rotation occurs automatically every 90 days. Backups are geo-replicated to us-east-1 and us-west-2 with TLS 1.3 in-transit enforcement.",
        chunk_tag: "#sec-kms-142",
      },
      {
        id: "cit-02",
        citation_index: 2,
        message_id: "msg-02",
        chunk_id: "chunk-145",
        document_name: "SOC2_Compliance_Audit_2024.docx",
        page_number: 45,
        semantic_match: 88,
        snippet:
          "Backup archives in secondary regions adhere to identical AES-256 envelope encryption policy with automated TLS verification...",
        chunk_tag: "#sec-backup-145",
      },
    ],
  },
];

export const MOCK_WORKSPACE_MEMBERS: WorkspaceMemberItem[] = [
  {
    id: "wm-01",
    workspace_id: "ws-01",
    user_id: "usr-01",
    role: "owner",
    user_name: "Elena Vance",
    user_email: "elena@acme.io",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    joined_at: "2024-01-10T08:00:00Z",
  },
  {
    id: "wm-02",
    workspace_id: "ws-01",
    user_id: "usr-02",
    role: "admin",
    user_name: "Marcus Holloway",
    user_email: "marcus@acme.io",
    joined_at: "2024-01-15T09:30:00Z",
  },
  {
    id: "wm-03",
    workspace_id: "ws-01",
    user_id: "usr-03",
    role: "member",
    user_name: "Sarah Chen",
    user_email: "sarah.c@acme.io",
    joined_at: "2024-02-01T14:20:00Z",
  },
  {
    id: "wm-04",
    workspace_id: "ws-01",
    user_id: "usr-04",
    role: "viewer",
    user_name: "David Kim",
    user_email: "david.k@acme.io",
    joined_at: "2024-03-11T11:00:00Z",
  },
];
