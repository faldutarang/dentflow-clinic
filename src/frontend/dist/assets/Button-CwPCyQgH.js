import { j as jsxRuntimeExports, g as LoaderCircle, i as cn } from "./index-CRusxQeF.js";
function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      disabled: disabled || loading,
      className: cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" && "h-7 px-3 text-xs gap-1.5",
        size === "md" && "h-9 px-4 text-sm gap-2",
        size === "lg" && "h-11 px-6 text-base gap-2",
        size === "icon" && "h-9 w-9",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "ghost" && "bg-transparent text-foreground hover:bg-muted",
        variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        variant === "outline" && "border border-border bg-transparent text-foreground hover:bg-muted",
        className
      ),
      ...props,
      children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        children
      ]
    }
  );
}
export {
  Button as B
};
