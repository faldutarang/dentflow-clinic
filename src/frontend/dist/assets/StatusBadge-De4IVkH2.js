import { j as jsxRuntimeExports, i as cn } from "./index-CRusxQeF.js";
const STATUS_MAP = {
  active: { label: "Active", className: "badge-approved" },
  completed: { label: "Completed", className: "badge-completed" },
  cancelled: { label: "Cancelled", className: "badge-rejected" },
  paid: { label: "Paid", className: "badge-completed" },
  issued: { label: "Issued", className: "badge-approved" },
  partiallyPaid: { label: "Partial", className: "badge-pending" },
  draft: {
    label: "Draft",
    className: "bg-muted/50 text-muted-foreground border border-border"
  },
  pending: { label: "Pending", className: "badge-pending" },
  inProgress: { label: "In Progress", className: "badge-approved" },
  present: { label: "Present", className: "badge-completed" },
  absent: { label: "Absent", className: "badge-rejected" },
  halfDay: { label: "Half Day", className: "badge-pending" },
  healthy: { label: "Healthy", className: "badge-completed" },
  decayed: { label: "Decayed", className: "badge-rejected" },
  filled: { label: "Filled", className: "badge-approved" },
  crowned: { label: "Crowned", className: "badge-approved" },
  extracted: { label: "Extracted", className: "badge-rejected" },
  missing: {
    label: "Missing",
    className: "bg-muted/50 text-muted-foreground border border-border"
  },
  implant: { label: "Implant", className: "badge-approved" },
  planned: { label: "Planned", className: "badge-pending" }
};
function StatusBadge({ status, className }) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    className: "badge-pending"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      ),
      children: config.label
    }
  );
}
export {
  StatusBadge as S
};
