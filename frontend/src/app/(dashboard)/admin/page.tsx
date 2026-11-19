"use client";

import React, { useState } from "react";
import {
  Shield,
  Activity,
  Server,
  Database,
  Cpu,
  Layers,
  Users,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_ADMIN_USERS = [
  {
    id: "usr-01",
    name: "Elena Vance",
    email: "elena@acme.io",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    is_superuser: true,
    is_active: true,
    last_login: "Just now",
  },
  {
    id: "usr-02",
    name: "Marcus Holloway",
    email: "marcus@acme.io",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    is_superuser: true,
    is_active: true,
    last_login: "2 hours ago",
  },
  {
    id: "usr-03",
    name: "Sarah Chen",
    email: "sarah.c@acme.io",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    is_superuser: false,
    is_active: true,
    last_login: "Yesterday",
  },
  {
    id: "usr-04",
    name: "David Kim",
    email: "david.k@acme.io",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    is_superuser: false,
    is_active: false,
    last_login: "5 days ago",
  },
];

const MOCK_AUDIT_LOGS = [
  {
    id: "log-101",
    timestamp: "2024-09-18T10:42:02Z",
    event: "RAG_RETRIEVAL_QUERY",
    actor: "elena@acme.io",
    resource: "SOC2_Compliance_Audit_2024.docx",
    status: "success",
    latency: "185ms",
  },
  {
    id: "log-102",
    timestamp: "2024-09-18T10:15:00Z",
    event: "VECTOR_UPSERT_BATCH",
    actor: "celery_worker_01",
    resource: "qdrant_collection_ws-01 (180 points)",
    status: "success",
    latency: "410ms",
  },
  {
    id: "log-103",
    timestamp: "2024-09-17T08:46:00Z",
    event: "DOCUMENT_OCR_FAILED",
    actor: "celery_worker_02",
    resource: "Corrupted_Archive_Scan.pdf",
    status: "error",
    latency: "1240ms",
  },
  {
    id: "log-104",
    timestamp: "2024-09-16T14:30:00Z",
    event: "KMS_KEY_ROTATION_SCHEDULE",
    actor: "cron_daemon_security",
    resource: "arn:aws:kms:us-east-1:acme-key",
    status: "success",
    latency: "92ms",
  },
];

export default function AdminPage() {
  const [users, setUsers] = useState(MOCK_ADMIN_USERS);
  const [logs] = useState(MOCK_AUDIT_LOGS);

  const handleToggleUser = (id: string, name: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
    );
    toast.success(`Updated status for ${name}`);
  };

  const handleReindex = () => {
    toast.success("Triggered background vector re-indexing on Celery queue");
  };

  const handlePurgeCache = () => {
    toast.success("Redis semantic cache flushed (0 errors)");
  };

  return (
    <div className="mx-auto max-w-[1600px] w-full p-6 md:p-8 space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Enterprise Superuser Control
            </span>
            <span className="text-outline">•</span>
            <span className="text-primary font-semibold flex items-center gap-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
              All Pods Healthy
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Admin Console &amp; Cluster Telemetry
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Monitor infrastructure health, manage organization accounts, and inspect SOC2 audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePurgeCache}
            className="gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Flush Cache</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleReindex}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Database className="h-3.5 w-3.5" />
            <span>Re-Index Vectors</span>
          </Button>
        </div>
      </div>

      {/* 2. Infrastructure Cluster Health (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Celery */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-primary" />
              Celery Worker
            </span>
            <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
          </div>
          <p className="text-xl font-bold text-on-surface tabular-nums">2 Active</p>
          <p className="text-[11px] text-tertiary font-medium">0 failed tasks in queue</p>
        </div>

        {/* PostgreSQL */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline flex items-center gap-1.5">
              <Database className="h-4 w-4 text-primary" />
              Postgres 16
            </span>
            <span className="h-2 w-2 rounded-full bg-tertiary" />
          </div>
          <p className="text-xl font-bold text-on-surface tabular-nums">14 / 100 Conn</p>
          <p className="text-[11px] text-on-surface-variant font-mono">Pool Latency: 1.2ms</p>
        </div>

        {/* Qdrant */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary" />
              Qdrant Vector DB
            </span>
            <span className="h-2 w-2 rounded-full bg-tertiary" />
          </div>
          <p className="text-xl font-bold text-on-surface tabular-nums">2,840 Vectors</p>
          <p className="text-[11px] text-tertiary font-mono">HNSW Search: 4.2ms</p>
        </div>

        {/* Redis */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-outline flex items-center gap-1.5">
              <Server className="h-4 w-4 text-primary" />
              Redis 7 Cluster
            </span>
            <span className="h-2 w-2 rounded-full bg-tertiary" />
          </div>
          <p className="text-xl font-bold text-on-surface tabular-nums">42 MB Used</p>
          <p className="text-[11px] text-on-surface-variant font-mono">Hit Ratio: 98.4%</p>
        </div>
      </div>

      {/* 3. User Administration */}
      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div>
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>User Directory &amp; RBAC Control</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Grant superuser privileges, disable deactivated employees, and view activity.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Privilege</th>
                <th className="py-2.5 px-3">Account Status</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-3 text-right">Toggle Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={u.avatar_url} alt={u.name} />
                        <AvatarFallback className="bg-primary-fixed text-primary font-bold text-xs">
                          {u.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-on-surface">{u.name}</p>
                        <p className="text-[11px] text-outline">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    {u.is_superuser ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-bold text-[10px]">
                        <Shield className="h-3 w-3" />
                        <span>Superuser</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
                        Standard Member
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    {u.is_active ? (
                      <span className="inline-flex items-center gap-1 text-tertiary font-semibold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-outline font-semibold text-[11px]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Suspended</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-outline font-mono text-[11px]">
                    {u.last_login}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleUser(u.id, u.name)}
                      className={`text-xs font-semibold hover:underline ${
                        u.is_active ? "text-error" : "text-primary"
                      }`}
                    >
                      {u.is_active ? "Suspend Access" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SOC2 Immutable Audit Log */}
      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div>
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Clock className="h-5 w-5 text-tertiary" />
              <span>SOC2 Immutable Access &amp; Audit Trail</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Cryptographically verified event stream recorded in accordance with SOC2 Type II ledger guidelines.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-mono font-bold">
            Live Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Actor / Process</th>
                <th className="py-2.5 px-3">Target Resource</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 text-outline">{formatDate(log.timestamp)}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-bold text-[10px]">
                      {log.event}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-on-surface font-sans font-medium">{log.actor}</td>
                  <td className="py-3 px-3 text-on-surface-variant max-w-[280px] truncate">
                    {log.resource}
                  </td>
                  <td className="py-3 px-3 text-outline">{log.latency}</td>
                  <td className="py-3 px-3 text-right">
                    {log.status === "success" ? (
                      <span className="text-tertiary font-bold font-sans">✓ OK</span>
                    ) : (
                      <span className="text-error font-bold font-sans">✕ FAIL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
