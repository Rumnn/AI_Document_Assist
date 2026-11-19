"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <Header />
      <main className="pl-0 lg:pl-[260px] pt-16 min-h-screen w-full transition-all">
        {children}
      </main>
    </div>
  );
}
