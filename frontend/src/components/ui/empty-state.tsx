import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant p-12 text-center bg-surface-container-low/40",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant">
        {icon || <FolderOpen className="h-7 w-7 text-outline" />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-on-surface">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-on-surface-variant">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} variant="primary" size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
