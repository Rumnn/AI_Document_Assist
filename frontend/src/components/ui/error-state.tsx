import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Failed to load data from the server. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-error-container bg-error-container/20 p-8 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error-container text-on-error-container">
        <AlertCircle className="h-6 w-6 text-error" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-error">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-on-surface-variant">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="gap-2 border-outline-variant hover:border-error hover:text-error"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </div>
      )}
    </div>
  );
}
