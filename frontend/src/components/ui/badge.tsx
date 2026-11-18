import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-on-primary",
        primary:
          "bg-primary-fixed text-on-primary-fixed-variant",
        secondary:
          "bg-surface-container text-on-surface",
        success:
          "bg-tertiary-fixed text-on-tertiary-fixed",
        warning:
          "bg-amber-100 text-amber-800",
        error:
          "bg-error-container text-on-error-container",
        outline:
          "border border-outline-variant text-on-surface-variant bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
