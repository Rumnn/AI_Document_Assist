"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Sparkles,
  RotateCcw,
  MoreVertical,
  Layers,
  FileText,
  MessageSquare,
} from "lucide-react";
import { ChatHeader } from "./chat-header";
import { TargetDocsPanel } from "./target-docs-panel";
import { DocumentViewerCanvas } from "./document-viewer-canvas";
import { ChatMessageItem } from "./chat-message-item";
import { ChatInput } from "./chat-input";
import {
  MOCK_DOCUMENTS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
} from "@/lib/mock/data";
import { ChatMessageItem as ChatMessageType, CitationItem } from "@/types/chat";
import toast from "react-hot-toast";

interface ChatWorkspaceProps {
  initialSessionId?: string;
}

export function ChatWorkspace({
  initialSessionId = "conv-01",
}: ChatWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryDocId = searchParams.get("doc");

  // State
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const currentConversation =
    conversations.find((c) => c.id === sessionId) || conversations[0];

  const [sessionTitle, setSessionTitle] = useState(currentConversation.title);
  const [documents] = useState(MOCK_DOCUMENTS);

  // Active documents checked in RAG context
  const [activeDocIds, setActiveDocIds] = useState<string[]>(
    currentConversation.document_ids || ["doc-01", "doc-02"]
  );

  // Center document currently viewed
  const [selectedDocId, setSelectedDocId] = useState<string>(
    queryDocId || activeDocIds[0] || "doc-01"
  );

  // Messages in this session
  const [messages, setMessages] = useState<ChatMessageType[]>(MOCK_MESSAGES);
  const [activeCitationId, setActiveCitationId] = useState<string>("cit-01");
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Mobile active tab view ('docs' | 'viewer' | 'chat')
  const [mobileTab, setMobileTab] = useState<"docs" | "viewer" | "chat">("chat");

  const selectedDocument =
    documents.find((d) => d.id === selectedDocId) || documents[0];

  // Document selection toggles
  const handleToggleDoc = (docId: string) => {
    setActiveDocIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectDoc = (docId: string) => {
    setSelectedDocId(docId);
    if (!activeDocIds.includes(docId)) {
      setActiveDocIds((prev) => [...prev, docId]);
    }
  };

  const handleSelectAllDocs = () => {
    setActiveDocIds(documents.map((d) => d.id));
  };

  const handleClearDocs = () => {
    setActiveDocIds([]);
  };

  // Session handling
  const handleRenameSession = (newTitle: string) => {
    setSessionTitle(newTitle);
    setConversations((prev) =>
      prev.map((c) => (c.id === sessionId ? { ...c, title: newTitle } : c))
    );
  };

  const handleNewSession = () => {
    const newId = `conv-${Date.now()}`;
    const newSession = {
      id: newId,
      workspace_id: "ws-01",
      user_id: "usr-01",
      title: "New Research Session",
      created_at: new Date().toISOString(),
      active: true,
      document_ids: ["doc-01"],
      message_count: 0,
    };
    setConversations((prev) => [newSession, ...prev]);
    setSessionId(newId);
    setSessionTitle("New Research Session");
    setMessages([
      {
        id: `msg-${Date.now()}`,
        conversation_id: newId,
        role: "assistant",
        content:
          "Hello! I'm your AI Document Assistant. Select target documents on the left and ask any question to retrieve semantic citations and synthesized insights.",
        model_name: "Claude 3.5 Sonnet + RAG v2",
        created_at: new Date().toISOString(),
      },
    ]);
    toast.success("New research session started");
  };

  const handleSelectSession = (id: string) => {
    setSessionId(id);
    const found = conversations.find((c) => c.id === id);
    if (found) {
      setSessionTitle(found.title);
      if (found.document_ids) {
        setActiveDocIds(found.document_ids);
        if (found.document_ids[0]) setSelectedDocId(found.document_ids[0]);
      }
    }
    toast.success(`Switched to "${found?.title || id}"`);
  };

  // Citation jump
  const handleSelectCitation = (citation: CitationItem) => {
    setActiveCitationId(citation.id);
    // Find doc if citation belongs to another doc
    const matchedDoc = documents.find((d) => d.name === citation.document_name);
    if (matchedDoc && matchedDoc.id !== selectedDocId) {
      setSelectedDocId(matchedDoc.id);
    }
    toast.success(`Focused citation #${citation.citation_index} in center viewer`);
  };

  // Sending message
  const handleSendMessage = (content: string) => {
    const userMsg: ChatMessageType = {
      id: `msg-${Date.now()}`,
      conversation_id: sessionId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiResponding(true);

    // Simulate AI synthesis with RAG retrieval
    setTimeout(() => {
      const aiMsg: ChatMessageType = {
        id: `msg-${Date.now() + 1}`,
        conversation_id: sessionId,
        role: "assistant",
        model_name: "Claude 3.5 Sonnet + RAG v2",
        latency_ms: 185,
        created_at: new Date().toISOString(),
        content: `Based on your query regarding "${content.slice(
          0,
          35
        )}...", here are the validated compliance requirements retrieved from **${
          selectedDocument.name
        }**:

* **Standard Enforcement:** All cryptographic operations adhere to AES-256 baseline specifications.
* **Audit Trail:** Key management activities undergo continuous integrity checks monitored via Qdrant vector retrieval.`,
        citations: [
          {
            id: `cit-${Date.now()}`,
            citation_index: 1,
            message_id: `msg-${Date.now() + 1}`,
            chunk_id: "chunk-gen-101",
            document_name: selectedDocument.name,
            page_number: 42,
            semantic_match: 92,
            snippet:
              "Cryptographic volume assertions are validated across microservice clusters with continuous compliance monitoring.",
            chunk_tag: "#sec-eval-101",
          },
        ],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsAiResponding(false);
      toast.success("RAG Answer Generated with 1 citation");
    }, 1200);
  };

  const handleClearThread = () => {
    if (confirm("Are you sure you want to clear this chat history?")) {
      setMessages([]);
      toast.success("Chat history cleared");
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden bg-surface">
      {/* Top Context Header / Control Rail */}
      <ChatHeader
        sessionTitle={sessionTitle}
        onRenameTitle={handleRenameSession}
        onNewSession={handleNewSession}
      />

      {/* Mobile Tab Switcher (visible ONLY on mobile < 1024px) */}
      <div className="max-lg:flex hidden items-center justify-around bg-surface-container-lowest border-b border-outline-variant/30 py-2 px-4 flex-none z-10 text-xs">
        <button
          type="button"
          onClick={() => setMobileTab("docs")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            mobileTab === "docs"
              ? "bg-primary-fixed text-on-primary-fixed-variant"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Docs ({activeDocIds.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("viewer")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            mobileTab === "viewer"
              ? "bg-primary-fixed text-on-primary-fixed-variant"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Viewer</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("chat")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            mobileTab === "chat"
              ? "bg-primary-fixed text-on-primary-fixed-variant"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>AI Chat</span>
        </button>
      </div>

      {/* 3-Column Core Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* 1. LEFT PANEL: Target Documents & Recent Sessions */}
        <div
          className={`w-[280px] flex-none flex-col h-full border-r border-outline-variant/30 ${
            mobileTab === "docs" ? "flex" : "max-lg:hidden lg:flex"
          }`}
        >
          <TargetDocsPanel
            documents={documents}
            activeDocIds={activeDocIds}
            selectedDocId={selectedDocId}
            onToggleDoc={handleToggleDoc}
            onSelectDoc={handleSelectDoc}
            onSelectAllDocs={handleSelectAllDocs}
            onClearDocs={handleClearDocs}
            conversations={conversations}
            currentSessionId={sessionId}
            onSelectSession={handleSelectSession}
          />
        </div>

        {/* 2. CENTER PANEL: Document Viewer & Citation Canvas */}
        <div
          className={`flex-1 flex-col min-w-0 h-full border-r border-outline-variant/30 ${
            mobileTab === "viewer" ? "flex" : "max-lg:hidden lg:flex"
          }`}
        >
          <DocumentViewerCanvas
            document={selectedDocument}
            activeCitationIndex={1}
            onCitationJump={() => {
              toast.success("Synchronized view to Active Citation #1");
            }}
          />
        </div>

        {/* 3. RIGHT PANEL: AI Conversational Intelligence Stream */}
        <section
          className={`w-full lg:w-[460px] flex-none bg-surface-container-lowest flex-col justify-between min-h-0 ${
            mobileTab === "chat" ? "flex" : "max-lg:hidden lg:flex"
          }`}
        >
          {/* Chat Header */}
          <div className="h-12 px-4 bg-surface-container-lowest shadow-xs flex items-center justify-between flex-none z-10 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary text-on-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-on-surface leading-none">
                  DocuMind Assistant
                </h3>
                <p className="text-[10px] text-outline mt-0.5">
                  Connected to {activeDocIds.length} documents (182k tokens)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearThread}
                className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                title="Clear thread"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Message History Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                activeCitationId={activeCitationId}
                onSelectCitation={handleSelectCitation}
              />
            ))}
            {isAiResponding && (
              <div className="flex items-center gap-2 text-xs text-primary font-medium p-3 bg-surface-container-low rounded-xl animate-pulse">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Searching vector index &amp; synthesizing answer...</span>
              </div>
            )}
          </div>

          {/* Fixed Chat Input Area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isAiResponding}
          />
        </section>
      </div>
    </div>
  );
}
