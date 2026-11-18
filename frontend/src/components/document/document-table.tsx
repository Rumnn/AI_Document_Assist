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
  RefreshCw,
} from "lucide-react";
import { DocumentItem } from "@/types/document";
import { formatBytes, formatDate } from "@/lib/utils";
import { MOCK_FOLDERS } from "@/lib/mock/data";

interface DocumentTableProps {
  documents: DocumentItem[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
}

export function DocumentTable({
  documents,
  selectedIds,
  onSelectToggle,
  onSelectAll,
}: DocumentTableProps) {
  const router = useRouter();
  const allSelected = documents.length > 0 && selectedIds.length === documents.length;

  const getFolderName = (folderId?: string | null) => {
    if (!folderId) return "Root Workspace";
    const found = MOCK_FOLDERS.find((f) => f.id === folderId);
    return found ? found.name : "Legal & Compliance";
  };

  const getFormatIcon = (fileType: string, isFailed?: boolean) => {
    if (isFailed) {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-error-container text-error shadow-xs">
          <AlertCircle className="h-4.5 w-4.5" />
        </div>
      );
    }
    switch (fileType) {
      case "pdf":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-error-container text-error shadow-xs">
            <FileText className="h-4.5 w-4.5" />
          </div>
        );
      case "docx":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary shadow-xs">
            <FileText className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-secondary shadow-xs">
            <FileCode className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  return (
    <div className="rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs font-semibold border-b border-outline-variant/30">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded accent-primary w-4 h-4 cursor-pointer align-middle"
                />
              </th>
              <th className="py-3 px-4 text-on-surface">Name & File Type</th>
              <th className="py-3 px-4 text-on-surface">Workspace</th>
              <th className="py-3 px-4 text-on-surface">Size</th>
              <th className="py-3 px-4 text-on-surface">Pages & Chunks</th>
              <th className="py-3 px-4 text-on-surface">Status</th>
              <th className="py-3 px-4 text-on-surface">Upload Date</th>
              <th className="py-3 px-4 text-on-surface text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-xs text-on-surface">
            {documents.map((doc) => {
              const isSelected = selectedIds.includes(doc.id);
              const isProcessing = doc.status === "processing";
              const isFailed = doc.status === "failed";

              return (
                <tr
                  key={doc.id}
                  className={`transition-colors group ${
                    isSelected
                      ? "bg-primary-fixed/20"
                      : isFailed
                      ? "bg-error-container/10 hover:bg-error-container/20"
                      : "hover:bg-surface-container-low/70"
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToggle(doc.id)}
                      className="rounded accent-primary w-4 h-4 cursor-pointer align-middle"
                    />
                  </td>

                  {/* Name & Subtitle */}
                  <td className="py-3 px-4 min-w-[260px]">
                    <div className="flex items-center gap-3">
                      {getFormatIcon(doc.file_type, isFailed)}
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/documents/${doc.id}` as Route}
                          className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer"
                        >
                          {doc.name}
                        </Link>
                        <span className="text-[11px] text-outline flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isFailed
                                ? "bg-error"
                                : isProcessing
                                ? "bg-amber-500 animate-pulse"
                                : "bg-outline-variant"
                            }`}
                          />
                          {isFailed
                            ? doc.error_message || "OCR parse timeout"
                            : isProcessing
                            ? "Vector indexing in progress"
                            : "Semantic Vectorized"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Workspace */}
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface-variant font-medium text-[11px]">
                      {getFolderName(doc.folder_id)}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="py-3 px-4 font-mono text-[11px] text-on-surface-variant">
                    {formatBytes(doc.file_size)}
                  </td>

                  {/* Pages & Chunks */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface">
                      <span className="font-semibold">{doc.page_count || "-"}</span>
                      <span className="text-outline">pages</span>
                      <span className="text-outline">•</span>
                      <span className="font-semibold text-primary">
                        {doc.chunk_count || 0}
                      </span>
                      <span className="text-outline">chunks</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {isFailed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-semibold">
                        <AlertCircle className="h-3 w-3" />
                        <span>Failed</span>
                      </span>
                    ) : isProcessing ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-[11px] font-semibold animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        <span>Indexing 68%</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                        <span>Completed</span>
                      </span>
                    )}
                  </td>

                  {/* Upload Date */}
                  <td className="py-3 px-4 text-outline text-xs whitespace-nowrap">
                    {formatDate(doc.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {isFailed ? (
                        <button
                          type="button"
                          onClick={() => alert(`Retrying OCR for ${doc.name}...`)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-error text-on-error hover:bg-error/90 text-[11px] font-semibold shadow-2xs transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Retry</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => router.push(`/chat?doc=${doc.id}` as Route)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary hover:text-on-primary transition-all text-[11px] font-semibold disabled:opacity-50"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Ask AI</span>
                        </button>
                      )}

                      <Link
                        href={`/documents/${doc.id}` as Route}
                        className="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                        title="Preview document"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        className="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 rounded-md hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-surface-container-low/70 border-t border-outline-variant/30 text-xs text-on-surface-variant">
        <div>
          Showing <strong className="text-on-surface font-semibold">1-{documents.length}</strong> of{" "}
          <strong className="text-on-surface font-semibold">{documents.length}</strong> documents
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled
            className="p-1.5 rounded-lg bg-surface-container-lowest text-outline opacity-50 cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-on-primary font-semibold text-xs">
            1
          </span>
          <button
            disabled
            className="p-1.5 rounded-lg bg-surface-container-lowest text-outline opacity-50 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
