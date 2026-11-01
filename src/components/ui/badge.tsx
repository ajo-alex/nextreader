import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "free" | "rental" | "exchange" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-cream-dark text-charcoal border-surfaceBorder",
    free: "bg-sage text-forest-dark border-transparent font-medium",
    rental: "bg-accentOrange-light text-[#A85A14] border-transparent font-medium",
    exchange: "bg-[#E8EEF5] text-[#1E3A5F] border-transparent font-medium",
    success: "bg-[#E3F2E6] text-[#1B5E20] border-transparent font-medium",
    warning: "bg-[#FFF4E5] text-[#B76E00] border-transparent font-medium",
    destructive: "bg-[#FDE8E8] text-[#9B1C1C] border-transparent font-medium",
    outline: "bg-transparent text-charcoal border-surfaceBorder",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-wide uppercase transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
