import { cn } from "@/lib/utils";
import type React from "react";

interface BadgeProps {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "admin"
    | "doctor"
    | "receptionist";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  size = "sm",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        variant === "default" && "bg-primary/15 text-primary border-primary/30",
        variant === "outline" && "bg-transparent text-foreground border-border",
        variant === "secondary" &&
          "bg-muted text-muted-foreground border-border",
        variant === "admin" &&
          "bg-role-admin text-[oklch(0.74_0.16_78)] border-role-admin",
        variant === "doctor" &&
          "bg-role-doctor text-[oklch(0.62_0.18_200)] border-role-doctor",
        variant === "receptionist" &&
          "bg-role-receptionist text-[oklch(0.65_0.17_155)] border-role-receptionist",
        className,
      )}
    >
      {children}
    </span>
  );
}
