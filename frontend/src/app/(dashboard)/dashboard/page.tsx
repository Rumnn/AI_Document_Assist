import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { UploadCloud, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewMetrics } from "@/components/dashboard/overview-metrics";
import { RecentDocuments } from "@/components/dashboard/recent-documents";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { QuickIngestDropzone } from "@/components/dashboard/quick-ingest-dropzone";
import { WorkspaceActivity } from "@/components/dashboard/workspace-activity";
import { RagStatusCard } from "@/components/dashboard/rag-status-card";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] w-full p-6 md:p-8 space-y-6">
      {/* 1. Welcome & Quick Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
            <span>Overview</span>
            <span className="text-outline">/</span>
            <span className="text-primary font-semibold">Workspace Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Welcome back, Elena!
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Here is what is happening across your 24 indexed documents and 6 AI workspaces today.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" asChild className="gap-2 group shadow-2xs">
            <Link href={"/documents?action=upload" as Route}>
              <UploadCloud className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5" />
              <span className="font-semibold text-xs">Upload Document</span>
            </Link>
          </Button>

          <Button variant="primary" asChild className="gap-2 group shadow-xs">
            <Link href={"/chat" as Route}>
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span className="font-semibold text-xs">Start New Chat</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Overview Metrics Row (4 Cards) */}
      <OverviewMetrics />

      {/* 3. Main Workspace Split (8 cols Left / 4 cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          <RecentDocuments />
          <RecentConversations />
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-w-0">
          <QuickIngestDropzone />
          <WorkspaceActivity />
          <RagStatusCard />
        </div>
      </div>
    </div>
  );
}
