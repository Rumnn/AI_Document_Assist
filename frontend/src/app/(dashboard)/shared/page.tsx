"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Users,
  Search,
  FileText,
  Sparkles,
  Eye,
  Download,
  Shield,
  Clock,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatBytes, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_SHARED_DOCS = [
  {
    id: "doc-shared-01",
    name: "Enterprise_Cloud_SLA_Q4.pdf",
    shared_by: "Marcus Holloway",
    shared_by_email: "marcus@acme.io",
    shared_by_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    permission: "Can Edit & Query",
    file_size: 4200000,
    page_count: 36,
    shared_at: "2024-09-16T11:00:00Z",
    workspace_name: "Engineering Infra & Cloud",
  },
  {
    id: "doc-shared-02",
    name: "GDPR_DPA_Data_Processing_Agreement.docx",
    shared_by: "Sarah Chen",
    shared_by_email: "sarah.c@acme.io",
    shared_by_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    permission: "Read & Query",
    file_size: 2800000,
    page_count: 24,
    shared_at: "2024-09-14T08:30:00Z",
    workspace_name: "Global Legal & M&A",
  },
  {
    id: "doc-shared-03",
    name: "Vendor_Security_Due_Diligence.pdf",
    shared_by: "David Kim",
    shared_by_email: "david.k@acme.io",
    shared_by_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    permission: "Read-Only",
    file_size: 7100000,
    page_count: 52,
    shared_at: "2024-09-11T14:15:00Z",
    workspace_name: "Acme Corp Labs",
  },
];

export default function SharedPage() {
  const [docs, setDocs] = useState(MOCK_SHARED_DOCS);
  const [search, setSearch] = useState("");

  const filtered = docs.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.shared_by.toLowerCase().includes(q) ||
      d.workspace_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-[1600px] w-full p-6 md:p-8 space-y-6">
      {/* 1. Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              External &amp; Cross-Workspace Shares
            </span>
            <span className="text-outline">•</span>
            <span className="text-primary font-semibold flex items-center gap-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
              Fine-Grained RBAC
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Shared With Me
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Documents and research materials shared with you by other teams or external partners.
          </p>
        </div>
      </div>

      {/* 2. Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shared documents, authors, or workspaces..."
          className="w-full rounded-lg bg-surface-container-lowest py-2 pl-9 pr-4 text-xs text-on-surface placeholder:text-outline shadow-xs border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* 3. Shared Documents Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Share2 className="h-8 w-8 text-outline" />}
          title="No shared files found"
          description="Documents shared with your account from other workspaces will appear here."
          actionLabel="Clear Search"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-outline text-xs font-semibold border-b border-outline-variant/30">
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Shared By</th>
                  <th className="py-3 px-4">Origin Workspace</th>
                  <th className="py-3 px-4">Permission</th>
                  <th className="py-3 px-4">Shared Date</th>
                  <th className="py-3 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary shadow-xs">
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-outline font-mono">
                            {item.page_count} pages • {formatBytes(item.file_size)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={item.shared_by_avatar} alt={item.shared_by} />
                          <AvatarFallback className="text-[10px] bg-primary-fixed text-primary font-bold">
                            {item.shared_by.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-on-surface leading-tight">
                            {item.shared_by}
                          </p>
                          <p className="text-[10px] text-outline">{item.shared_by_email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-medium text-[11px]">
                        {item.workspace_name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-semibold">
                        <Shield className="h-3 w-3" />
                        <span>{item.permission}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-outline font-mono">
                      {formatDate(item.shared_at)}
                    </td>

                    <td className="py-3.5 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="primary"
                          size="sm"
                          asChild
                          className="gap-1 font-semibold text-[11px] shadow-xs"
                        >
                          <Link href={`/chat?doc=${item.id}` as Route}>
                            <Sparkles className="h-3 w-3" />
                            <span>Ask AI</span>
                          </Link>
                        </Button>

                        <button
                          type="button"
                          onClick={() => toast.success(`Downloading ${item.name}...`)}
                          className="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                          title="Download document"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
