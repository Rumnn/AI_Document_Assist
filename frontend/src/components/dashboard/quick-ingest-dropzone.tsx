"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

export function QuickIngestDropzone() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      toast.success(`Queued ${files[0].name} for RAG extraction`);
      router.push("/documents" as Route);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`Uploading ${files[0].name}...`);
      router.push("/documents" as Route);
    }
  };

  return (
    <div className="flex flex-col rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-on-surface">
          Quick Ingest
        </h2>
        <span className="rounded bg-surface-container px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
          RAG Auto
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        id="dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group flex flex-col items-center justify-center rounded-xl p-6 text-center cursor-pointer transition-all border border-dashed ${
          isDragOver
            ? "border-primary bg-primary-fixed/20 scale-[0.99]"
            : "border-outline-variant/60 bg-surface-container-low hover:bg-surface-container"
        }`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-primary transition-transform group-hover:scale-110 shadow-xs">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-on-surface">
          Drop new files here
        </p>
        <p className="mt-1 max-w-[220px] text-xs text-on-surface-variant leading-relaxed">
          Files are automatically parsed, chunked, and vectorized with embeddings.
        </p>

        <div className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-outline">
          <span className="rounded bg-surface-container-highest px-1.5 py-0.5 text-on-surface font-semibold">
            PDF
          </span>
          <span className="rounded bg-surface-container-highest px-1.5 py-0.5 text-on-surface font-semibold">
            DOCX
          </span>
          <span className="rounded bg-surface-container-highest px-1.5 py-0.5 text-on-surface font-semibold">
            TXT
          </span>
          <span>up to 50MB</span>
        </div>
      </div>
    </div>
  );
}
