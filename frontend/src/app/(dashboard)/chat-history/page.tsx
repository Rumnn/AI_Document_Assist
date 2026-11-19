"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  MessageSquare,
  Search,
  Plus,
  ArrowRight,
  Trash2,
  Download,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  Layers,
  Activity,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_CONVERSATIONS, MOCK_DOCUMENTS, MOCK_WORKSPACES } from "@/lib/mock/data";
import { formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ChatHistoryPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [search, setSearch] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("all");

  const filteredSessions = useMemo(() => {
    return conversations.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        if (!matchesTitle) return false;
      }
      if (selectedWorkspace !== "all" && c.workspace_id !== selectedWorkspace) {
        return false;
      }
      return true;
    });
  }, [conversations, search, selectedWorkspace]);

  const handleDeleteSession = (id: string, title: string) => {
    if (confirm(`Delete session "${title}"?`)) {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      toast.success("Session deleted");
    }
  };

  const handleExport = (title: string) => {
    toast.success(`Exported "${title}" as Markdown`);
  };

  const getDocName = (docId: string) => {
    const doc = MOCK_DOCUMENTS.find((d) => d.id === docId);
    return doc ? doc.name : docId;
  };

  return (
    <div className="mx-auto max-w-[1600px] w-full p-6 md:p-8 space-y-6">
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Conversational Memory / Studio
            </span>
            <span className="text-outline">•</span>
            <span className="text-primary font-semibold flex items-center gap-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
              Live Semantic Retentive
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Chat History &amp; Research Threads
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Review, resume, export, and manage AI question-answering sessions across workspaces.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push("/chat" as Route)}
          className="gap-1.5 font-semibold text-xs shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Research Thread</span>
        </Button>
      </div>

      {/* 2. Metrics Mini-Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
              Total Sessions
            </span>
            <p className="text-xl font-bold text-on-surface mt-0.5 tabular-nums">
              {conversations.length}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-on-primary-fixed-variant">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
              Queries Answered
            </span>
            <p className="text-xl font-bold text-on-surface mt-0.5 tabular-nums">
              142
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
              Citations Extracted
            </span>
            <p className="text-xl font-bold text-on-surface mt-0.5 tabular-nums">
              384
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-fixed text-on-tertiary-fixed">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
              Avg. Retrieval Latency
            </span>
            <p className="text-xl font-bold text-tertiary mt-0.5 font-mono">
              210ms
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-secondary">
            <Activity className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl bg-surface-container-lowest p-2.5 shadow-xs border border-outline-variant/50">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past research sessions by title, prompt keywords..."
            className="w-full rounded-lg bg-surface-container-low py-2 pl-9 pr-4 text-xs text-on-surface placeholder:text-outline transition-all focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="flex items-center rounded-lg bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface appearance-none pr-8 hover:bg-surface-container-high transition-colors cursor-pointer focus:outline-none"
          >
            <option value="all">All Workspaces</option>
            {MOCK_WORKSPACES.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Session List */}
      {filteredSessions.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-8 w-8 text-outline" />}
          title="No research sessions found"
          description="Try modifying your search keywords or start a new AI document query."
          actionLabel="Start New Chat"
          onAction={() => router.push("/chat" as Route)}
        />
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/50 hover:border-outline-variant/80 hover:shadow-sm transition-all"
            >
              {/* Left Info */}
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary mt-0.5">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/chat/${session.id}` as Route}
                      className="text-base font-bold text-on-surface hover:text-primary transition-colors truncate"
                    >
                      {session.title}
                    </Link>
                    {session.active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-0.5 text-[10px] font-bold text-on-tertiary-fixed">
                        <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
                        Active Thread
                      </span>
                    )}
                  </div>

                  {/* Connected Target Docs */}
                  <div className="flex items-center gap-2 flex-wrap text-xs text-on-surface-variant">
                    <span className="text-[11px] text-outline font-medium">
                      Target Documents:
                    </span>
                    {session.document_ids && session.document_ids.length > 0 ? (
                      session.document_ids.map((docId) => (
                        <span
                          key={docId}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container text-on-surface font-medium text-[11px]"
                        >
                          <FileText className="h-3 w-3 text-primary" />
                          <span className="max-w-[200px] truncate">{getDocName(docId)}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-outline text-xs">All workspace docs</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Meta & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                <div className="flex flex-col md:items-end text-xs text-outline">
                  <span className="flex items-center gap-1 font-medium text-on-surface">
                    <Clock className="h-3.5 w-3.5 text-outline" />
                    {formatRelativeTime(session.created_at)}
                  </span>
                  <span className="text-[11px] mt-0.5">
                    {session.message_count || 8} messages
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExport(session.title)}
                    className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                    title="Export conversation"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSession(session.id, session.title)}
                    className="p-2 rounded-lg hover:bg-surface-container text-outline hover:text-error transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    asChild
                    className="gap-1.5 font-semibold text-xs shadow-xs"
                  >
                    <Link href={`/chat/${session.id}` as Route}>
                      <span>Resume Chat</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
