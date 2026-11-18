import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";
import {
  ArrowLeft,
  FileText,
  FileCode,
  Sparkles,
  Download,
  Calendar,
  Layers,
  HardDrive,
  ShieldCheck,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_DOCUMENTS } from "@/lib/mock/data";
import { formatBytes, formatDate } from "@/lib/utils";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = MOCK_DOCUMENTS.find((d) => d.id === id) || MOCK_DOCUMENTS[0];

  // Mock chunks for this document
  const mockChunks = Array.from({ length: 6 }).map((_, i) => ({
    chunk_index: i + 1,
    page: Math.floor(i / 2) + 1,
    tokens: 420 + i * 15,
    tag: `#sec-${doc.file_type}-${100 + i}`,
    content:
      i === 0
        ? "All customer data at rest is encrypted using AES-256 with keys managed in AWS KMS. Key rotation occurs automatically every 90 days. Backups are geo-replicated to us-east-1 and us-west-2 with TLS 1.3 in-transit enforcement."
        : i === 1
        ? "Access to cryptographic baseline configurations requires hardware-backed Multi-Factor Authentication (FIPS 140-2 Level 3 HSM). Privileged actions require dual-custody administrative approval documented in the SOC2 change ledger."
        : "Automated cron daemon monitors system security states every 15 minutes, validating volume integrity and cluster encryption flags across production container clusters.",
  }));

  return (
    <div className="mx-auto max-w-[1400px] w-full p-6 md:p-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href={"/documents" as Route}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Document Library</span>
        </Link>
      </div>

      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50">
        <div className="flex items-start gap-4 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-on-surface truncate">
                {doc.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-2.5 py-0.5 text-xs font-semibold text-on-tertiary-fixed">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                Indexed & Ready
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Document ID: <code className="font-mono text-outline">{doc.id}</code> • Storage Key:{" "}
              <code className="font-mono text-outline">{doc.storage_key}</code>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Download Original</span>
          </Button>

          <Button variant="primary" size="sm" asChild className="gap-2 shadow-xs">
            <Link href={`/chat?doc=${doc.id}` as Route}>
              <Sparkles className="h-4 w-4" />
              <span>Ask AI About This Doc</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid: Metadata Specs & Extracted Chunks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Metadata Specs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/50 space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
              Document Metadata
            </h2>

            <div className="divide-y divide-surface-container text-xs">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <HardDrive className="h-4 w-4 text-outline" />
                  File Size
                </span>
                <span className="font-mono font-semibold text-on-surface">
                  {formatBytes(doc.file_size)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-outline" />
                  MIME Type
                </span>
                <span className="font-mono text-right text-[11px] text-on-surface max-w-[180px] truncate">
                  {doc.mime_type}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-outline" />
                  Total Pages
                </span>
                <span className="font-semibold text-on-surface">
                  {doc.page_count || 1} pages
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Hash className="h-4 w-4 text-outline" />
                  Extracted Chunks
                </span>
                <span className="font-semibold text-primary">
                  {doc.chunk_count || mockChunks.length} chunks
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-outline" />
                  Created At
                </span>
                <span className="text-on-surface">{formatDate(doc.created_at)}</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-outline" />
                  Embedding Status
                </span>
                <span className="font-semibold text-tertiary">Verified in Qdrant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Chunks Inspector (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-on-surface">
                  Extracted Chunks Inspector
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Inspect the granular vectorized chunks utilized during semantic RAG retrieval.
                </p>
              </div>
              <span className="rounded bg-surface-container px-2 py-0.5 text-xs font-mono font-semibold text-on-surface">
                Showing {mockChunks.length} chunks
              </span>
            </div>

            <div className="space-y-3">
              {mockChunks.map((chunk) => (
                <div
                  key={chunk.chunk_index}
                  className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/30 space-y-2 hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-primary-fixed px-2 py-0.5 font-mono text-[11px] font-bold text-on-primary-fixed-variant">
                        Chunk #{chunk.chunk_index}
                      </span>
                      <span className="font-mono text-[11px] text-outline">
                        {chunk.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                      <span>Page {chunk.page}</span>
                      <span>•</span>
                      <span className="font-mono">{chunk.tokens} tokens</span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-on-surface bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 font-sans">
                    "{chunk.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
