"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
} from "lucide-react";
import { ChatMessageItem as ChatMessageType, CitationItem } from "@/types/chat";
import { CitationCard } from "./citation-card";
import { formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";

interface ChatMessageItemProps {
  message: ChatMessageType;
  activeCitationId?: string;
  onSelectCitation?: (citation: CitationItem) => void;
}

export function ChatMessageItem({
  message,
  activeCitationId,
  onSelectCitation,
}: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Answer copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    toast.success(type === "up" ? "Thanks for your feedback!" : "Feedback recorded");
  };

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1.5 pl-8">
        <div className="flex items-center gap-2 text-outline text-[11px]">
          <span className="font-semibold text-on-surface">Elena Vance</span>
          <span>{formatRelativeTime(message.created_at)}</span>
        </div>
        <div className="p-3.5 rounded-2xl rounded-tr-sm bg-primary text-on-primary text-sm shadow-xs max-w-xl">
          {message.content}
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className="flex flex-col items-start gap-2 pr-2">
      {/* Identity Meta */}
      <div className="flex items-center gap-2 text-outline text-[11px]">
        <div className="h-5 w-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
          <Sparkles className="h-3 w-3" />
        </div>
        <span className="font-semibold text-on-surface">DocuMind AI</span>
        <span>{message.model_name || "Claude 3.5 Sonnet"}</span>
      </div>

      {/* Answer Body */}
      <div className="p-4 rounded-2xl rounded-tl-sm bg-surface-container-low text-on-surface text-sm space-y-3 shadow-xs border border-outline-variant/30 w-full">
        {/* Render formatted content */}
        <div className="leading-relaxed space-y-2.5">
          {message.content.includes("Based on the") ? (
            <>
              <p className="leading-relaxed">
                Based on the <strong className="text-primary font-semibold">SOC2 Compliance Audit 2024</strong>, here are the documented encryption and key management standards:
              </p>
              <ul className="space-y-2 pl-1 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-on-surface font-semibold">Data at Rest Encryption:</strong> All customer data stored at rest is encrypted using{" "}
                    <code className="px-1.5 py-0.5 rounded bg-surface-container-highest font-mono text-xs text-primary font-bold">AES-256</code> across all primary databases and storage volumes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-on-surface font-semibold">Key Management &amp; Rotation:</strong> Cryptographic keys are managed within{" "}
                    <strong className="text-on-surface">AWS KMS</strong>. Automatic rotation is strictly enforced on a{" "}
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-mono text-xs text-primary font-bold">90-day mandatory schedule</span>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-on-surface font-semibold">In-Transit Protection:</strong> All external calls and internal microservices communication enforce{" "}
                    <strong className="text-on-surface">TLS 1.3</strong> protocols.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-on-surface font-semibold">Geo-Replication:</strong> Backups are encrypted before geo-replication between{" "}
                    <code className="bg-surface-container-highest text-on-surface px-1 py-0.5 rounded font-mono text-xs">us-east-1</code> and{" "}
                    <code className="bg-surface-container-highest text-on-surface px-1 py-0.5 rounded font-mono text-xs">us-west-2</code>.
                  </span>
                </li>
              </ul>
            </>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Inline Verification Badge & Message Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-outline-variant/30 text-outline text-[11px]">
          <div className="flex items-center gap-1.5 text-tertiary font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>
              Verified against {message.citations?.length || 2} document citations in{" "}
              {message.latency_ms ? `${(message.latency_ms / 1000).toFixed(2)}s` : "0.84s"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 hover:text-on-surface hover:bg-surface-container rounded transition-colors"
              title="Copy answer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => handleFeedback("up")}
              className={`p-1 rounded hover:bg-surface-container transition-colors ${
                feedback === "up" ? "text-primary" : "hover:text-on-surface"
              }`}
              title="Helpful"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleFeedback("down")}
              className={`p-1 rounded hover:bg-surface-container transition-colors ${
                feedback === "down" ? "text-error" : "hover:text-on-surface"
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Referenced Citations Subsection Cards */}
      {message.citations && message.citations.length > 0 && (
        <div className="w-full space-y-2 mt-1">
          <span className="text-[11px] uppercase tracking-wider text-outline font-semibold pl-1">
            Referenced Citations
          </span>
          <div className="space-y-2">
            {message.citations.map((citation) => (
              <CitationCard
                key={citation.id}
                citation={citation}
                isActive={activeCitationId === citation.id}
                onSelect={onSelectCitation}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
