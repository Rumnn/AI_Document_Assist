"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  UploadCloud,
  FolderPlus,
  Trash2,
  FileDown,
  CheckCircle,
  Library,
  Layers,
  Activity,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DocumentFilters } from "@/components/document/document-filters";
import { DocumentTable } from "@/components/document/document-table";
import { DocumentCard } from "@/components/document/document-card";
import { UploadModal } from "@/components/document/upload-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { MOCK_DOCUMENTS, MOCK_FOLDERS } from "@/lib/mock/data";
import toast from "react-hot-toast";

function DocumentsContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlAction = searchParams.get("action") || "";
  const urlFolder = searchParams.get("folder") || null;

  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [search, setSearch] = useState(urlQuery);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(urlFolder);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(urlAction === "upload");

  // Sync state if URL search query changes
  useEffect(() => {
    if (urlQuery !== search) {
      setSearch(urlQuery);
    }
  }, [urlQuery]);

  // Open upload modal if requested via action=upload
  useEffect(() => {
    if (urlAction === "upload") {
      setIsUploadOpen(true);
    }
  }, [urlAction]);

  const getFolderName = (folderId?: string | null) => {
    if (!folderId) return "Root Workspace";
    const found = MOCK_FOLDERS.find((f) => f.id === folderId);
    return found ? found.name : "Legal & Compliance";
  };

  // Filtered documents with smart matching for ID, name, file type, folder & storage key
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Search filter
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        // Normalized alphanumeric comparison to match e.g. "doc01", "doc-01", "doc1"
        const cleanQ = q.replace(/[-_\s]/g, "");
        const cleanId = doc.id.toLowerCase().replace(/[-_\s]/g, "");
        const cleanName = doc.name.toLowerCase().replace(/[-_\s]/g, "");

        const matchesName = doc.name.toLowerCase().includes(q) || cleanName.includes(cleanQ);
        const matchesId = doc.id.toLowerCase().includes(q) || cleanId.includes(cleanQ);
        const matchesType = doc.file_type.toLowerCase().includes(q);
        const matchesKey = doc.storage_key.toLowerCase().includes(q);
        const matchesFolder = getFolderName(doc.folder_id).toLowerCase().includes(q);

        if (!matchesName && !matchesId && !matchesType && !matchesKey && !matchesFolder) {
          return false;
        }
      }

      // Folder filter
      if (selectedFolder && doc.folder_id !== selectedFolder) {
        return false;
      }

      // Type filter
      if (selectedType !== "all" && doc.file_type !== selectedType) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all" && doc.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [documents, search, selectedFolder, selectedType, selectedStatus]);

  // Selection handlers
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocs.map((d) => d.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDocuments((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
    toast.success(`Deleted ${selectedIds.length} document(s)`);
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    toast.success(`Exporting ${selectedIds.length} document(s)...`);
  };

  const handleNewFolder = () => {
    const name = prompt("Enter new folder name:");
    if (name && name.trim()) {
      toast.success(`Folder "${name.trim()}" created successfully!`);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedFolder(null);
    setSelectedType("all");
    setSelectedStatus("all");
  };

  return (
    <div className="mx-auto max-w-[1600px] w-full p-6 md:p-8 space-y-6">
      {/* 1. Top Title Bar & Primary Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Storage Index / Root
            </span>
            <span className="text-outline">•</span>
            <span className="text-primary font-semibold flex items-center gap-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
              RAG Engine Live
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            My Documents
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Manage, search, and organize indexed files across workspaces.
          </p>
        </div>

        {/* Top Controls: Upload, Folder, Bulk Ops */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Bulk actions bar (shows when at least 1 document is selected) */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-surface-container-high px-3 py-1.5 shadow-xs border border-outline-variant/60 animate-in fade-in">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {selectedIds.length} selected
              </span>
              <div className="h-3.5 w-px bg-outline-variant/80 mx-1" />
              <button
                type="button"
                onClick={handleBulkExport}
                className="text-xs font-medium text-on-surface hover:text-primary transition-colors flex items-center gap-1"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="text-xs font-medium text-error hover:opacity-80 transition-opacity flex items-center gap-1 ml-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleNewFolder}
            className="gap-1.5 font-semibold text-xs"
          >
            <FolderPlus className="h-4 w-4 text-on-surface-variant" />
            <span>New Folder</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="gap-1.5 font-semibold text-xs shadow-xs"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* 2. Quick Stats Spark Mini-Banner (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
              Indexed Documents
            </span>
            <span className="text-xl font-bold text-on-surface mt-0.5 tabular-nums">
              {documents.length}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-on-primary-fixed-variant">
            <Library className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
              Extracted Chunks
            </span>
            <span className="text-xl font-bold text-on-surface mt-0.5 tabular-nums">
              2,840
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
              Workspace Sync
            </span>
            <span className="text-xl font-bold text-on-tertiary-fixed-variant mt-0.5">
              Healthy
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-fixed text-on-tertiary-fixed">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
              Storage Capacity
            </span>
            <span className="font-mono text-xs font-bold text-on-surface">42% Used</span>
          </div>
          <Progress value={42} className="h-1.5 mt-2 bg-surface-container" indicatorClassName="bg-primary" />
        </div>
      </div>

      {/* 3. Filters: Workspace Folder Pills & Search Bar */}
      <DocumentFilters
        search={search}
        onSearchChange={setSearch}
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalDocs={documents.length}
      />

      {/* 4. Document List or Grid or Empty State */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-8 w-8 text-outline" />}
          title="No documents found"
          description={
            search.trim()
              ? `No documents matched "${search}". Try checking for typos or searching by keyword or file type.`
              : "Try adjusting your search terms or clearing selected filters to find your files."
          }
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === "list" ? (
        <DocumentTable
          documents={filteredDocs}
          selectedIds={selectedIds}
          onSelectToggle={handleSelectToggle}
          onSelectAll={handleSelectAll}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              isSelected={selectedIds.includes(doc.id)}
              onSelectToggle={handleSelectToggle}
            />
          ))}
        </div>
      )}

      {/* 5. Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          setDocuments(MOCK_DOCUMENTS);
        }}
      />
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading Document Library..." />}>
      <DocumentsContent />
    </Suspense>
  );
}
