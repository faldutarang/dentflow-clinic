import { c as createLucideIcon, j as jsxRuntimeExports, n as useActor, o as useQueryClient, p as useQuery, r as reactExports, x as Bell, U as Users, u as ue, q as createActor } from "./index-CRusxQeF.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardBody } from "./Card-BlkLkm0G.js";
import { H as Hash } from "./hash-DEw8IING.js";
import { P as Phone, M as Mail } from "./phone-DykqBWQv.js";
import { C as Clock } from "./clock-cX5WXH5S.js";
import { S as Save } from "./save-Bn-XkvOm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$1);
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
function ClinicSettingsForm() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["clinicSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getClinicSettings();
    },
    enabled: !!actor && !isFetching
  });
  const updateMutation = useMutation({
    mutationFn: async (updated) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateClinicSettings(updated);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinicSettings"] });
      ue.success("Clinic settings saved successfully.");
    },
    onError: () => {
      ue.error("Failed to save settings. Please try again.");
    }
  });
  const [name, setName] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [gstNumber, setGstNumber] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [openTime, setOpenTime] = reactExports.useState("09:00");
  const [closeTime, setCloseTime] = reactExports.useState("18:00");
  const [daysOpen, setDaysOpen] = reactExports.useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri"
  ]);
  reactExports.useEffect(() => {
    if (!settings) return;
    setName(settings.name);
    setAddress(settings.address);
    setGstNumber(settings.gst_number);
    setPhone(settings.phone);
    setEmail(settings.email);
    setOpenTime(settings.working_hours.open_time);
    setCloseTime(settings.working_hours.close_time);
    setDaysOpen(settings.working_hours.days_open);
  }, [settings]);
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const toggleDay = (day) => {
    setDaysOpen(
      (prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const handleSave = (e) => {
    e.preventDefault();
    if (!settings) return;
    updateMutation.mutate({
      ...settings,
      name,
      address,
      gst_number: gstNumber,
      phone,
      email,
      working_hours: {
        open_time: openTime,
        close_time: closeTime,
        days_open: daysOpen
      }
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 rounded-lg bg-muted/30 animate-pulse" }, k)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSave,
      className: "space-y-5",
      "data-ocid": "settings.clinic_form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "settings-name",
              className: "flex items-center gap-1.5 text-sm font-medium text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                "Clinic Name"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "settings-name",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "DentaCare Pro",
              required: true,
              "data-ocid": "settings.clinic_name.input",
              className: "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "settings-address",
              className: "flex items-center gap-1.5 text-sm font-medium text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                "Address"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "settings-address",
              value: address,
              onChange: (e) => setAddress(e.target.value),
              rows: 2,
              placeholder: "123 Medical Complex, Mumbai, Maharashtra 400001",
              "data-ocid": "settings.address.textarea",
              className: "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "settings-gst",
              className: "flex items-center gap-1.5 text-sm font-medium text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                "GST Number"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "settings-gst",
              value: gstNumber,
              onChange: (e) => setGstNumber(e.target.value),
              placeholder: "27AABCU9603R1ZX",
              "data-ocid": "settings.gst_number.input",
              className: "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "settings-phone",
                className: "flex items-center gap-1.5 text-sm font-medium text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                  "Phone"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "settings-phone",
                type: "tel",
                value: phone,
                onChange: (e) => setPhone(e.target.value),
                placeholder: "+91 98765 43210",
                "data-ocid": "settings.phone.input",
                className: "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "settings-email",
                className: "flex items-center gap-1.5 text-sm font-medium text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                  "Email"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "settings-email",
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "info@dentaclinic.com",
                "data-ocid": "settings.email.input",
                className: "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-sm font-medium text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Working Hours"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-border bg-muted/20 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "settings-open-time",
                    className: "text-xs text-muted-foreground",
                    children: "Open Time"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "settings-open-time",
                    type: "time",
                    value: openTime,
                    onChange: (e) => setOpenTime(e.target.value),
                    "data-ocid": "settings.open_time.input",
                    className: "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "settings-close-time",
                    className: "text-xs text-muted-foreground",
                    children: "Close Time"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "settings-close-time",
                    type: "time",
                    value: closeTime,
                    onChange: (e) => setCloseTime(e.target.value),
                    "data-ocid": "settings.close_time.input",
                    className: "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "text-xs text-muted-foreground mb-2", children: "Days Open" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: DAYS.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleDay(day),
                  "data-ocid": `settings.day_${day.toLowerCase()}.toggle`,
                  "aria-pressed": daysOpen.includes(day),
                  className: `px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${daysOpen.includes(day) ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"}`,
                  children: day
                },
                day
              )) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "submit",
            disabled: updateMutation.isPending || !settings,
            "data-ocid": "settings.save.submit_button",
            className: "flex items-center gap-2 px-6 h-10 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
              updateMutation.isPending ? "Saving..." : "Save Settings"
            ]
          }
        ) })
      ]
    }
  );
}
const INFO_SECTIONS = [
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5" }),
    title: "Security & Access",
    description: "Role-based access control and audit logs",
    items: [
      "Role-based access: Enabled (Admin · Doctor · Receptionist)",
      "Audit logging: Active on all mutations",
      "Session timeout: 30 minutes of inactivity"
    ]
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-5 w-5" }),
    title: "Data Management",
    description: "Backups, exports, and storage infrastructure",
    items: [
      "Data stored on Internet Computer (immutable ledger)",
      "Automatic state snapshots: On every upgrade",
      "Data encryption: AES-256 at rest"
    ]
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
    title: "Notifications & Alerts",
    description: "Configure in-app alerts and reminders",
    items: [
      "Low stock alerts: Enabled (threshold: reorder level)",
      "Expiry alerts: 30 days ahead",
      "Lab order status: Real-time updates"
    ]
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
    title: "Multi-Clinic Setup",
    description: "Manage multiple clinic locations",
    items: [
      "Primary clinic: Auto-assigned on first login",
      "Clinic ID: Immutable after creation",
      "Cross-clinic data: Fully isolated"
    ]
  }
];
function SettingsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "settings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Settings",
        description: "Manage clinic preferences and system configuration"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { accent: "admin", "data-ocid": "settings.clinic_settings.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Clinic Settings" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Update clinic name, address, GST number, contact info, and working hours." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardBody, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClinicSettingsForm, {}) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: INFO_SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": `settings.${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.card`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground", children: section.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: section.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: section.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardBody, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: section.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-start gap-2 text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" }),
                  item
                ]
              },
              item
            )) }) })
          ]
        },
        section.title
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-xs text-muted-foreground text-center", children: "DentaCare Pro is built on the Internet Computer — decentralized, privacy-first, and always available." })
  ] });
}
export {
  SettingsPage as default
};
