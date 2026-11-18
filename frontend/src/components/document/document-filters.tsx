"use client";

import React from "react";
import {
  Search,
  Filter,
  Calendar,
  Layers,
  Building,
  LayoutList,
  LayoutGrid,
  Folder,
  FolderArchive,
} from "lucide-react";
import { MOCK_FOLDERS } from "@/lib/mock/data";

interface DocumentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  totalDocs: number;
}

export function DocumentFilters({
  search,
  onSearchChange,
  selectedFolder,
  onFolderSelect,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  totalDocs,
}: DocumentFiltersProps) {
  return (
    <div className="space-y-4">
      {/* 1. Workspace Folder Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold uppercase tracking-wider text-outline shrink-0 mr-1">
          Workspaces:
        </span>

        <button
          type="button"
          onClick={() => onFolderSelect(null)}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
            selectedFolder === null
              ? "bg-primary-fixed text-on-primary-fixed-variant shadow-xs"
              : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-outline-variant/40"
          }`}
        >
          <FolderArchive className="h-4 w-4" />
          <span>All Documents</span>
          <span
            className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
              selectedFolder === null
                ? "bg-surface-container-lowest text-on-primary-fixed-variant"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {totalDocs}
          </span>
        </button>

        {MOCK_FOLDERS.map((f) => {
          const isSelected = selectedFolder === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onFolderSelect(f.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all shrink-0 ${
                isSelected
                  ? "bg-primary-fixed text-on-primary-fixed-variant font-semibold shadow-xs"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-outline-variant/40"
              }`}
            >
              <Folder className={`h-4 w-4 ${isSelected ? "text-primary" : "text-outline"}`} />
              <span>{f.name}</span>
              <span className="rounded-full bg-surface-container px-1.5 py-0.2 font-mono text-[10px] text-on-surface-variant">
                {f.doc_count} docs
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Live Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-xl bg-surface-container-lowest p-2.5 shadow-xs border border-outline-variant/50">
        {/* Search input with keyboard shortcut prompt */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents by title, contents, tags, or semantic meaning... (Press /)"
            className="w-full rounded-lg bg-surface-container-low py-2 pl-9 pr-10 text-xs text-on-surface placeholder:text-outline transition-all focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-surface-container-high px-1.5 py-0.5 text-[10px] font-mono text-on-surface-variant pointer-events-none">
            /
          </kbd>
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* File Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="flex items-center rounded-lg bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface appearance-none pr-8 hover:bg-surface-container-high transition-colors cursor-pointer focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF only</option>
              <option value="docx">Word (.docx)</option>
              <option value="txt">Text (.txt)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="flex items-center rounded-lg bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface appearance-none pr-8 hover:bg-surface-container-high transition-colors cursor-pointer focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed / Error</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-surface-container-low p-0.5 border border-outline-variant/30">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`rounded-md p-1.5 transition-all ${
                viewMode === "list"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-outline hover:text-on-surface"
              }`}
              title="List View"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`rounded-md p-1.5 transition-all ${
                viewMode === "grid"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-outline hover:text-on-surface"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
