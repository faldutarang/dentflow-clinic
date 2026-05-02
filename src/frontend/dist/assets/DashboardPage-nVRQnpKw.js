import { c as createLucideIcon, j as jsxRuntimeExports, P as PageLoader, I as InvoiceStatus, U as Users, R as Receipt, a as Package, b as UserCheck, S as Stethoscope, F as FlaskConical, L as LabOrderStatus, T as TreatmentStatus } from "./index-CRusxQeF.js";
import { S as StatCard } from "./Card-BlkLkm0G.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
import { T as Table } from "./Table-ByTzrkVY.js";
import { u as useInvoices } from "./useBilling-Cm7xg-nE.js";
import { u as useLowStockAlerts, a as useExpiryAlerts } from "./useInventory-BxF-BI43.js";
import { u as useLabOrders } from "./useLabOrders-pRgXHUSx.js";
import { u as usePatients } from "./usePatients-1jxdmde2.js";
import { u as usePrescriptions } from "./usePrescriptions-BC0BGNco.js";
import { u as useStaffMembers } from "./useStaff-B8FY4OEx.js";
import { u as useTreatments } from "./useTreatments-DFHhDLzf.js";
import { C as Calendar } from "./calendar-FFzdZsSO.js";
import { C as ClipboardList } from "./clipboard-list-BBsWhwo8.js";
import "./useMutation-C_my6RdQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function QuickAction({ icon, label, accent, ocid, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": ocid,
      className: "flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all duration-200 group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-10 w-10 rounded-xl flex items-center justify-center transition-colors duration-200",
            style: { backgroundColor: `${accent}1a`, color: accent },
            children: icon
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors", children: label })
      ]
    }
  );
}
function SectionHeader({
  title,
  icon,
  linkLabel,
  linkOcid,
  onLink
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pt-4 pb-3 border-b border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
      icon,
      title
    ] }),
    linkLabel && onLink && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onLink,
        "data-ocid": linkOcid,
        className: "text-xs text-primary hover:underline",
        children: linkLabel
      }
    )
  ] });
}
function AdminDashboard({
  patients,
  invoices,
  staff,
  lowStock,
  onNavigate
}) {
  const today = (/* @__PURE__ */ new Date()).toDateString();
  const todayAppts = invoices.filter(
    (inv) => new Date(Number(inv.created_at / 1000000n)).toDateString() === today
  ).length;
  const monthlyRevenue = invoices.filter((inv) => {
    const d = new Date(Number(inv.created_at / 1000000n));
    const now = /* @__PURE__ */ new Date();
    return inv.status === InvoiceStatus.paid && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, inv) => s + inv.total, 0);
  const pendingInvoices = invoices.filter(
    (inv) => inv.status === InvoiceStatus.issued || inv.status === InvoiceStatus.partiallyPaid
  );
  const recentPatients = [...patients].sort((a, b) => Number(b.created_at - a.created_at)).slice(0, 5);
  const recentInvoices = [...invoices].sort((a, b) => Number(b.created_at - a.created_at)).slice(0, 5);
  const activeStaff = staff.filter((s) => s.is_active).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.total_patients.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Patients",
          value: patients.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
          accent: "doctor"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.today_appointments.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Today's Activity",
          value: todayAppts,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5" }),
          accent: "default"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.monthly_revenue.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Monthly Revenue",
          value: `₹${monthlyRevenue.toLocaleString("en-IN")}`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }),
          accent: "admin"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.pending_invoices.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Pending Invoices",
          value: pendingInvoices.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }),
          accent: pendingInvoices.length > 5 ? "warning" : "default"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.low_stock.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Low Stock Items",
          value: (lowStock ?? []).length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
          accent: (lowStock ?? []).length > 0 ? "destructive" : "default"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.active_staff.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Staff Active",
          value: activeStaff,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-5 w-5" }),
          accent: "receptionist"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-0.5", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 sm:grid-cols-6 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuickAction,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
            label: "Add Patient",
            accent: "oklch(0.62 0.18 200)",
            ocid: "dashboard.add_patient.button",
            onClick: () => onNavigate("/patients")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuickAction,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }),
            label: "Create Invoice",
            accent: "oklch(0.74 0.16 78)",
            ocid: "dashboard.create_invoice.button",
            onClick: () => onNavigate("/billing")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuickAction,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
            label: "Add Staff",
            accent: "oklch(0.65 0.17 155)",
            ocid: "dashboard.add_staff.button",
            onClick: () => onNavigate("/staff")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuickAction,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5" }),
            label: "New Treatment",
            accent: "oklch(0.62 0.18 200)",
            ocid: "dashboard.new_treatment.button",
            onClick: () => onNavigate("/treatments")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuickAction,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-5 w-5" }),
            label: "Lab Orders",
            accent: "oklch(0.56 0.15 105)",
            ocid: "dashboard.lab_orders.button",
            onClick: () => onNavigate("/lab-orders")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuickAction,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
            label: "Inventory",
            accent: "oklch(0.58 0.04 265)",
            ocid: "dashboard.inventory.button",
            onClick: () => onNavigate("/inventory")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl",
          "data-ocid": "dashboard.recent_patients.list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Recent Patients",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-[oklch(0.62_0.18_200)]" }),
                linkLabel: "View all",
                linkOcid: "dashboard.view_all_patients.link",
                onLink: () => onNavigate("/patients")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Table,
              {
                columns: [
                  {
                    key: "name",
                    header: "Patient",
                    render: (row) => `${row.first_name} ${row.last_name}`
                  },
                  { key: "phone", header: "Phone" },
                  {
                    key: "created_at",
                    header: "Registered",
                    render: (row) => new Date(
                      Number(row.created_at / 1000000n)
                    ).toLocaleDateString("en-IN")
                  }
                ],
                data: recentPatients,
                keyExtractor: (row) => row.id.toString(),
                emptyMessage: "No patients registered yet"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl",
          "data-ocid": "dashboard.recent_invoices.list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Recent Invoices",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-4 w-4 text-[oklch(0.74_0.16_78)]" }),
                linkLabel: "View all",
                linkOcid: "dashboard.view_all_invoices.link",
                onLink: () => onNavigate("/billing")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Table,
              {
                columns: [
                  {
                    key: "id",
                    header: "Invoice",
                    render: (row) => `#${row.id}`
                  },
                  {
                    key: "total",
                    header: "Amount",
                    align: "right",
                    render: (row) => `₹${row.total.toLocaleString("en-IN")}`
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: row.status })
                  }
                ],
                data: recentInvoices,
                keyExtractor: (row) => row.id.toString(),
                emptyMessage: "No invoices yet"
              }
            )
          ]
        }
      )
    ] })
  ] });
}
function DoctorDashboard({
  patients,
  treatments,
  labOrders,
  prescriptions,
  onNavigate
}) {
  const pendingLab = labOrders.filter(
    (o) => o.status === LabOrderStatus.pending || o.status === LabOrderStatus.inProgress
  );
  const activePrescriptions = (prescriptions ?? []).filter(
    (p) => p.is_active
  ).length;
  const inProgress = treatments.filter(
    (t) => t.status === TreatmentStatus.active
  ).length;
  const recentTreatments = [...treatments].sort((a, b) => Number(b.updated_at - a.updated_at)).slice(0, 6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.pending_lab.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Pending Lab Orders",
          value: pendingLab.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-5 w-5" }),
          accent: pendingLab.length > 0 ? "warning" : "default"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.active_prescriptions.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Active Prescriptions",
          value: activePrescriptions,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-5 w-5" }),
          accent: "doctor"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.treatments_in_progress.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Treatments In Progress",
          value: inProgress,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5" }),
          accent: "doctor"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.total_patients.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Patients",
          value: patients.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
          accent: "default"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl",
          "data-ocid": "dashboard.recent_treatments.list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Recent Treatments",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-4 w-4 text-[oklch(0.62_0.18_200)]" }),
                linkLabel: "View all",
                linkOcid: "dashboard.view_all_treatments.link",
                onLink: () => onNavigate("/treatments")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Table,
              {
                columns: [
                  { key: "title", header: "Treatment" },
                  {
                    key: "estimated_cost",
                    header: "Est. Cost",
                    align: "right",
                    render: (row) => `₹${row.estimated_cost.toLocaleString("en-IN")}`
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: row.status })
                  }
                ],
                data: recentTreatments,
                keyExtractor: (row) => row.id.toString(),
                emptyMessage: "No treatments yet"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl",
          "data-ocid": "dashboard.pending_lab_orders.list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Pending Lab Orders",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-4 w-4 text-[oklch(0.56_0.15_105)]" }),
                linkLabel: "View all",
                linkOcid: "dashboard.view_all_lab_orders.link",
                onLink: () => onNavigate("/lab-orders")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Table,
              {
                columns: [
                  { key: "lab_name", header: "Lab" },
                  { key: "procedure_type", header: "Procedure" },
                  { key: "due_date", header: "Due" },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: row.status })
                  }
                ],
                data: pendingLab.slice(0, 5),
                keyExtractor: (row) => row.id.toString(),
                emptyMessage: "No pending lab orders"
              }
            )
          ]
        }
      )
    ] })
  ] });
}
function ReceptionistDashboard({
  patients,
  invoices,
  lowStock,
  expiryAlerts,
  onNavigate
}) {
  const today = (/* @__PURE__ */ new Date()).toDateString();
  const todayRegistrations = patients.filter(
    (p) => new Date(Number(p.created_at / 1000000n)).toDateString() === today
  ).length;
  const pendingPayments = invoices.filter(
    (inv) => inv.status === InvoiceStatus.issued || inv.status === InvoiceStatus.partiallyPaid
  );
  const recentPatients = [...patients].sort((a, b) => Number(b.created_at - a.created_at)).slice(0, 5);
  const pendingInvoices = [...pendingPayments].sort((a, b) => Number(b.created_at - a.created_at)).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.today_registrations.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Today's Registrations",
          value: todayRegistrations,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
          accent: "receptionist"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.pending_payments.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Pending Payments",
          value: pendingPayments.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }),
          accent: pendingPayments.length > 3 ? "warning" : "default"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.low_stock_alerts.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Low Stock Alerts",
          value: (lowStock ?? []).length + (expiryAlerts ?? []).length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
          accent: (lowStock ?? []).length > 0 ? "destructive" : "default"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.total_patients.card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Patients",
          value: patients.length,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
          accent: "doctor"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl",
          "data-ocid": "dashboard.recent_patients.list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Quick Check-in",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-[oklch(0.65_0.17_155)]" }),
                linkLabel: "All Patients",
                linkOcid: "dashboard.view_all_patients.link",
                onLink: () => onNavigate("/patients")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Table,
              {
                columns: [
                  {
                    key: "name",
                    header: "Patient",
                    render: (row) => `${row.first_name} ${row.last_name}`
                  },
                  { key: "phone", header: "Phone" },
                  {
                    key: "created_at",
                    header: "Registered",
                    render: (row) => new Date(
                      Number(row.created_at / 1000000n)
                    ).toLocaleDateString("en-IN")
                  }
                ],
                data: recentPatients,
                keyExtractor: (row) => row.id.toString(),
                emptyMessage: "No recent patients"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl",
          "data-ocid": "dashboard.pending_invoices.list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Pending Invoices",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-4 w-4 text-[oklch(0.74_0.16_78)]" }),
                linkLabel: "View all",
                linkOcid: "dashboard.view_all_invoices.link",
                onLink: () => onNavigate("/billing")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Table,
              {
                columns: [
                  {
                    key: "id",
                    header: "Invoice",
                    render: (row) => `#${row.id}`
                  },
                  {
                    key: "total",
                    header: "Amount",
                    align: "right",
                    render: (row) => `₹${row.total.toLocaleString("en-IN")}`
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: row.status })
                  }
                ],
                data: pendingInvoices,
                keyExtractor: (row) => row.id.toString(),
                emptyMessage: "No pending invoices"
              }
            )
          ]
        }
      )
    ] })
  ] });
}
const ROLE_META = {
  admin: {
    label: "Admin",
    color: "oklch(0.74 0.16 78)",
    bg: "oklch(0.74 0.16 78 / 0.12)"
  },
  doctor: {
    label: "Doctor",
    color: "oklch(0.62 0.18 200)",
    bg: "oklch(0.62 0.18 200 / 0.12)"
  },
  receptionist: {
    label: "Receptionist",
    color: "oklch(0.65 0.17 155)",
    bg: "oklch(0.65 0.17 155 / 0.12)"
  }
};
function DashboardPage({
  role,
  staff,
  onNavigate
}) {
  const { data: patients = [], isLoading: pLoading } = usePatients();
  const { data: invoices = [], isLoading: iLoading } = useInvoices();
  const { data: treatments = [] } = useTreatments();
  const { data: labOrders = [] } = useLabOrders();
  const { data: prescriptions } = usePrescriptions();
  const { data: lowStock } = useLowStockAlerts();
  const { data: expiryAlerts } = useExpiryAlerts();
  const { data: staffList = [] } = useStaffMembers();
  if (pLoading || iLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const roleMeta = ROLE_META[role] ?? ROLE_META.admin;
  const greeting = (() => {
    const h = (/* @__PURE__ */ new Date()).getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
          style: { color: roleMeta.color, backgroundColor: roleMeta.bg },
          children: roleMeta.label
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground", children: [
        greeting,
        staff ? `, ${staff.name.split(" ")[0]}` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }) })
    ] }) }),
    role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdminDashboard,
      {
        patients,
        invoices,
        staff: staffList,
        lowStock,
        onNavigate
      }
    ),
    role === "doctor" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DoctorDashboard,
      {
        patients,
        treatments,
        labOrders,
        prescriptions,
        onNavigate
      }
    ),
    role === "receptionist" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReceptionistDashboard,
      {
        patients,
        invoices,
        lowStock,
        expiryAlerts,
        onNavigate
      }
    )
  ] });
}
export {
  DashboardPage as default
};
