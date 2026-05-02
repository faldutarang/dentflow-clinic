import { j as jsxRuntimeExports, i as cn } from "./index-CRusxQeF.js";
function Card({
  children,
  className,
  accent,
  interactive,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick,
      onKeyDown: onClick ? (e) => e.key === "Enter" && onClick() : void 0,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      className: cn(
        "bg-card border border-border rounded-xl relative overflow-hidden",
        interactive && "interactive-card cursor-pointer",
        accent === "admin" && "border-l-4 border-l-[oklch(0.74_0.16_78)]",
        accent === "doctor" && "border-l-4 border-l-[oklch(0.62_0.18_200)]",
        accent === "receptionist" && "border-l-4 border-l-[oklch(0.65_0.17_155)]",
        accent === "success" && "border-l-4 border-l-[oklch(0.65_0.17_155)]",
        accent === "warning" && "border-l-4 border-l-[oklch(0.74_0.16_78)]",
        accent === "destructive" && "border-l-4 border-l-[oklch(0.58_0.22_25)]",
        className
      ),
      children
    }
  );
}
function CardHeader({
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("px-5 pt-5 pb-3", className), children });
}
function CardTitle({
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: cn("text-base font-semibold text-foreground", className), children });
}
function CardBody({
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("px-5 pb-5", className), children });
}
function StatCard({ label, value, trend, icon, accent }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { accent, className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground truncate", children: value }),
      trend && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          className: cn(
            "text-xs mt-1",
            trend.positive ? "text-[oklch(0.65_0.17_155)]" : "text-destructive"
          ),
          children: [
            trend.positive ? "↑" : "↓",
            " ",
            trend.value
          ]
        }
      )
    ] }),
    icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0", children: icon })
  ] }) });
}
export {
  Card as C,
  StatCard as S,
  CardHeader as a,
  CardTitle as b,
  CardBody as c
};
