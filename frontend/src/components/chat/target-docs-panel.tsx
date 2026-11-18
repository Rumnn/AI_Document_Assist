"use client";

import React, { useState } from "react";
import {
  ListFilter,
  History,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { DocumentItem } from "@/types/document";
import { ConversationItem } from "@/types/chat";

interface TargetDocsPanelProps {
  documents: DocumentItem[];
  activeDocIds: string[];
  selectedDocId: string;
  onToggleDoc: (id: string) => void;
  onSelectDoc: (id: string) => void;
  onSelectAllDocs: () => void;
  onClearDocs: () => void;
  conversations: ConversationItem[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
}

export function TargetDocsPanel({
  documents,
  activeDocIds,
  selectedDocId,
  onToggleDoc,
  onSelectDoc,
  onSelectAllDocs,
  onClearDocs,
  conversations,
  currentSessionId,
  onSelectSession,
}: TargetDocsPanelProps) {
  const [filterText, setFilterText] = useState("");

  const filteredDocuments = documents.filter((doc) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.id.toLowerCase().includes(q) ||
      doc.file_type.toLowerCase().includes(q)
    );
  });

  return (
    <aside className="w-full h-full bg-surface-container-lowest flex flex-col justify-between min-h-0 select-none">
      {/* 1. Top Target Documents Section */}
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-on-surface">Target Docs</span>
            <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">
              {activeDocIds.length} active
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={onSelectAllDocs}
              className="text-primary hover:underline font-semibold"
            >
              All
            </button>
            <span className="text-outline">·</span>
            <button
              type="button"
              onClick={onClearDocs}
              className="text-on-surface-variant hover:text-on-surface"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative mb-3">
          <ListFilter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline h-3.5 w-3.5" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter documents..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-xs focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-outline-variant/30 transition-all"
          />
        </div>

        {/* Document List with Selection */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-none">
          {filteredDocuments.map((doc) => {
            const isChecked = activeDocIds.includes(doc.id);
            const isViewing = selectedDocId === doc.id;

            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`p-2.5 rounded-lg transition-all cursor-pointer group border ${
                  isViewing
                    ? "bg-primary-fixed/20 border-primary/40 shadow-2xs"
                    : isChecked
                    ? "bg-surface-container-low hover:bg-surface-container border-outline-variant/30"
                    : "hover:bg-surface-container-low/60 border-transparent text-on-surface-variant"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDoc(doc.id);
                    }}
                    className="mt-0.5 text-primary hover:scale-110 transition-transform"
                  >
                    {isChecked ? (
                      <CheckSquare className="h-4 w-4 text-primary fill-primary-fixed/30" />
                    ) : (
                      <Square className="h-4 w-4 text-outline" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold truncate leading-tight ${
                        isViewing || isChecked
                          ? "text-primary"
                          : "text-on-surface group-hover:text-primary"
                      }`}
                      title={doc.name}
                    >
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant font-mono">
                      <span>{doc.page_count || 1} pages</span>
                      <span>•</span>
                      <span className="text-tertiary font-semibold">
                        {doc.chunk_count || 0} chunks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Bottom Recent Sessions Section */}
      <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex flex-col gap-1.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
            Recent Sessions
          </span>
          <History className="h-3.5 w-3.5 text-outline" />
        </div>

        <div className="space-y-1">
          {conversations.slice(0, 3).map((conv) => {
            const isActive = conv.id === currentSessionId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectSession(conv.id)}
                className={`p-2 rounded-lg transition-all flex items-center justify-between cursor-pointer border ${
                  isActive
                    ? "bg-surface-container-lowest shadow-xs border-primary/30"
                    : "hover:bg-surface-container-lowest border-transparent"
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p
                    className={`text-xs font-semibold truncate ${
                      isActive ? "text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {conv.title}
                  </p>
                  <p className="text-[10px] text-primary mt-0.5">
                    {isActive ? "Active now" : "Recent chat"}
                  </p>
                </div>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
