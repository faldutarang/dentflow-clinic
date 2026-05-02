import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3", className)}
      data-ocid="loading.loading_state"
    >
      <div
        className={cn(
          "rounded-full border-2 border-primary/30 border-t-primary animate-spin",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-6 w-6",
          size === "lg" && "h-8 w-8",
        )}
        aria-hidden="true"
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div
      className="flex-1 flex items-center justify-center min-h-[300px]"
      data-ocid="page.loading_state"
    >
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  );
}
