import { cn } from "@/lib/utils";
import type React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?:
    | "admin"
    | "doctor"
    | "receptionist"
    | "success"
    | "warning"
    | "destructive"
    | "default";
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  accent,
  interactive,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "bg-card border border-border rounded-xl relative overflow-hidden",
        interactive && "interactive-card cursor-pointer",
        accent === "admin" && "border-l-4 border-l-[oklch(0.74_0.16_78)]",
        accent === "doctor" && "border-l-4 border-l-[oklch(0.62_0.18_200)]",
        accent === "receptionist" &&
          "border-l-4 border-l-[oklch(0.65_0.17_155)]",
        accent === "success" && "border-l-4 border-l-[oklch(0.65_0.17_155)]",
        accent === "warning" && "border-l-4 border-l-[oklch(0.74_0.16_78)]",
        accent === "destructive" && "border-l-4 border-l-[oklch(0.58_0.22_25)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 pt-5 pb-3", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-base font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
}

export function CardBody({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "px-5 py-3 border-t border-border flex items-center gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

// Stat card specifically for dashboard metrics
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  accent?: CardProps["accent"];
}

export function StatCard({ label, value, trend, icon, accent }: StatCardProps) {
  return (
    <Card accent={accent} className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-display font-bold text-foreground truncate">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "text-xs mt-1",
                trend.positive
                  ? "text-[oklch(0.65_0.17_155)]"
                  : "text-destructive",
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
