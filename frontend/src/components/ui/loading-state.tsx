import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  compact?: boolean;
}

export function LoadingState({
  message = "Loading data...",
  className,
  compact = false,
}: LoadingStateProps) {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-on-surface-variant", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="mt-3 text-sm font-medium text-on-surface-variant">{message}</p>
    </div>
  );
}
