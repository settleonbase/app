// src/components/ui/badge.tsx
import * as React from "react";
import { cn } from "../../lib/utils";

type BadgeVariant = "default" | "secondary" | "outline";

const base =
  "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold transition-colors";
const styles: Record<BadgeVariant, string> = {
  default:
    "bg-slate-900 text-white border-slate-900",
  secondary:
    "bg-transparent text-current border-current/60",
  outline:
    "bg-transparent text-slate-700 border-slate-300",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div className={cn(base, styles[variant], className)} {...props} />
  );
}