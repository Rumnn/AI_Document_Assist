"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  MessageSquare,
  Users,
  Building2,
  Shield,
  Settings,
  ChevronsUpDown,
  MoreVertical,
  LogOut,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MOCK_USER, MOCK_WORKSPACES } from "@/lib/mock/data";

interface SidebarProps {
  className?: string;
  onUploadClick?: () => void;
  onNewChatClick?: () => void;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [activeWorkspace] = useState(MOCK_WORKSPACES[0]);
  const user = MOCK_USER;

  interface NavItem {
    label: string;
    href: Route;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
    badge?: string;
    badgeVariant?: string;
  }

  const mainNavItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard" as Route,
      icon: LayoutDashboard,
      active: pathname === "/dashboard" || pathname === "/",
    },
    {
      label: "Documents",
      href: "/documents" as Route,
      icon: FileText,
      active: pathname.startsWith("/documents"),
      badge: "24",
    },
    {
      label: "AI Chat",
      href: "/chat" as Route,
      icon: Sparkles,
      active: pathname.startsWith("/chat"),
      badge: "New",
      badgeVariant: "tertiary",
    },
    {
      label: "Chat History",
      href: "/chat-history" as Route,
      icon: MessageSquare,
      active: pathname.startsWith("/chat-history"),
    },
    {
      label: "Shared with me",
      href: "/shared" as Route,
      icon: Users,
      active: pathname.startsWith("/shared"),
    },
    {
      label: "Workspace",
      href: "/workspaces" as Route,
      icon: Building2,
      active: pathname.startsWith("/workspaces"),
    },
  ];

  const systemNavItems: NavItem[] = [
    {
      label: "Admin Console",
      href: "/admin" as Route,
      icon: Shield,
      active: pathname.startsWith("/admin"),
    },
    {
      label: "Settings",
      href: "/settings" as Route,
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col justify-between bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/40 select-none",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex flex-1 flex-col min-h-0">
        {/* Brand / Logo */}
        <div className="flex h-16 items-center px-4">
          <Link href={"/dashboard" as Route} className="flex items-center gap-2.5 min-w-0 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-base font-semibold text-on-surface tracking-tight">
                DocuMind
              </span>
              <span className="rounded bg-primary-fixed px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-primary-fixed-variant">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Switcher */}
        <div className="px-3 py-1">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg bg-surface-container-low p-2 hover:bg-surface-container-high transition-colors text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-container text-xs font-semibold text-on-primary">
                {activeWorkspace.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-on-surface truncate">
                  {activeWorkspace.name}
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  {activeWorkspace.member_count} team members
                </div>
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-outline" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2 scrollbar-none">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                  item.active
                    ? "bg-primary-container font-semibold text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4 shrink-0", item.active ? "text-on-primary" : "text-on-surface-variant")} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[11px] font-semibold",
                      item.badgeVariant === "tertiary"
                        ? "bg-tertiary-fixed text-on-tertiary-fixed"
                        : item.active
                        ? "bg-primary-fixed text-on-primary-fixed-variant"
                        : "bg-surface-container text-on-surface"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 pb-1">
            <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-outline">
              System
            </span>
          </div>

          {systemNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                  item.active
                    ? "bg-primary-container font-semibold text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4 shrink-0", item.active ? "text-on-primary" : "text-on-surface-variant")} />
                  <span className="truncate">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Storage & User Widget */}
      <div className="flex flex-col gap-2 p-3 bg-surface-container-lowest border-t border-outline-variant/30">
        {/* Storage card */}
        <div className="rounded-lg bg-surface-container-low p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-on-surface-variant">Storage</span>
            <span className="text-[11px] font-semibold text-on-surface tabular-nums">
              4.2 GB / 10 GB
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: "42%" }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-outline">
            <span>42% used</span>
            <Link href={"/settings" as Route} className="text-primary hover:underline font-medium">
              Upgrade
            </Link>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="flex items-center justify-between rounded-lg p-1.5 hover:bg-surface-container-low transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url || ""} alt={user.full_name} />
              <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 truncate">
              <div className="text-xs font-semibold text-on-surface truncate leading-none">
                {user.full_name}
              </div>
              <div className="text-[11px] text-on-surface-variant truncate mt-0.5">
                {user.email}
              </div>
            </div>
          </div>
          <Link
            href={"/login" as Route}
            className="p-1 text-outline hover:text-error rounded hover:bg-surface-container transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
