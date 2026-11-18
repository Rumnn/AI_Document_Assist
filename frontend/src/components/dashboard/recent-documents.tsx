"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  FileText,
  ArrowRight,
  MessageSquare,
  Eye,
  MoreVertical,
  Loader2,
  FileCode,
  CheckCircle2,
} from "lucide-react";
import { MOCK_DOCUMENTS } from "@/lib/mock/data";
import { formatBytes, formatRelativeTime } from "@/lib/utils";

export function RecentDocuments() {
  const router = useRouter();
  const recentDocs = MOCK_DOCUMENTS.slice(0, 4);

  const getFormatIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-error-container text-on-error-container">
            <FileText className="h-4.5 w-4.5 text-error" />
          </div>
        );
      case "docx":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <FileText className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant">
            <FileCode className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight text-on-surface">
            Recent Documents
          </h2>
        </div>
        <Link
          href={"/documents" as Route}
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <span>View all {MOCK_DOCUMENTS.length}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Document Items List */}
      <div className="space-y-2">
        {recentDocs.map((doc) => {
          const isProcessing = doc.status === "processing";
          return (
            <div
              key={doc.id}
              className="group flex items-center justify-between rounded-lg bg-surface-container-low p-3 hover:bg-surface-container transition-colors"
            >
              {/* Left file info */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                {getFormatIcon(doc.file_type)}
                <div className="min-w-0">
                  <Link
                    href={`/documents/${doc.id}` as Route}
                    className="block cursor-pointer truncate text-sm font-semibold text-on-surface group-hover:text-primary transition-colors"
                  >
                    {doc.name}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-on-surface-variant">
                    {doc.page_count && <span>{doc.page_count} pages</span>}
                    {doc.page_count && <span>•</span>}
                    <span>{formatBytes(doc.file_size)}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(doc.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Right status badge & actions */}
              <div className="flex items-center gap-3 shrink-0">
                {isProcessing ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-fixed-variant animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Embedding 68%</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-fixed px-2.5 py-1 text-xs font-semibold text-on-tertiary-fixed">
                    <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                    <span>Completed</span>
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => router.push(`/chat?doc=${doc.id}` as Route)}
                    className="rounded-lg p-1.5 text-outline hover:text-primary hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title={isProcessing ? "Processing..." : "Chat with doc"}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/documents/${doc.id}` as Route)}
                    className="rounded-lg p-1.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Inspect source"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    title="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
