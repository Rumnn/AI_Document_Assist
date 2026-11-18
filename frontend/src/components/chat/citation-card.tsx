"use client";

import React from "react";
import { Eye, ArrowRight, ExternalLink } from "lucide-react";
import { CitationItem } from "@/types/chat";

interface CitationCardProps {
  citation: CitationItem;
  isActive?: boolean;
  onSelect?: (citation: CitationItem) => void;
}

export function CitationCard({
  citation,
  isActive = false,
  onSelect,
}: CitationCardProps) {
  return (
    <div
      onClick={() => onSelect?.(citation)}
      className={`p-3 rounded-xl bg-surface-container-lowest shadow-xs hover:shadow-sm transition-all cursor-pointer group border ${
        isActive
          ? "border-primary ring-1 ring-primary/40 bg-primary-fixed/5"
          : "border-outline-variant/40 hover:border-outline-variant/80"
      }`}
    >
      {/* Top Header: Index, Doc Name, Page, Match */}
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
              isActive
                ? "bg-primary text-on-primary"
                : "bg-primary-fixed text-on-primary-fixed-variant"
            }`}
          >
            #{citation.citation_index}
          </span>
          <span className="text-xs font-semibold text-on-surface truncate">
            {citation.document_name}
          </span>
          {citation.page_number && (
            <span className="text-[11px] text-outline flex-shrink-0">
              Page {citation.page_number}
            </span>
          )}
        </div>

        {citation.semantic_match && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
              citation.semantic_match >= 90
                ? "bg-surface-container text-primary"
                : "bg-surface-container text-on-surface-variant font-medium"
            }`}
          >
            {citation.semantic_match}% match
          </span>
        )}
      </div>

      {/* Snippet Quote */}
      <p className="text-xs text-on-surface-variant italic line-clamp-2 pl-2 border-l-2 border-primary/70 my-1">
        "{citation.snippet}"
      </p>

      {/* Footer Status / Jump Action */}
      <div className="mt-2 flex items-center justify-between pt-1 border-t border-outline-variant/20">
        <span
          className={`text-[11px] font-semibold flex items-center gap-1 ${
            isActive ? "text-primary" : "text-outline group-hover:text-primary transition-colors"
          }`}
        >
          {isActive ? (
            <>
              <Eye className="h-3.5 w-3.5" />
              <span>Viewing in center canvas</span>
            </>
          ) : (
            <>
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Jump to Page {citation.page_number || 1}</span>
            </>
          )}
        </span>

        <ArrowRight
          className={`h-3.5 w-3.5 text-outline group-hover:text-primary transition-transform group-hover:translate-x-0.5 ${
            isActive ? "text-primary" : ""
          }`}
        />
      </div>
    </div>
  );
}
