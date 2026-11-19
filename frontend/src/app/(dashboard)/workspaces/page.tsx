"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Plus,
  HardDrive,
  FileText,
  ShieldCheck,
  MoreVertical,
  Mail,
  UserPlus,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_WORKSPACES, MOCK_WORKSPACE_MEMBERS } from "@/lib/mock/data";
import { formatBytes, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [activeWsId, setActiveWsId] = useState(MOCK_WORKSPACES[0].id);
  const [members, setMembers] = useState(MOCK_WORKSPACE_MEMBERS);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const currentWs = workspaces.find((w) => w.id === activeWsId) || workspaces[0];

  const handleCreateWorkspace = () => {
    const name = prompt("Enter new workspace name:");
    if (name && name.trim()) {
      const newWs = {
        id: `ws-${Date.now()}`,
        name: name.trim(),
        owner_id: "usr-01",
        created_at: new Date().toISOString(),
        member_count: 1,
        doc_count: 0,
        storage_bytes: 0,
      };
      setWorkspaces((prev) => [...prev, newWs]);
      setActiveWsId(newWs.id);
      toast.success(`Workspace "${name.trim()}" created!`);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember = {
      id: `wm-${Date.now()}`,
      workspace_id: activeWsId,
      user_id: `usr-${Date.now()}`,
      role: inviteRole as "admin" | "member" | "viewer",
      user_name: inviteEmail.split("@")[0],
      user_email: inviteEmail.trim(),
      joined_at: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setIsInviteOpen(false);
    toast.success(`Invitation sent to ${newMember.user_email}`);
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Remove ${name} from this workspace?`)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success(`Removed ${name}`);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] w-full p-6 md:p-8 space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Tenant &amp; Access Controls
            </span>
            <span className="text-outline">•</span>
            <span className="text-primary font-semibold flex items-center gap-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
              Multi-Tenant Isolation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Workspace Management
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Configure isolated team domains, storage partitions, and member RBAC roles.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleCreateWorkspace}
          className="gap-1.5 font-semibold text-xs shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Workspace</span>
        </Button>
      </div>

      {/* 2. Workspace Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWsId;
          const bytes = ws.storage_bytes || 0;
          const storageGB = (bytes / 1024 / 1024 / 1024).toFixed(1);
          const percentUsed = Math.min(Math.round((bytes / 10737418240) * 100), 100);

          return (
            <div
              key={ws.id}
              onClick={() => {
                setActiveWsId(ws.id);
                toast.success(`Switched to ${ws.name}`);
              }}
              className={`p-5 rounded-xl cursor-pointer transition-all border relative flex flex-col justify-between ${
                isActive
                  ? "bg-surface-container-lowest border-primary ring-2 ring-primary/20 shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant/50 hover:border-outline-variant/80 hover:shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        isActive
                          ? "bg-primary text-on-primary"
                          : "bg-primary-fixed text-on-primary-fixed-variant"
                      }`}
                    >
                      {ws.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-on-surface leading-tight">
                        {ws.name}
                      </h3>
                      <span className="text-[11px] text-outline">
                        Created {formatDate(ws.created_at)}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold text-[10px]">
                      Current
                    </span>
                  )}
                </div>

                {/* Storage & Quota */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant flex items-center gap-1 text-[11px]">
                      <HardDrive className="h-3.5 w-3.5 text-outline" />
                      Storage Used
                    </span>
                    <span className="font-mono font-semibold text-on-surface text-[11px]">
                      {storageGB} GB / 10 GB
                    </span>
                  </div>
                  <Progress value={percentUsed} className="h-1.5 bg-surface-container" indicatorClassName="bg-primary" />
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant font-medium">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  {ws.doc_count} documents
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-secondary" />
                  {ws.member_count} members
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Active Workspace Detailed Settings & Team Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Team Directory (8 cols) */}
        <div className="lg:col-span-8 rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
            <div>
              <h2 className="text-base font-bold text-on-surface">
                Team Members ({members.length})
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Manage roles and access permissions for {currentWs.name}.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInviteOpen(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite Member</span>
            </Button>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Access Level</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          {member.avatar_url ? (
                            <AvatarImage src={member.avatar_url} alt={member.user_name} />
                          ) : null}
                          <AvatarFallback className="bg-primary-fixed text-primary font-bold text-xs">
                            {member.user_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-on-surface">{member.user_name}</p>
                          <p className="text-[11px] text-outline">{member.user_email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          member.role === "owner"
                            ? "bg-primary text-on-primary"
                            : member.role === "admin"
                            ? "bg-primary-fixed text-on-primary-fixed-variant"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-on-surface-variant font-medium text-[11px]">
                      {member.role === "owner"
                        ? "Full Admin & Billing"
                        : member.role === "admin"
                        ? "Read, Write, Ingest"
                        : "Query & Read-Only"}
                    </td>

                    <td className="py-3 px-3 text-outline">
                      {formatDate(member.joined_at)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {member.role !== "owner" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id, member.user_name)}
                          className="text-xs text-error hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Security Baseline Specs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/50 space-y-4">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-tertiary" />
              <span>Workspace Security Baseline</span>
            </h3>

            <div className="divide-y divide-surface-container text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-on-surface-variant">Storage Isolation</span>
                <span className="font-semibold text-on-surface">MinIO Dedicated Prefix</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-on-surface-variant">Vector Partition</span>
                <span className="font-mono text-[11px] text-primary">qdrant_ns_{currentWs.id}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-on-surface-variant">KMS Key Envelope</span>
                <span className="font-semibold text-tertiary">AES-256-GCM Active</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-on-surface-variant">Audit Ledger Sync</span>
                <span className="font-semibold text-on-surface">SOC2 Immutable Log</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant/50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">
                Invite Colleague to {currentWs.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-outline hover:text-on-surface text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@acme.io"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="admin">Admin (Can upload docs &amp; manage settings)</option>
                  <option value="member">Member (Can ask AI &amp; view docs)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
