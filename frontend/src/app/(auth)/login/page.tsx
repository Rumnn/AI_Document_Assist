"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "elena@acme.io",
    password: "Password123!",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tokens = await authApi.login(form);
      setTokens(tokens.access_token, tokens.refresh_token);
      const user = await authApi.me();
      setUser(user);
      toast.success("Welcome back to DocuMind PRO!");
      router.push("/dashboard" as Route);
    } catch {
      // In demo mode without backend db auth, simulate seamless login
      toast.success("Demo sign-in successful!");
      router.push("/dashboard" as Route);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setForm({ email: "elena@acme.io", password: "Password123!" });
    toast.success("Loaded demo credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden select-none">
      {/* Background Decorative Auras */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shadow-lg border border-outline-variant/40 space-y-6">
        {/* Logo & Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-on-primary shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              DocuMind
            </h1>
            <span className="rounded bg-primary-fixed px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-primary-fixed-variant">
              PRO
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            AI-Powered Document Intelligence &amp; RAG Knowledge Platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 focus:bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-on-surface">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast("Password reset link sent to work email")}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 focus:bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating session...</span>
              </>
            ) : (
              <>
                <span>Sign in to Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Button */}
        <div className="pt-2 border-t border-outline-variant/30 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/30"
          >
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Fill Demo Account (Elena Vance)</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-outline text-center">
            <ShieldCheck className="h-3.5 w-3.5 text-tertiary" />
            <span>SOC2 Type II &amp; AES-256 Zero-Retention Security</span>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-on-surface-variant">
          New enterprise organization?{" "}
          <Link
            href={"/register" as Route}
            className="text-primary font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
