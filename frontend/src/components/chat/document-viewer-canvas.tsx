"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Crosshair,
  Minus,
  Plus,
  Maximize2,
  Download,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { DocumentItem } from "@/types/document";
import toast from "react-hot-toast";

interface DocumentViewerCanvasProps {
  document: DocumentItem;
  activeCitationIndex?: number;
  onCitationJump?: () => void;
}

export function DocumentViewerCanvas({
  document,
  activeCitationIndex = 1,
  onCitationJump,
}: DocumentViewerCanvasProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(42);
  const citationRef = useRef<HTMLDivElement>(null);

  const totalPages = document.page_count || 118;

  const scrollToCitation = () => {
    if (citationRef.current) {
      citationRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.success("Synchronized view to Active Citation #1");
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 70));
  const handleFitScreen = () => setZoom(100);

  const handleDownload = () => {
    toast.success(`Downloading original ${document.name}...`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface-container-low min-h-0 overflow-hidden">
      {/* 1. Document Controls Toolbar */}
      <div className="h-12 bg-surface-container-lowest px-4 flex items-center justify-between flex-none shadow-xs z-10 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <FileText className="h-4.5 w-4.5 text-primary flex-shrink-0" />
          <span className="text-xs font-semibold text-on-surface truncate">
            {document.name}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium flex-shrink-0">
            Page {currentPage} / {totalPages}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Page Jump */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-on-surface border border-outline-variant/30">
            <span className="text-[10px] text-outline">Page</span>
            <input
              type="text"
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                  setCurrentPage(val);
                }
              }}
              className="w-8 text-center bg-surface-container-lowest rounded font-mono text-xs text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary py-0.5"
            />
            <span className="text-[10px] text-outline">/ {totalPages}</span>
          </div>

          {/* Citation Synchronizer */}
          <button
            type="button"
            onClick={() => {
              scrollToCitation();
              onCitationJump?.();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary hover:text-on-primary transition-all text-xs font-semibold shadow-2xs"
            title="Focus citation in document"
          >
            <Crosshair className="h-3.5 w-3.5 animate-pulse text-primary group-hover:text-on-primary" />
            <span className="hidden sm:inline">Jump to Citation #{activeCitationIndex}</span>
          </button>

          <div className="h-4 w-px bg-outline-variant/50 mx-0.5" />

          {/* Zoom & Display Controls */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-mono font-semibold px-1 text-on-surface">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleFitScreen}
            className="p-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Fit to width"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Download Source"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Viewer Paper Workspace with Ambient Scroll */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center">
        {/* Document Page Canvas */}
        <article
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          className="w-full max-w-3xl bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-md border border-outline-variant/40 relative min-h-[960px] flex flex-col justify-between transition-transform"
        >
          {/* Document Watermark / Top Header */}
          <div>
            <div className="flex items-center justify-between pb-5 mb-8 border-b border-outline-variant/30 font-mono text-[11px] text-outline uppercase tracking-wider">
              <span>ACME CORP • CONFIDENTIAL SOC2 TYPE II EVALUATION</span>
              <span>ANNEX B - CONTROL ASSESSMENT</span>
            </div>

            {/* Header Content */}
            <div className="space-y-3">
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-semibold uppercase tracking-wide">
                Technical Controls • CC6.1 &amp; CC6.3
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                SECTION 4: DATA ENCRYPTION &amp; KEY MANAGEMENT
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Independent testing of the production cryptographic baseline was conducted between June 12 and August 30, 2024. The operational envelope assesses data pipelines across storage, database engines, and inter-service container orchestration.
              </p>
            </div>

            {/* Active Highlighting Area (Citation Match 1) */}
            <div
              ref={citationRef}
              className="my-6 p-4 rounded-xl bg-primary-fixed/20 border border-primary/30 shadow-xs relative transition-all"
            >
              <div className="absolute -left-1.5 top-4 w-1.5 h-12 bg-primary rounded-full" />
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Active AI Citation #{activeCitationIndex}</span>
                </span>
                <span className="text-[11px] text-tertiary font-bold">
                  94% Semantic Match
                </span>
              </div>
              <mark className="bg-primary-fixed/80 text-primary-950 font-medium text-xs md:text-sm px-1.5 py-0.5 rounded leading-relaxed block text-on-surface">
                "All customer data at rest is encrypted using AES-256 with keys managed in AWS KMS. Key rotation occurs automatically every 90 days. Backups are geo-replicated to us-east-1 and us-west-2 with TLS 1.3 in-transit enforcement."
              </mark>
              <div className="mt-3 flex items-center gap-3 text-outline text-[11px] font-mono">
                <span>Matched chunk ID: <code className="text-primary font-bold">#sec-kms-142</code></span>
                <span>•</span>
                <span>Audited: AWS KMS Key ARN <code className="text-on-surface">arn:aws:kms:us-east-1:***</code></span>
              </div>
            </div>

            {/* Supplementary Realistic Content */}
            <div className="space-y-4 text-on-surface-variant text-xs md:text-sm leading-relaxed">
              <h3 className="text-sm md:text-base font-bold text-on-surface pt-2">
                4.1 Key Custodianship &amp; Hardware Security Modules
              </h3>
              <p>
                Access to the root Key Management Service configuration is restricted strictly through hardware-backed Multi-Factor Authentication (FIPS 140-2 Level 3 HSM). Privileged actions require dual-custody administrative approval documented in the SOC2 change ledger.
              </p>
              <p>
                Quarterly simulated disaster failover verifies that encrypted volumes automatically mount in standby clusters within secondary availability zones without manual key injection.
              </p>

              {/* Mini Security Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-tertiary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface">
                      AES-256 GCM Verification
                    </h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Validated on RDS Aurora PostgreSQL and S3 Standard buckets.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start gap-2.5">
                  <RefreshCw className="h-5 w-5 text-tertiary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface">
                      Automated Rotation Engine
                    </h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Active cron daemon configured for 90-day cryptographic cycle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-6 mt-12 border-t border-outline-variant/30 flex items-center justify-between text-outline font-mono text-[11px]">
            <span>Page {currentPage} of {totalPages}</span>
            <span>SOC2-TYPE-2-REPORT-FINAL-2024.DOCX</span>
          </div>

          {/* Floating Inspector Badge */}
          <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-surface-container-highest/95 backdrop-blur text-on-surface text-[11px] font-medium shadow-sm border border-outline-variant/40 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
            <span>Indexed Chunks: {document.chunk_count || 412} • Embedding: bge-m3</span>
          </div>
        </article>
      </div>
    </div>
  );
}
