import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, U as Users, a as Package, b as UserCheck, I as InvoiceStatus, P as PageLoader, R as Receipt, T as TreatmentStatus, S as Stethoscope, l as StaffRole } from "./index-CRusxQeF.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { S as StatCard } from "./Card-BlkLkm0G.js";
import { u as useInvoices } from "./useBilling-Cm7xg-nE.js";
import { b as useInventoryItems, u as useLowStockAlerts, a as useExpiryAlerts } from "./useInventory-BxF-BI43.js";
import { u as usePatients } from "./usePatients-1jxdmde2.js";
import { u as useStaffMembers } from "./useStaff-B8FY4OEx.js";
import { u as useTreatments } from "./useTreatments-DFHhDLzf.js";
import { T as TrendingUp } from "./trending-up-BFYEtP5l.js";
import "./useMutation-C_my6RdQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M17 14h-6", key: "bkmgh3" }],
  ["path", { d: "M13 18H7", key: "bb0bb7" }],
  ["path", { d: "M7 14h.01", key: "1qa3f1" }],
  ["path", { d: "M17 18h.01", key: "1bdyru" }]
];
const CalendarRange = createLucideIcon("calendar-range", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10", key: "1xfpm4" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4", key: "be30l9" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14", key: "1r4le6" }]
];
const ChartNoAxesColumn = createLucideIcon("chart-no-axes-column", __iconNode);
function BarChart({
  data
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: data.map((item) => {
    const pct = item.value / max * 100;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: item.value })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-700",
          style: { width: `${pct}%`, backgroundColor: item.color }
        }
      ) })
    ] }, item.label);
  }) });
}
function DonutChart({
  segments
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-32 text-xs text-muted-foreground", children: "No data" });
  }
  const R = 48;
  const cx = 60;
  const cy = 60;
  const strokeWidth = 18;
  let offset = 0;
  const circumference = 2 * Math.PI * R;
  const arcs = segments.map((seg) => {
    const dash = seg.value / total * circumference;
    const arc = { ...seg, dash, offset };
    offset += dash;
    return arc;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "120", height: "120", viewBox: "0 0 120 120", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx,
          cy,
          r: R,
          fill: "none",
          stroke: "oklch(0.25 0.025 265)",
          strokeWidth
        }
      ),
      arcs.map((arc) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx,
          cy,
          r: R,
          fill: "none",
          stroke: arc.color,
          strokeWidth,
          strokeDasharray: `${arc.dash} ${circumference - arc.dash}`,
          strokeDashoffset: -arc.offset,
          strokeLinecap: "butt",
          transform: `rotate(-90 ${cx} ${cy})`
        },
        arc.label
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: cx,
          y: cy - 4,
          textAnchor: "middle",
          className: "text-foreground",
          style: {
            fontSize: 18,
            fontWeight: 700,
            fill: "oklch(0.93 0.01 265)"
          },
          children: total
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: cx,
          y: cy + 12,
          textAnchor: "middle",
          style: { fontSize: 9, fill: "oklch(0.58 0.04 265)" },
          children: "total"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 min-w-0", children: segments.map((seg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "h-2 w-2 rounded-sm shrink-0",
          style: { backgroundColor: seg.color }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: seg.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground ml-auto pl-2", children: seg.value })
    ] }, seg.label)) })
  ] });
}
const REPORT_TABS = [
  {
    id: "revenue",
    label: "Revenue",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" })
  },
  { id: "patients", label: "Patients", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }) },
  {
    id: "inventory",
    label: "Inventory",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" })
  },
  { id: "staff", label: "Staff", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-4 w-4" }) }
];
function RevenueReport({ from, to }) {
  const { data: invoices = [], isLoading } = useInvoices();
  const filtered = invoices.filter((inv) => {
    const d = new Date(Number(inv.created_at / 1000000n));
    return (!from || d >= new Date(from)) && (!to || d <= /* @__PURE__ */ new Date(`${to}T23:59:59`));
  });
  const paidInvoices = filtered.filter((i) => i.status === InvoiceStatus.paid);
  const totalRevenue = paidInvoices.reduce((s, i) => s + i.total, 0);
  const gstCollected = paidInvoices.reduce((s, i) => s + i.gst_total, 0);
  const statusData = [
    {
      label: "Draft",
      value: filtered.filter((i) => i.status === "draft").length,
      color: "oklch(0.58 0.04 265)"
    },
    {
      label: "Issued",
      value: filtered.filter((i) => i.status === "issued").length,
      color: "oklch(0.62 0.18 200)"
    },
    {
      label: "Partially Paid",
      value: filtered.filter((i) => i.status === "partiallyPaid").length,
      color: "oklch(0.74 0.16 78)"
    },
    {
      label: "Paid",
      value: filtered.filter((i) => i.status === "paid").length,
      color: "oklch(0.65 0.17 155)"
    },
    {
      label: "Cancelled",
      value: filtered.filter((i) => i.status === "cancelled").length,
      color: "oklch(0.58 0.22 25)"
    }
  ];
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "reports.revenue.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Revenue",
          value: `₹${totalRevenue.toLocaleString("en-IN")}`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }),
          accent: "admin"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "GST Collected",
          value: `₹${gstCollected.toLocaleString("en-IN")}`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }),
          accent: "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Invoices",
          value: filtered.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }),
          accent: "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Paid Invoices",
          value: paidInvoices.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }),
          accent: "success"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-4", children: "Invoice Status Breakdown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DonutChart, { segments: statusData.filter((s) => s.value > 0) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-4", children: "Invoice Distribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart, { data: statusData })
      ] })
    ] })
  ] });
}
function PatientReport() {
  const { data: patients = [], isLoading: pLoad } = usePatients();
  const { data: treatments = [], isLoading: tLoad } = useTreatments();
  if (pLoad || tLoad) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const treatmentsByPatient = treatments.reduce(
    (acc, t) => {
      const key = t.patient_id.toString();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {}
  );
  const avgTreatments = patients.length > 0 ? (treatments.length / patients.length).toFixed(1) : "0";
  const statusData = [
    {
      label: "Active",
      value: treatments.filter((t) => t.status === TreatmentStatus.active).length,
      color: "oklch(0.62 0.18 200)"
    },
    {
      label: "Completed",
      value: treatments.filter((t) => t.status === TreatmentStatus.completed).length,
      color: "oklch(0.65 0.17 155)"
    },
    {
      label: "Cancelled",
      value: treatments.filter((t) => t.status === TreatmentStatus.cancelled).length,
      color: "oklch(0.58 0.22 25)"
    }
  ];
  const patientsWithMost = Object.entries(treatmentsByPatient).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "reports.patients.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Registered",
          value: patients.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
          accent: "doctor"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Treatments",
          value: treatments.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5" }),
          accent: "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Avg. Treatments/Patient",
          value: avgTreatments,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "h-5 w-5" }),
          accent: "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Active Treatments",
          value: statusData[0].value,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5" }),
          accent: "success"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-4", children: "Treatment Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DonutChart, { segments: statusData.filter((s) => s.value > 0) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-4", children: "Top Patients by Treatment Count" }),
        patientsWithMost.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No treatments recorded yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          BarChart,
          {
            data: patientsWithMost.map(([id, count], i) => ({
              label: `Patient #${id}`,
              value: count,
              color: [
                "oklch(0.62 0.18 200)",
                "oklch(0.65 0.17 155)",
                "oklch(0.74 0.16 78)",
                "oklch(0.56 0.15 105)",
                "oklch(0.58 0.04 265)"
              ][i % 5]
            }))
          }
        )
      ] })
    ] })
  ] });
}
function InventoryReport() {
  const { data: items = [], isLoading } = useInventoryItems();
  const { data: lowStock = [] } = useLowStockAlerts();
  const { data: expiryRisk = [] } = useExpiryAlerts(30);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const totalValue = items.reduce((s, i) => s + i.cost_price * i.stock, 0);
  const categoryMap = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.stock;
    return acc;
  }, {});
  const colors = [
    "oklch(0.62 0.18 200)",
    "oklch(0.65 0.17 155)",
    "oklch(0.74 0.16 78)",
    "oklch(0.56 0.15 105)",
    "oklch(0.58 0.22 25)"
  ];
  const categoryData = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value], i) => ({
    label,
    value,
    color: colors[i % colors.length]
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "reports.inventory.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Items",
          value: items.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
          accent: "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Low Stock Items",
          value: lowStock.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
          accent: lowStock.length > 0 ? "destructive" : "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Expiry Risk (30d)",
          value: expiryRisk.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
          accent: expiryRisk.length > 0 ? "warning" : "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Stock Value",
          value: `₹${totalValue.toLocaleString("en-IN")}`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }),
          accent: "admin"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-4", children: "Stock by Category" }),
        categoryData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No inventory items yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart, { data: categoryData })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-4", children: "Low Stock Items" }),
        lowStock.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All stock levels are healthy." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: lowStock.slice(0, 6).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between py-1.5 border-b border-border last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.category })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-destructive shrink-0 ml-4", children: [
                item.stock,
                " ",
                item.unit
              ] })
            ]
          },
          item.id.toString()
        )) })
      ] })
    ] })
  ] });
}
function StaffReport() {
  const { data: staff = [], isLoading } = useStaffMembers();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const activeStaff = staff.filter((s) => s.is_active).length;
  const byRole = [
    {
      label: "Doctors",
      value: staff.filter((s) => s.role === StaffRole.doctor).length,
      color: "oklch(0.62 0.18 200)"
    },
    {
      label: "Admin",
      value: staff.filter((s) => s.role === StaffRole.admin).length,
      color: "oklch(0.74 0.16 78)"
    },
    {
      label: "Receptionist",
      value: staff.filter((s) => s.role === StaffRole.receptionist).length,
      color: "oklch(0.65 0.17 155)"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "reports.staff.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Staff",
          value: staff.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
          accent: "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Active Staff",
          value: activeStaff,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-5 w-5" }),
          accent: "receptionist"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Doctors",
          value: byRole[0].value,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5" }),
          accent: "doctor"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Admin / Reception",
          value: byRole[1].value + byRole[2].value,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-5 w-5" }),
          accent: "admin"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-4", children: "Staff by Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DonutChart, { segments: byRole.filter((s) => s.value > 0) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-4", children: "Staff Members" }),
        staff.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No staff members registered." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: staff.slice(0, 6).map((member) => {
          var _a, _b;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between py-1.5 border-b border-border last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: member.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: member.email })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold capitalize px-2 py-0.5 rounded-full shrink-0 ml-4",
                    style: {
                      color: ((_a = byRole.find(
                        (r) => r.label.toLowerCase().includes(member.role)
                      )) == null ? void 0 : _a.color) ?? "oklch(0.65 0.17 155)",
                      backgroundColor: `${((_b = byRole.find((r) => r.label.toLowerCase().includes(member.role))) == null ? void 0 : _b.color) ?? "oklch(0.65 0.17 155)"}1a`
                    },
                    children: member.role
                  }
                )
              ]
            },
            member.id.toString()
          );
        }) })
      ] })
    ] })
  ] });
}
function ReportsPage() {
  const [activeTab, setActiveTab] = reactExports.useState("revenue");
  const [fromDate, setFromDate] = reactExports.useState("");
  const [toDate, setToDate] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "reports.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Reports & Analytics",
        description: "Clinic performance metrics and data insights"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-wrap gap-1 p-1 bg-card border border-border rounded-xl mb-6 w-fit",
        "data-ocid": "reports.type.tabs",
        children: REPORT_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab.id),
            "data-ocid": `reports.${tab.id}.tab`,
            className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`,
            children: [
              tab.icon,
              tab.label
            ]
          },
          tab.id
        ))
      }
    ),
    activeTab === "revenue" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-6 p-4 bg-card border border-border rounded-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date Range:" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "sr-only", htmlFor: "reports-from-date", children: "From date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "reports-from-date",
          type: "date",
          value: fromDate,
          onChange: (e) => setFromDate(e.target.value),
          "data-ocid": "reports.from_date.input",
          className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "to" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "sr-only", htmlFor: "reports-to-date", children: "To date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "reports-to-date",
          type: "date",
          value: toDate,
          onChange: (e) => setToDate(e.target.value),
          "data-ocid": "reports.to_date.input",
          className: "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        }
      ),
      (fromDate || toDate) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setFromDate("");
            setToDate("");
          },
          "data-ocid": "reports.clear_dates.button",
          className: "text-xs text-muted-foreground hover:text-foreground underline",
          children: "Clear"
        }
      )
    ] }),
    activeTab === "revenue" && /* @__PURE__ */ jsxRuntimeExports.jsx(RevenueReport, { from: fromDate, to: toDate }),
    activeTab === "patients" && /* @__PURE__ */ jsxRuntimeExports.jsx(PatientReport, {}),
    activeTab === "inventory" && /* @__PURE__ */ jsxRuntimeExports.jsx(InventoryReport, {}),
    activeTab === "staff" && /* @__PURE__ */ jsxRuntimeExports.jsx(StaffReport, {})
  ] });
}
export {
  ReportsPage as default
};
