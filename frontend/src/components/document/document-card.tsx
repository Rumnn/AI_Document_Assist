"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  FileText,
  FileCode,
  Sparkles,
  Eye,
  Download,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { DocumentItem } from "@/types/document";
import { formatBytes, formatDate } from "@/lib/utils";
import { MOCK_FOLDERS } from "@/lib/mock/data";

interface DocumentCardProps {
  doc: DocumentItem;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
}

export function DocumentCard({
  doc,
  isSelected,
  onSelectToggle,
}: DocumentCardProps) {
  const router = useRouter();
  const isProcessing = doc.status === "processing";
  const isFailed = doc.status === "failed";

  const getFolderName = (folderId?: string | null) => {
    if (!folderId) return "Root Workspace";
    const found = MOCK_FOLDERS.find((f) => f.id === folderId);
    return found ? found.name : "Legal & Compliance";
  };

  const getFormatIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-container text-error">
            <FileText className="h-5 w-5" />
          </div>
        );
      case "docx":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <FileText className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-secondary">
            <FileCode className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl bg-surface-container-lowest p-5 shadow-xs border transition-all ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 bg-primary-fixed/5"
          : "border-outline-variant/50 hover:border-outline-variant/80 hover:shadow-sm"
      }`}
    >
      <div>
        {/* Top Header: Icon, Checkbox & More */}
        <div className="flex items-start justify-between">
          {getFormatIcon(doc.file_type)}

          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectToggle(doc.id)}
              className="rounded accent-primary w-4 h-4 cursor-pointer mr-1"
            />
            <button
              type="button"
              className="rounded-lg p-1 text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="mt-3.5">
          <h3 className="truncate text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
            <Link
              href={`/documents/${doc.id}` as Route}
              className="cursor-pointer hover:underline"
              title={doc.name}
            >
              {doc.name}
            </Link>
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="rounded bg-surface-container px-2 py-0.5 text-[10px] font-medium text-on-surface-variant">
              {getFolderName(doc.folder_id)}
            </span>
            <span>•</span>
            <span className="font-mono text-[11px]">{formatBytes(doc.file_size)}</span>
          </div>
        </div>

        {/* Pages, Chunks & Status */}
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-3 text-xs">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="font-semibold text-on-surface">{doc.page_count || 1}</span>
            <span>pages</span>
            <span>•</span>
            <span className="font-semibold text-primary">{doc.chunk_count || 0}</span>
            <span>chunks</span>
          </div>

          <div>
            {isFailed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-error-container px-2 py-0.5 text-[10px] font-semibold text-on-error-container">
                <AlertCircle className="h-3 w-3" />
                <span>Failed</span>
              </span>
            ) : isProcessing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold text-on-secondary-fixed-variant animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span>Indexing</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-0.5 text-[10px] font-semibold text-on-tertiary-fixed">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                <span>Ready</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-3">
        <span className="text-[11px] text-outline">{formatDate(doc.created_at)}</span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={isProcessing || isFailed}
            onClick={() => router.push(`/chat?doc=${doc.id}` as Route)}
            className="flex items-center gap-1 rounded-lg bg-primary-fixed px-2.5 py-1 text-xs font-semibold text-on-primary-fixed-variant hover:bg-primary hover:text-on-primary transition-all disabled:opacity-40"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chat</span>
          </button>
          <button
            type="button"
            onClick={() => router.push(`/documents/${doc.id}` as Route)}
            className="rounded-lg p-1.5 text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg p-1.5 text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
