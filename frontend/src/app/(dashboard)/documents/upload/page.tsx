"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ArrowLeft, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_FOLDERS } from "@/lib/mock/data";
import toast from "react-hot-toast";

export default function DocumentUploadPage() {
  const router = useRouter();
  const [selectedFolder, setSelectedFolder] = useState<string>(MOCK_FOLDERS[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a document file to upload.");
      return;
    }
    setUploading(true);
    setProgress(30);

    setTimeout(() => {
      setProgress(75);
    }, 600);

    setTimeout(() => {
      setProgress(100);
      toast.success("Document uploaded and indexed successfully!");
      setTimeout(() => {
        router.push("/documents" as Route);
      }, 500);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-2xl w-full p-6 md:p-8 space-y-6">
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

      <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-xs border border-outline-variant/60">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Upload Document
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Upload a document to parse, chunk, and index into your AI vector knowledge base.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Folder */}
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">
              Select Workspace Folder
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full rounded-lg bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {MOCK_FOLDERS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.doc_count} docs)
                </option>
              ))}
            </select>
          </div>

          {/* File Picker */}
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">
              Document File (PDF, DOCX, TXT)
            </label>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/60 bg-surface-container-low p-8 text-center hover:bg-surface-container transition-colors">
              <UploadCloud className="h-8 w-8 text-primary mb-2" />
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="text-xs text-on-surface file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary-hover cursor-pointer"
              />
              <p className="text-[11px] text-outline mt-2">Maximum file size: 50MB</p>
            </div>
          </div>

          {/* Progress */}
          {uploading && (
            <div className="space-y-2 rounded-xl bg-surface-container-low p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-primary">
                <span>Indexing with BAAI/bge-m3...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-surface-container" indicatorClassName="bg-primary" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/documents" as Route)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!file || uploading}
              className="gap-2 shadow-xs"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Start Upload & Vectorize</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
