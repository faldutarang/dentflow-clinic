import { j as jsxRuntimeExports, i as cn } from "./index-CRusxQeF.js";
function Table({
  columns,
  data,
  keyExtractor,
  className,
  emptyMessage = "No data found",
  stickyHeader
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "w-full overflow-auto rounded-lg border border-border",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "thead",
          {
            className: cn(
              "bg-card border-b border-border",
              stickyHeader && "sticky top-0 z-10"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: cn(
                  "px-4 py-3 font-medium text-muted-foreground whitespace-nowrap",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  !col.align && "text-left",
                  col.className
                ),
                children: col.header
              },
              col.key
            )) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: columns.length,
            className: "px-4 py-10 text-center text-muted-foreground",
            children: emptyMessage
          }
        ) }) : data.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "tr",
          {
            className: "table-row-stripe border-b border-border/50 hover:bg-muted/10 transition-colors",
            children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: cn(
                  "px-4 py-3 text-foreground",
                  col.align === "right" && "text-right tabular-nums",
                  col.align === "center" && "text-center",
                  col.className
                ),
                children: col.render ? col.render(row, i) : String(row[col.key] ?? "")
              },
              col.key
            ))
          },
          keyExtractor(row, i)
        )) })
      ] })
    }
  );
}
export {
  Table as T
};
