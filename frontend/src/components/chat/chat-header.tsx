"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Edit3,
  Check,
  Share2,
  Download,
  Plus,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface ChatHeaderProps {
  sessionTitle: string;
  onRenameTitle: (newTitle: string) => void;
  onNewSession: () => void;
  modelName?: string;
  latencyMs?: number;
}

export function ChatHeader({
  sessionTitle,
  onRenameTitle,
  onNewSession,
  modelName = "Claude 3.5 Sonnet + RAG v2",
  latencyMs = 210,
}: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(sessionTitle);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onRenameTitle(titleInput.trim());
      setIsEditing(false);
      toast.success("Session renamed");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Share link copied to clipboard!");
    }
  };

  const handleExport = () => {
    toast.success("Exported session transcript (.md)");
  };

  return (
    <div className="flex-none bg-surface-container-lowest px-6 py-2.5 shadow-xs flex items-center justify-between gap-4 z-20 border-b border-outline-variant/30">
      <div className="flex items-center gap-3 min-w-0">
        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant flex-shrink-0">
          <Link href={"/workspaces" as Route} className="hover:text-on-surface transition-colors">
            Workspaces
          </Link>
          <span className="text-outline">/</span>
          <span className="hover:text-on-surface transition-colors">Acme Corp Labs</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-semibold">AI Chat</span>
        </nav>

        <div className="hidden sm:block h-4 w-px bg-outline-variant/50 flex-shrink-0" />

        {/* Editable Session Title */}
        <div className="flex items-center gap-2 group min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                autoFocus
                className="rounded-md border border-primary px-2 py-0.5 text-sm font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-1 rounded text-primary hover:bg-primary-fixed/20"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                onClick={() => setIsEditing(true)}
                className="text-sm md:text-base font-semibold text-on-surface truncate cursor-pointer hover:text-primary transition-colors"
                title="Click to rename"
              >
                {sessionTitle}
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-outline group-hover:text-primary transition-colors flex-shrink-0"
                title="Rename session"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Latency & Model Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-low flex-shrink-0 border border-outline-variant/30">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
            <span className="text-xs font-semibold text-on-surface">{modelName}</span>
          </div>
          <span className="font-mono text-[11px] text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
            {latencyMs}ms
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          type="button"
          onClick={onNewSession}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-hover text-xs font-semibold transition-all shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden md:inline">New Session</span>
        </button>
      </div>
    </div>
  );
}
