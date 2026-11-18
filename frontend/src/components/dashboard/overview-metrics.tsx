import React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  FileText,
  MessageSquare,
  Cloud,
  Brain,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function OverviewMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Card 1: Total Documents */}
      <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/50 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-on-surface-variant block">
              Total Documents
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-on-surface tabular-nums">
                24
              </span>
              <span className="text-xs text-on-surface-variant">files</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <FileText className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-3">
          <span className="text-xs text-on-surface-variant">Across 4 workspaces</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-0.5 text-[11px] font-semibold text-on-tertiary-fixed">
            <TrendingUp className="h-3 w-3" />
            +14.2%
          </span>
        </div>
      </div>

      {/* Card 2: Total Conversations */}
      <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/50 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-on-surface-variant block">
              Total Conversations
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-on-surface tabular-nums">
                142
              </span>
              <span className="text-xs font-semibold text-tertiary-container">
                +18 today
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed text-on-secondary-fixed">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-3">
          <span className="text-xs text-on-surface-variant">
            Average 4.8 citations / session
          </span>
          <span className="h-2 w-2 rounded-full bg-tertiary-container animate-pulse" />
        </div>
      </div>

      {/* Card 3: Storage Usage */}
      <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/50 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-on-surface-variant block">
              Storage Usage
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-on-surface tabular-nums">
                4.2
              </span>
              <span className="text-xs text-on-surface-variant">GB of 10 GB</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-on-surface">
            <Cloud className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Progress value={42} className="h-2 bg-surface-container" indicatorClassName="bg-primary" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">42% utilized</span>
            <Link
              href={"/settings" as Route}
              className="font-semibold text-primary hover:underline text-[11px]"
            >
              Upgrade Plan →
            </Link>
          </div>
        </div>
      </div>

      {/* Card 4: AI Requests & Accuracy */}
      <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/50 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-on-surface-variant block">
              AI Requests & Queries
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-on-surface tabular-nums">
                1,840
              </span>
              <span className="rounded bg-tertiary-fixed px-1.5 py-0.2 text-[11px] font-mono font-bold text-on-tertiary-fixed">
                99.4%
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed-dim text-primary">
            <Brain className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-3">
          <span className="text-xs text-on-surface-variant">
            12.4k embeddings indexed
          </span>
          <span className="font-mono text-[11px] text-outline">bge-m3</span>
        </div>
      </div>
    </div>
  );
}
