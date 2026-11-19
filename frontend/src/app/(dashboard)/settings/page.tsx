"use client";

import React, { useState } from "react";
import {
  User,
  Cpu,
  Key,
  ShieldCheck,
  Save,
  Copy,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Sliders,
  Database,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_USER } from "@/lib/mock/data";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "rag" | "api" | "security">("profile");
  const [userProfile, setUserProfile] = useState(MOCK_USER);

  // RAG Settings
  const [defaultModel, setDefaultModel] = useState("claude-3.5-sonnet");
  const [similarityThreshold, setSimilarityThreshold] = useState(75);
  const [topK, setTopK] = useState(5);
  const [enableHybridSearch, setEnableHybridSearch] = useState(true);

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key-01",
      name: "Production Ingestion Pipeline",
      prefix: "aid_live_9f82...",
      created_at: "2024-08-15",
      last_used: "12 mins ago",
    },
    {
      id: "key-02",
      name: "Slack Copilot Bot",
      prefix: "aid_live_3b11...",
      created_at: "2024-09-01",
      last_used: "2 days ago",
    },
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile changes saved successfully!");
  };

  const handleSaveRagSettings = () => {
    toast.success("AI & RAG Engine parameters updated!");
  };

  const handleGenerateKey = () => {
    const keyName = prompt("Enter a label for the new API key:");
    if (keyName && keyName.trim()) {
      const newKey = {
        id: `key-${Date.now()}`,
        name: keyName.trim(),
        prefix: `aid_live_${Math.random().toString(36).substring(2, 6)}...`,
        created_at: "Just now",
        last_used: "Never",
      };
      setApiKeys((prev) => [newKey, ...prev]);
      toast.success(`Generated API Key: ${newKey.name}`);
    }
  };

  const handleRevokeKey = (id: string, name: string) => {
    if (confirm(`Revoke key "${name}"? This action cannot be undone.`)) {
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success(`Revoked ${name}`);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] w-full p-6 md:p-8 space-y-6">
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
          <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
            System Preferences / Control
          </span>
          <span className="text-outline">•</span>
          <span className="text-primary font-semibold flex items-center gap-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
            Enterprise Policy Validated
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
          Platform Settings
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Configure profile accounts, AI retrieval thresholds, API tokens, and compliance security.
        </p>
      </div>

      {/* 2. Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
            activeTab === "profile"
              ? "bg-primary-fixed text-on-primary-fixed-variant shadow-xs"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile &amp; Account</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rag")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
            activeTab === "rag"
              ? "bg-primary-fixed text-on-primary-fixed-variant shadow-xs"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>AI &amp; RAG Engine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("api")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
            activeTab === "api"
              ? "bg-primary-fixed text-on-primary-fixed-variant shadow-xs"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          }`}
        >
          <Key className="h-4 w-4" />
          <span>API Keys &amp; Tokens</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
            activeTab === "security"
              ? "bg-primary-fixed text-on-primary-fixed-variant shadow-xs"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Security &amp; Audit</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {/* TAB 1: Profile & Account */}
      {activeTab === "profile" && (
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50 max-w-2xl space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 shadow-xs border border-outline-variant/40">
              <AvatarImage src={userProfile.avatar_url || undefined} alt={userProfile.full_name} />
              <AvatarFallback className="bg-primary-fixed text-primary font-bold text-lg">
                {userProfile.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-bold text-on-surface">{userProfile.full_name}</h2>
              <p className="text-xs text-outline font-mono">{userProfile.email}</p>
              <button
                type="button"
                onClick={() => toast.success("Avatar upload modal opened")}
                className="mt-2 text-xs font-semibold text-primary hover:underline"
              >
                Change photo
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-outline-variant/30">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Full Name</label>
              <input
                type="text"
                value={userProfile.full_name}
                onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Work Email</label>
              <input
                type="email"
                disabled
                value={userProfile.email}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface-container-high text-on-surface-variant border border-outline-variant/40 cursor-not-allowed opacity-75"
              />
              <span className="text-[11px] text-outline mt-1 block">
                Managed via Acme Corp SSO Identity Provider.
              </span>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="sm" className="gap-1.5 shadow-xs">
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: AI & RAG Engine */}
      {activeTab === "rag" && (
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50 max-w-3xl space-y-6">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <span>RAG Knowledge Retrieval Parameters</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Tune similarity matching, chunk retrieval count, and synthesis LLM model defaults.
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Default LLM Model */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Default LLM Synthesis Model
              </label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full max-w-md px-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Recommended for RAG Reasoning)</option>
                <option value="gpt-4o">OpenAI GPT-4o (High Speed)</option>
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (2M Context Window)</option>
              </select>
            </div>

            {/* Embedding Model Specs */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
              <Database className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-on-surface text-xs">
                  Active Embedding Engine: BAAI/bge-m3
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Dense 1024-dimension vectors + ColBERT sparse lexical multi-vector representation hosted on isolated Qdrant vector cluster.
                </p>
              </div>
            </div>

            {/* Similarity Threshold Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-on-surface">
                  Minimum Cosine Similarity Score
                </label>
                <span className="font-mono font-bold text-primary">{similarityThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <span className="text-[11px] text-outline mt-1 block">
                Chunks below this relevance score will be pruned before prompt augmentation.
              </span>
            </div>

            {/* Top-K Chunks */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-on-surface">
                  Top-K Retrieved Chunks per Query
                </label>
                <span className="font-mono font-bold text-primary">{topK} chunks</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Hybrid Search Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-on-surface">Enable Hybrid Sparse + Dense Search</p>
                <p className="text-[11px] text-outline">Combines semantic vector embeddings with exact keyword BM25 retrieval.</p>
              </div>
              <input
                type="checkbox"
                checked={enableHybridSearch}
                onChange={(e) => setEnableHybridSearch(e.target.checked)}
                className="h-4 w-4 rounded accent-primary cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-outline-variant/30">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSaveRagSettings}
                className="gap-1.5 shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save RAG Configuration</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API Keys */}
      {activeTab === "api" && (
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
            <div>
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <span>API Tokens &amp; Webhooks</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Authenticate programmatically to upload files, query RAG vectors, and stream answers.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateKey}
              className="gap-1.5 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Generate New API Key</span>
            </Button>
          </div>

          {/* Keys Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Token Name</th>
                  <th className="py-2.5 px-3">Key Prefix</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3">Last Active</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-3 font-semibold text-on-surface">{key.name}</td>
                    <td className="py-3 px-3">
                      <code className="font-mono text-primary bg-surface-container px-2 py-0.5 rounded text-[11px]">
                        {key.prefix}
                      </code>
                    </td>
                    <td className="py-3 px-3 text-outline">{key.created_at}</td>
                    <td className="py-3 px-3 text-on-surface-variant font-medium">{key.last_used}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRevokeKey(key.id, key.name)}
                        className="text-error hover:underline font-semibold"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Security & Audit */}
      {activeTab === "security" && (
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50 max-w-3xl space-y-6">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-tertiary" />
              <span>Security Protocols &amp; Active Sessions</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              FIPS 140-2 Level 3 hardware security modules, session termination, and 2FA.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-on-surface">Two-Factor Authentication (2FA)</h4>
                <p className="text-[11px] text-outline mt-0.5">Enforced across all organization members via WebAuthn/FIDO2.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px]">
                Enforced
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-on-surface">Active Session: Chrome on Windows (192.168.1.42)</h4>
                <p className="text-[11px] text-outline mt-0.5">Current active browser session • Signed in 4 hours ago</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold text-[10px]">
                Current
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
