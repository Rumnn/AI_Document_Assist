"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  BookOpen,
  Globe,
  ArrowUp,
  Loader2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

const SUGGESTIONS = [
  "Compare with MSA terms",
  "Draft compliance summary",
  "Show key custodians",
  "Summarize key cryptographic controls",
];

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (!content.trim() || isLoading) return;
    onSendMessage(content.trim());
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setContent(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex-none bg-surface-container-lowest border-t border-outline-variant/30">
      {/* 1. Quick Action Pill Prompts */}
      <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto bg-surface-container-low scrollbar-none border-b border-outline-variant/20">
        <span className="text-[11px] text-outline font-medium flex-shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>Suggestions:</span>
        </span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface text-[11px] whitespace-nowrap transition-colors shadow-2xs border border-outline-variant/30"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* 2. Fixed Chat Input Box */}
      <div className="p-4">
        <div className="p-3 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-outline-variant/40">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Ask a follow-up question or cite another section... (Enter ↵ to send)"
            className="w-full bg-transparent text-on-surface placeholder:text-outline text-xs sm:text-sm resize-none focus:outline-none max-h-36"
          />

          <div className="mt-2 flex items-center justify-between pt-1 border-t border-outline-variant/20">
            {/* Left Tools */}
            <div className="flex items-center gap-1 text-on-surface-variant">
              <button
                type="button"
                onClick={() => toast.success("Document attached to session")}
                className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors"
                title="Attach document"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toast.success("Prompt templates opened")}
                className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors"
                title="Prompt templates"
              >
                <BookOpen className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toast.success("Web search enabled for this turn")}
                className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors"
                title="Search web sources"
              >
                <Globe className="h-4 w-4" />
              </button>

              <div className="h-4 w-px bg-outline-variant/50 mx-1" />

              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-[11px] font-medium text-on-surface">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
                <span>RAG Active</span>
              </div>
            </div>

            {/* Right Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!content.trim() || isLoading}
              className="h-8 w-8 rounded-lg bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs"
              title="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
