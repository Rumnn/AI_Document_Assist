"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { MessageSquare, Bookmark, Sparkles, ArrowRight } from "lucide-react";
import { MOCK_CONVERSATIONS } from "@/lib/mock/data";

export function RecentConversations() {
  const router = useRouter();

  const conversationCards = [
    {
      id: "conv-01",
      title: "What are our key risk mitigations identified in the SOC2 audit report?",
      time: "2 hours ago",
      snippet:
        "Based on Section 4.2 & Appendix B, Acme Corp applies AES-256 multi-tenant partition isolation, daily immutable snapshots across AWS us-east-1, and enforced hardware MFA keys on all CI/CD deployment channels...",
      citations: "4 citations",
      docName: "SOC2_Compliance_Audit_2024.docx",
    },
    {
      id: "conv-02",
      title: "Compare Q2 vs Q3 EBITDA margins and highlight revenue variances",
      time: "Yesterday",
      snippet:
        "Q3 adjusted EBITDA improved from 18.4% to 22.1% (+370 bps). Top-line revenue increased by $1.4M driven by enterprise renewals, while cloud infrastructure unit costs decreased by 8.5% through reserved instances...",
      citations: "3 citations",
      docName: "Q3_Financial_Forecast_v2.pdf",
    },
  ];

  return (
    <div className="flex flex-col rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight text-on-surface">
            Recent AI Conversations
          </h2>
        </div>
        <Link
          href={"/chat-history" as Route}
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <span>All threads</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {conversationCards.map((conv) => (
          <div
            key={conv.id}
            onClick={() => router.push(`/chat?session=${conv.id}` as Route)}
            className="group flex flex-col gap-2 rounded-xl bg-surface-container-low p-4 hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/20 hover:border-outline-variant/60"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-fixed text-primary text-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <h3 className="truncate text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {conv.title}
                </h3>
              </div>
              <span className="shrink-0 text-xs text-outline">{conv.time}</span>
            </div>

            <p className="line-clamp-2 text-xs leading-relaxed text-on-surface-variant pl-8.5">
              {conv.snippet}
            </p>

            <div className="flex items-center gap-2 pl-8.5 pt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2 py-0.5 text-[11px] font-semibold text-on-primary-fixed-variant">
                <Bookmark className="h-3 w-3" />
                {conv.citations}
              </span>
              <span className="font-mono text-[11px] text-on-surface-variant">
                {conv.docName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
