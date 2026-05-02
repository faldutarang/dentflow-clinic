import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, e as LoadingSpinner, S as Stethoscope, f as Pill, F as FlaskConical } from "./index-CRusxQeF.js";
import { B as Badge } from "./Badge-2qoa5wWf.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
import { u as useLabOrders } from "./useLabOrders-pRgXHUSx.js";
import { b as usePatient } from "./usePatients-1jxdmde2.js";
import { u as usePrescriptions } from "./usePrescriptions-BC0BGNco.js";
import { u as useTreatments } from "./useTreatments-DFHhDLzf.js";
import { P as PatientFormModal } from "./PatientFormModal-Cpx3SyKq.js";
import { A as ArrowLeft } from "./arrow-left-B9W68Srg.js";
import { U as User } from "./user-DtzG4PId.js";
import { P as Phone, M as Mail } from "./phone-DykqBWQv.js";
import { P as Pen } from "./pen-DoUQIFU9.js";
import { F as FileText } from "./file-text-DIr3Iiet.js";
import { C as Calendar } from "./calendar-FFzdZsSO.js";
import { C as ClipboardList } from "./clipboard-list-BBsWhwo8.js";
import { C as CircleAlert } from "./circle-alert-Km4XO0xA.js";
import "./useMutation-C_my6RdQ.js";
import "./Select-Dw0AWwQu.js";
import "./plus-CqSfRGkC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
      key: "c7niix"
    }
  ]
];
const Droplet = createLucideIcon("droplet", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode);
const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-4 w-4" })
  },
  {
    id: "treatments",
    label: "Treatments",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" })
  },
  {
    id: "chart",
    label: "Dental Chart",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-4 w-4" })
  },
  {
    id: "prescriptions",
    label: "Prescriptions",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { className: "h-4 w-4" })
  },
  {
    id: "documents",
    label: "Documents",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" })
  },
  {
    id: "lab",
    label: "Lab Orders",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-4 w-4" })
  }
];
function calcAge(dob) {
  const birth = new Date(dob);
  const now = /* @__PURE__ */ new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || m === 0 && now.getDate() < birth.getDate()) age--;
  return age;
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function bloodGroupLabel(bg) {
  return bg.replace("Pos", "+").replace("Neg", "−").replace("unknown", "?");
}
function OverviewTab({ patient }) {
  const fields = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
      label: "Date of Birth",
      value: patient.date_of_birth
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
      label: "Gender",
      value: patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
      label: "Email",
      value: patient.email || "—"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
      label: "Phone",
      value: patient.phone
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
      label: "Address",
      value: patient.address || "—"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "h-4 w-4" }),
      label: "Blood Group",
      value: bloodGroupLabel(patient.blood_group)
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
      label: "Registered",
      value: formatDate(patient.created_at)
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid md:grid-cols-2 gap-6",
      "data-ocid": "patient-detail.overview.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-4 w-4 text-primary" }),
            "Registration Info"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "space-y-3", children: fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-muted-foreground shrink-0", children: f.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: f.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-sm text-foreground font-medium break-words", children: f.value })
            ] })
          ] }, f.label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 text-destructive" }),
              "Medical History"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed whitespace-pre-line", children: patient.medical_history || "No medical history recorded." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-warning" }),
              "Allergies"
            ] }),
            patient.allergies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "None reported." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: patient.allergies.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                style: {
                  background: "oklch(0.58 0.22 25 / 0.12)",
                  color: "oklch(0.58 0.22 25)",
                  border: "1px solid oklch(0.58 0.22 25 / 0.25)"
                },
                children: a
              },
              a
            )) })
          ] })
        ] })
      ]
    }
  );
}
function TreatmentsTab({ patientId }) {
  const { data: treatments = [], isLoading } = useTreatments(patientId);
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-16 flex justify-center",
        "data-ocid": "patient-detail.treatments.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {})
      }
    );
  if (treatments.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "patient-detail.treatments.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-7 w-7" }),
        title: "No treatments yet",
        description: "Treatment plans will appear here once created."
      }
    ) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "patient-detail.treatments.list", children: treatments.map((t, i) => {
    var _a;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4",
        "data-ocid": `patient-detail.treatments.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: t.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              t.procedures.length,
              " procedure",
              t.procedures.length !== 1 ? "s" : "",
              " · Est. ₹",
              t.estimated_cost.toLocaleString("en-IN")
            ] }),
            t.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: t.notes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusBadge,
            {
              status: t.status
            }
          ) })
        ]
      },
      (_a = t.id) == null ? void 0 : _a.toString()
    );
  }) });
}
function PrescriptionsTab({ patientId }) {
  const { data: prescriptions = [], isLoading } = usePrescriptions(patientId);
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-16 flex justify-center",
        "data-ocid": "patient-detail.prescriptions.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {})
      }
    );
  if (prescriptions.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "patient-detail.prescriptions.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { className: "h-7 w-7" }),
        title: "No prescriptions",
        description: "Prescription records will appear here."
      }
    ) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "patient-detail.prescriptions.list", children: prescriptions.map((rx, i) => {
    var _a;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4",
        "data-ocid": `patient-detail.prescriptions.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Issued ",
              formatDate(rx.created_at)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: rx.is_active ? "active" : "completed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rx.medications.map((med, mi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-3 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 mt-0.5 flex-shrink-0 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-[10px] text-primary font-bold", children: mi + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: med.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    med.dosage,
                    " · ",
                    med.frequency,
                    " · ",
                    med.duration
                  ] }),
                  med.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: med.notes })
                ] })
              ]
            },
            `${med.name}-${mi}`
          )) })
        ]
      },
      (_a = rx.id) == null ? void 0 : _a.toString()
    );
  }) });
}
function LabOrdersTab({ patientId }) {
  const { data: orders = [], isLoading } = useLabOrders(patientId);
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-16 flex justify-center",
        "data-ocid": "patient-detail.lab.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {})
      }
    );
  if (orders.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "patient-detail.lab.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-7 w-7" }),
        title: "No lab orders",
        description: "Lab orders placed for this patient will appear here."
      }
    ) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "patient-detail.lab.list", children: orders.map((order, i) => {
    var _a;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4",
        "data-ocid": `patient-detail.lab.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: order.procedure_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              order.lab_name,
              " · Due ",
              order.due_date,
              " · ₹",
              order.cost.toLocaleString("en-IN")
            ] }),
            order.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1 line-clamp-2", children: order.notes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusBadge,
            {
              status: order.status
            }
          )
        ]
      },
      (_a = order.id) == null ? void 0 : _a.toString()
    );
  }) });
}
function DocumentsTab({ patientId: _patientId }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "patient-detail.documents.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    EmptyState,
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7" }),
      title: "No documents uploaded",
      description: "X-rays and clinical documents attached to this patient will appear here."
    }
  ) });
}
function DentalChartTab({
  patientId,
  onNavigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-16 gap-4",
      "data-ocid": "patient-detail.chart.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-8 w-8 text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: "Digital Dental Chart" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "View and annotate the patient's tooth-by-tooth record." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onNavigate == null ? void 0 : onNavigate(`/dental-chart?patientId=${patientId}`),
            "data-ocid": "patient-detail.chart.open_chart.primary_button",
            className: "inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-4 w-4" }),
              "Open Dental Chart"
            ]
          }
        )
      ]
    }
  );
}
function PatientDetailPage({
  patientId,
  onNavigate
}) {
  const [tab, setTab] = reactExports.useState("overview");
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const id = patientId ?? null;
  const { data: patient, isLoading } = usePatient(id);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[400px]",
        "data-ocid": "patient-detail.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading patient..." })
      }
    );
  }
  if (!patient) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", "data-ocid": "patient-detail.error_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-7 w-7" }),
        title: "Patient not found",
        description: "This patient record does not exist or was removed.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onNavigate == null ? void 0 : onNavigate("/patients"),
            className: "inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
              " Back to Patients"
            ]
          }
        )
      }
    ) });
  }
  const age = calcAge(patient.date_of_birth);
  const allergyCount = patient.allergies.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", "data-ocid": "patient-detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onNavigate == null ? void 0 : onNavigate("/patients"),
        className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit",
        "data-ocid": "patient-detail.back.link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          "All Patients"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-6",
        "data-ocid": "patient-detail.profile.card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl font-bold text-primary", children: [
              patient.first_name[0],
              patient.last_name[0]
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground", children: [
                patient.first_name,
                " ",
                patient.last_name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  age,
                  " yrs ·",
                  " ",
                  patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs bg-muted/40 border border-border px-2 py-0.5 rounded text-foreground uppercase", children: bloodGroupLabel(patient.blood_group) }),
                allergyCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "default", size: "sm", children: [
                  allergyCount,
                  " allerg",
                  allergyCount !== 1 ? "ies" : "y"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 sm:flex-col sm:items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: patient.phone })
            ] }),
            patient.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[200px]", children: patient.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setEditOpen(true),
                "data-ocid": "patient-detail.edit.edit_button",
                className: "inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium border border-border bg-transparent text-foreground rounded-lg hover:bg-muted transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" }),
                  "Edit"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border", "data-ocid": "patient-detail.tabs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "nav",
      {
        className: "flex gap-1 overflow-x-auto pb-0",
        "aria-label": "Patient detail tabs",
        children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setTab(t.id),
            "data-ocid": `patient-detail.tab-${t.id}.tab`,
            className: `
                flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}
              `,
            children: [
              t.icon,
              t.label
            ]
          },
          t.id
        ))
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "patient-detail.tab-content.panel", children: [
      tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { patient }),
      tab === "treatments" && /* @__PURE__ */ jsxRuntimeExports.jsx(TreatmentsTab, { patientId: patient.id }),
      tab === "chart" && /* @__PURE__ */ jsxRuntimeExports.jsx(DentalChartTab, { patientId: patient.id, onNavigate }),
      tab === "prescriptions" && /* @__PURE__ */ jsxRuntimeExports.jsx(PrescriptionsTab, { patientId: patient.id }),
      tab === "documents" && /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentsTab, { patientId: patient.id }),
      tab === "lab" && /* @__PURE__ */ jsxRuntimeExports.jsx(LabOrdersTab, { patientId: patient.id })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PatientFormModal,
      {
        open: editOpen,
        onClose: () => setEditOpen(false),
        mode: "edit",
        patient
      }
    )
  ] });
}
export {
  PatientDetailPage as default
};
