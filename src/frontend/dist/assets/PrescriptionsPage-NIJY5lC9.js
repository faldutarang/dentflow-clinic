import { c as createLucideIcon, n as useActor, o as useQueryClient, r as reactExports, p as useQuery, j as jsxRuntimeExports, u as ue, q as createActor, e as LoadingSpinner } from "./index-CRusxQeF.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { B as Button } from "./Button-CwPCyQgH.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { T as Table } from "./Table-ByTzrkVY.js";
import { M as Modal, S as Select, I as Input } from "./Select-Dw0AWwQu.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
import { P as Plus } from "./plus-CqSfRGkC.js";
import { T as Trash2 } from "./trash-2-CSaJsAG8.js";
import { u as usePatients } from "./usePatients-1jxdmde2.js";
import { u as usePrescriptions, a as useDeactivatePrescription } from "./usePrescriptions-BC0BGNco.js";
import { u as useStaffMembers } from "./useStaff-B8FY4OEx.js";
import { F as FileText } from "./file-text-DIr3Iiet.js";
import { C as CircleAlert } from "./circle-alert-Km4XO0xA.js";
import { f as format } from "./format-rbhgLEdD.js";
import { P as Printer } from "./printer-DW7fu9Up.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18.36 6.64A9 9 0 0 1 20.77 15", key: "dxknvb" }],
  ["path", { d: "M6.16 6.16a9 9 0 1 0 12.68 12.68", key: "1x7qb5" }],
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const PowerOff = createLucideIcon("power-off", __iconNode);
const EMPTY_MED = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  notes: ""
};
function PrescriptionFormModal({
  open,
  onClose
}) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [patientId, setPatientId] = reactExports.useState("");
  const [treatmentId, setTreatmentId] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [medications, setMedications] = reactExports.useState([
    { ...EMPTY_MED }
  ]);
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPatients();
    },
    enabled: !!actor && !isFetching && open
  });
  const { data: treatments = [] } = useQuery({
    queryKey: ["treatments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTreatments(null);
    },
    enabled: !!actor && !isFetching && open
  });
  const patientTreatments = patientId ? treatments.filter((t) => t.patient_id.toString() === patientId) : [];
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const dentist = await actor.listStaffMembers();
      const doc = dentist.find((s) => s.role === "doctor");
      if (!doc) throw new Error("No doctor found. Only doctors can prescribe.");
      const validMeds = medications.filter((m) => m.name.trim());
      if (!validMeds.length) throw new Error("Add at least one medication.");
      return actor.createPrescription({
        patient_id: BigInt(patientId),
        dentist_id: doc.id,
        medications: validMeds,
        treatment_id: treatmentId ? BigInt(treatmentId) : void 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      ue.success("Prescription created");
      handleClose();
    },
    onError: (err) => {
      ue.error(err.message || "Failed to create prescription");
    }
  });
  const handleClose = () => {
    setPatientId("");
    setTreatmentId("");
    setNotes("");
    setMedications([{ ...EMPTY_MED }]);
    onClose();
  };
  const updateMed = (i, field, value) => {
    setMedications(
      (prev) => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m)
    );
  };
  const addMed = () => setMedications((prev) => [...prev, { ...EMPTY_MED }]);
  const removeMed = (i) => setMedications((prev) => prev.filter((_, idx) => idx !== i));
  const canSubmit = !!patientId && medications.some((m) => m.name.trim()) && !createMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose: handleClose,
      title: "New Prescription",
      description: "Create a digital prescription for a patient",
      size: "xl",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: handleClose,
            "data-ocid": "prescription-form.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => createMutation.mutate(),
            loading: createMutation.isPending,
            disabled: !canSubmit,
            "data-ocid": "prescription-form.submit_button",
            children: "Create Prescription"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Patient *",
              value: patientId,
              onChange: setPatientId,
              placeholder: "Select patient...",
              options: patients.map((p) => ({
                value: p.id.toString(),
                label: `${p.first_name} ${p.last_name}`
              })),
              "data-ocid": "prescription-form.patient_select"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Treatment (optional)",
              value: treatmentId,
              onChange: setTreatmentId,
              placeholder: "Link to treatment...",
              options: patientTreatments.map((t) => ({
                value: t.id.toString(),
                label: t.title
              })),
              disabled: !patientId,
              "data-ocid": "prescription-form.treatment_select"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Medications *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: addMed,
                "data-ocid": "prescription-form.add_medication_button",
                className: "inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  "Add Medication"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: medications.map((med, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `prescription-form.medication.${i + 1}`,
              className: "bg-muted/20 border border-border rounded-lg p-3 space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-accent", children: [
                    "Medication ",
                    i + 1
                  ] }),
                  medications.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeMed(i),
                      "data-ocid": `prescription-form.remove_medication.${i + 1}`,
                      className: "text-muted-foreground hover:text-destructive transition-colors",
                      "aria-label": "Remove medication",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      label: "Name *",
                      value: med.name,
                      onChange: (e) => updateMed(i, "name", e.target.value),
                      placeholder: "e.g. Amoxicillin 500mg",
                      "data-ocid": `prescription-form.medication_name.${i + 1}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      label: "Dosage *",
                      value: med.dosage,
                      onChange: (e) => updateMed(i, "dosage", e.target.value),
                      placeholder: "e.g. 1 tablet",
                      "data-ocid": `prescription-form.medication_dosage.${i + 1}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      label: "Frequency *",
                      value: med.frequency,
                      onChange: (e) => updateMed(i, "frequency", e.target.value),
                      placeholder: "e.g. 3 times daily",
                      "data-ocid": `prescription-form.medication_frequency.${i + 1}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      label: "Duration *",
                      value: med.duration,
                      onChange: (e) => updateMed(i, "duration", e.target.value),
                      placeholder: "e.g. 5 days",
                      "data-ocid": `prescription-form.medication_duration.${i + 1}`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    label: "Notes",
                    value: med.notes,
                    onChange: (e) => updateMed(i, "notes", e.target.value),
                    placeholder: "e.g. Take after meals",
                    "data-ocid": `prescription-form.medication_notes.${i + 1}`
                  }
                )
              ]
            },
            `med-row-${med.name || i}-${i}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "prescription-notes",
              className: "text-sm font-medium text-foreground",
              children: "Prescription Notes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "prescription-notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Additional instructions or notes...",
              rows: 3,
              "data-ocid": "prescription-form.notes_textarea",
              className: "flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-colors"
            }
          )
        ] })
      ] })
    }
  );
}
function PrintPreviewModal({
  prescription,
  onClose,
  getPatientName,
  getDoctorName,
  formatDate
}) {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60",
        "data-ocid": "prescriptions.print_dialog",
        onClick: onClose,
        onKeyDown: (e) => e.key === "Escape" && onClose(),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card rounded-xl border border-border shadow-xl w-full max-w-md mx-4 p-6 space-y-4",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Print Prescription" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "prescriptions.print_dialog.close_button",
                    onClick: onClose,
                    className: "h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                    "aria-label": "Close",
                    children: "✕"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "prescription-print-area", className: "space-y-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border pb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-base", children: [
                    "Patient: ",
                    getPatientName(prescription.patient_id)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                    "Prescribing Doctor: ",
                    getDoctorName(prescription.dentist_id)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                    "Date: ",
                    formatDate(prescription.created_at)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Medications:" }),
                  prescription.medications.map((med) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "pl-3 border-l-2 border-accent/40 text-muted-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: med.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                          med.dosage,
                          " — ",
                          med.frequency
                        ] }),
                        med.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "italic", children: med.notes })
                      ]
                    },
                    med.name
                  ))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "prescriptions.print_dialog.cancel_button",
                    onClick: onClose,
                    className: "h-8 px-3 rounded-md text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "prescriptions.print_dialog.confirm_button",
                    onClick: () => window.print(),
                    className: "h-8 px-3 rounded-md text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors inline-flex items-center gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3.5 w-3.5" }),
                      "Print"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  );
}
function PrescriptionStatusBadge({ isActive }) {
  return isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium badge-approved", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium badge-rejected", children: "Deactivated" });
}
function PrescriptionsPage() {
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [deactivatingId, setDeactivatingId] = reactExports.useState(null);
  const [printTarget, setPrintTarget] = reactExports.useState(null);
  const { data: prescriptions = [], isLoading } = usePrescriptions();
  const { data: patients = [] } = usePatients();
  const { data: staffList = [] } = useStaffMembers();
  const deactivateMutation = useDeactivatePrescription();
  const patientMap = new Map(patients.map((p) => [p.id.toString(), p]));
  const staffMap = new Map(staffList.map((s) => [s.id.toString(), s]));
  const filtered = prescriptions.filter((rx) => {
    if (statusFilter === "active") return rx.is_active;
    if (statusFilter === "deactivated") return !rx.is_active;
    return true;
  });
  const getPatientName = (id) => {
    const p = patientMap.get(id.toString());
    return p ? `${p.first_name} ${p.last_name}` : `#${id}`;
  };
  const getDoctorName = (id) => {
    const s = staffMap.get(id.toString());
    return s ? s.name : `Dr. #${id}`;
  };
  const formatDate = (ts) => {
    try {
      return format(new Date(Number(ts / 1000000n)), "dd MMM yyyy");
    } catch {
      return "—";
    }
  };
  const handleDeactivate = async (id) => {
    setDeactivatingId(id);
    try {
      await deactivateMutation.mutateAsync(id);
      ue.success("Prescription deactivated");
    } catch {
      ue.error("Failed to deactivate prescription");
    } finally {
      setDeactivatingId(null);
    }
  };
  const columns = [
    {
      key: "patient",
      header: "Patient",
      render: (rx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: getPatientName(rx.patient_id) })
    },
    {
      key: "doctor",
      header: "Dentist",
      render: (rx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: getDoctorName(rx.dentist_id) })
    },
    {
      key: "medications",
      header: "Medications",
      align: "center",
      render: (rx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20", children: rx.medications.length })
    },
    {
      key: "status",
      header: "Status",
      render: (rx) => /* @__PURE__ */ jsxRuntimeExports.jsx(PrescriptionStatusBadge, { isActive: rx.is_active })
    },
    {
      key: "created_at",
      header: "Date",
      render: (rx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground tabular-nums", children: formatDate(rx.created_at) })
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (rx, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `prescriptions.print_button.${i + 1}`,
            className: "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "aria-label": "Print prescription",
            onClick: () => setPrintTarget(rx),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3 w-3" }),
              "Print"
            ]
          }
        ),
        rx.is_active && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `prescriptions.deactivate_button.${i + 1}`,
            onClick: () => handleDeactivate(rx.id),
            disabled: deactivatingId === rx.id,
            className: "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50",
            "aria-label": "Deactivate prescription",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-3 w-3" }),
              "Deactivate"
            ]
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "prescriptions.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Prescriptions",
        description: "Manage digital prescriptions for patients",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setShowCreate(true),
            "data-ocid": "prescriptions.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "New Prescription"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2",
        "data-ocid": "prescriptions.filter.tab",
        children: [
          ["all", "active", "deactivated"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setStatusFilter(f),
              className: `h-8 px-3 rounded-lg text-sm font-medium transition-colors ${statusFilter === f ? "bg-accent/15 text-accent border border-accent/30" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`,
              children: f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)
            },
            f
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
            filtered.length,
            " prescription",
            filtered.length !== 1 ? "s" : ""
          ] })
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center py-20",
        "data-ocid": "prescriptions.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7" }),
        title: "No prescriptions found",
        description: statusFilter === "all" ? "Create a prescription for a patient to get started." : `No ${statusFilter} prescriptions.`,
        action: statusFilter === "all" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setShowCreate(true),
            "data-ocid": "prescriptions.empty_state_add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "New Prescription"
            ]
          }
        ) : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "prescriptions.table", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Table,
      {
        columns,
        data: filtered,
        keyExtractor: (rx) => rx.id.toString(),
        stickyHeader: true
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/15 text-xs text-accent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
      "Prescription creation requires Doctor role."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PrescriptionFormModal,
      {
        open: showCreate,
        onClose: () => setShowCreate(false)
      }
    ),
    printTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PrintPreviewModal,
      {
        prescription: printTarget,
        onClose: () => setPrintTarget(null),
        getPatientName,
        getDoctorName,
        formatDate
      }
    )
  ] });
}
export {
  PrescriptionsPage as default
};
