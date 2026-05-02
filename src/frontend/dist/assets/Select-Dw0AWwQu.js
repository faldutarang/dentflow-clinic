import { c as createLucideIcon, v as React, j as jsxRuntimeExports, i as cn, r as reactExports, w as reactDomExports } from "./index-CRusxQeF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const Input = React.forwardRef(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? (label == null ? void 0 : label.toLowerCase().replace(/\s+/g, "-"));
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: inputId,
          className: "text-sm font-medium text-foreground",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref,
          id: inputId,
          className: cn(
            "flex h-9 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            error && "border-destructive focus:ring-destructive",
            className
          ),
          ...props
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error }),
      hint && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: hint })
    ] });
  }
);
Input.displayName = "Input";
function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer
}) {
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "dialog",
      {
        open: true,
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 m-0 max-w-none max-h-none w-full h-full bg-transparent",
        "aria-labelledby": "modal-title",
        "data-ocid": "modal.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-background/80 backdrop-blur-sm",
              onClick: onClose,
              onKeyDown: (e) => e.key === "Enter" && onClose(),
              "aria-hidden": "true",
              role: "presentation"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "relative bg-card border border-border rounded-xl shadow-xl flex flex-col max-h-[90vh] w-full",
                size === "sm" && "max-w-sm",
                size === "md" && "max-w-lg",
                size === "lg" && "max-w-2xl",
                size === "xl" && "max-w-4xl"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-5 border-b border-border shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        id: "modal-title",
                        className: "text-base font-semibold text-foreground",
                        children: title
                      }
                    ),
                    description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      "data-ocid": "modal.close_button",
                      className: "ml-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      "aria-label": "Close modal",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-5", children }),
                footer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex items-center justify-end gap-2 p-4 border-t border-border", children: footer })
              ]
            }
          )
        ]
      }
    ),
    document.body
  );
}
const Select = React.forwardRef(
  ({ label, error, options, placeholder, className, id, onChange, ...props }, ref) => {
    const selectId = id ?? (label == null ? void 0 : label.toLowerCase().replace(/\s+/g, "-"));
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: selectId,
          className: "text-sm font-medium text-foreground",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            ref,
            id: selectId,
            onChange: onChange ? (e) => onChange(e.target.value) : void 0,
            className: cn(
              "flex h-9 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
              error && "border-destructive",
              className
            ),
            ...props,
            children: [
              placeholder && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: placeholder }),
              options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
    ] });
  }
);
Select.displayName = "Select";
export {
  Input as I,
  Modal as M,
  Select as S,
  X
};
