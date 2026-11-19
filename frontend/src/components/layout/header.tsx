"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Search,
  HelpCircle,
  Bell,
  Upload,
  Plus,
  Command,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui-store";

interface HeaderProps {
  className?: string;
  onUploadClick?: () => void;
}

export function Header({ className, onUploadClick }: HeaderProps) {
  const router = useRouter();
  const { toggleSidebarMobile } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/documents?q=${encodeURIComponent(searchQuery.trim())}` as Route);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 lg:left-[260px] right-0 z-40 flex h-16 items-center justify-between bg-surface/80 px-4 sm:px-6 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.02)]",
        className
      )}
    >
      {/* Mobile Menu & Quick Search */}
      <div className="flex flex-1 items-center gap-2.5 max-w-md">
        <button
          type="button"
          onClick={toggleSidebarMobile}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container lg:hidden transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Quick search documents, chats, citations..."
            className="w-full rounded-lg bg-surface-container-lowest py-1.5 pl-9 pr-14 text-sm text-on-surface placeholder:text-outline shadow-xs border border-outline-variant/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded bg-surface-container px-1.5 py-0.5 text-[10px] font-mono text-on-surface-variant pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Action Stack */}
      <div className="flex items-center gap-3">
        {/* Help & Docs */}
        <Link
          href="https://github.com"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help & Docs</span>
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* Structural Divider */}
        <div className="h-4 w-px bg-outline-variant/60" />

        {/* Upload Button */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onUploadClick || (() => router.push("/documents?action=upload" as Route))}
          className="gap-1.5 font-semibold text-xs"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload</span>
        </Button>

        {/* New Chat Button */}
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => router.push("/chat" as Route)}
          className="gap-1.5 font-semibold text-xs shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Chat</span>
        </Button>
      </div>
    </header>
  );
}
