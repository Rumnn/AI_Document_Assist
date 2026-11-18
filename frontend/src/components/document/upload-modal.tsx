"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  FileText,
  CheckCircle2,
  Loader2,
  Folder,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_FOLDERS } from "@/lib/mock/data";
import { formatBytes } from "@/lib/utils";
import toast from "react-hot-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>(MOCK_FOLDERS[0].id);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(
        (f) =>
          f.name.endsWith(".pdf") ||
          f.name.endsWith(".docx") ||
          f.name.endsWith(".txt")
      );
      if (files.length === 0) {
        toast.error("Only PDF, DOCX, and TXT files are supported.");
        return;
      }
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startUpload = () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setProgress(15);
    setUploadStage("Uploading files to secure storage...");

    setTimeout(() => {
      setProgress(45);
      setUploadStage("Parsing pages & extracting text chunks...");
    }, 800);

    setTimeout(() => {
      setProgress(80);
      setUploadStage("Computing BAAI/bge-m3 dense & sparse vectors...");
    }, 1600);

    setTimeout(() => {
      setProgress(100);
      setUploadStage("Indexing complete! Vectors stored in Qdrant.");
      toast.success("Documents successfully processed and indexed!");
      setTimeout(() => {
        setUploading(false);
        setSelectedFiles([]);
        setProgress(0);
        onClose();
        if (onUploadSuccess) onUploadSuccess();
      }, 600);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant/60">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Upload Documents</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Add PDF, DOCX, or TXT files to your knowledge base.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="rounded-lg p-1.5 text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          {/* Target Folder Selector */}
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">
              Target Workspace Folder
            </label>
            <div className="relative">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                disabled={uploading}
                className="w-full rounded-lg bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {MOCK_FOLDERS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.doc_count} docs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dropzone */}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!uploading && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl p-8 text-center cursor-pointer border-2 border-dashed transition-all ${
                dragActive
                  ? "border-primary bg-primary-fixed/20 scale-[0.99]"
                  : "border-outline-variant/60 bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-primary mb-3 shadow-xs">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-on-surface">
                Click to browse or drag & drop files
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Supports PDF, DOCX, TXT up to 50MB
              </p>
            </div>
          )}

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              <span className="text-xs font-semibold text-on-surface block">
                Selected Files ({selectedFiles.length})
              </span>
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-surface-container-low p-2.5 text-xs border border-outline-variant/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate font-medium text-on-surface max-w-[280px]">
                      {file.name}
                    </span>
                    <span className="text-outline font-mono text-[11px] shrink-0">
                      ({formatBytes(file.size)})
                    </span>
                  </div>
                  {!uploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="text-outline hover:text-error p-1 rounded transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress bar during upload */}
          {uploading && (
            <div className="rounded-xl bg-surface-container-low p-4 space-y-2.5 border border-outline-variant/40">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {uploadStage}
                </span>
                <span className="font-mono font-bold text-on-surface">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-surface-container" indicatorClassName="bg-primary" />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/30">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={startUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="gap-2 shadow-xs"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Start Ingest ({selectedFiles.length})</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
