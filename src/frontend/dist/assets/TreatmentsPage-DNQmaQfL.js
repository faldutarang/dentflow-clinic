import { c as createLucideIcon, r as reactExports, T as TreatmentStatus, j as jsxRuntimeExports, h as ProcedureStatus, u as ue, P as PageLoader, i as cn, S as Stethoscope } from "./index-CRusxQeF.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
import { T as Table } from "./Table-ByTzrkVY.js";
import { a as useCreateTreatment, b as useUpdateTreatment, c as useTreatment, u as useTreatments } from "./useTreatments-DFHhDLzf.js";
import { M as Modal, S as Select, I as Input } from "./Select-Dw0AWwQu.js";
import { P as Plus } from "./plus-CqSfRGkC.js";
import { T as Trash2 } from "./trash-2-CSaJsAG8.js";
import { b as usePatient, u as usePatients } from "./usePatients-1jxdmde2.js";
import { u as useStaffMembers } from "./useStaff-B8FY4OEx.js";
import { T as ToothDetailModal } from "./ToothDetailModal-B-pDU-EG.js";
import { C as ClipboardList } from "./clipboard-list-BBsWhwo8.js";
import { A as ArrowLeft } from "./arrow-left-B9W68Srg.js";
import { C as CircleCheck } from "./circle-check-D3UMPTkH.js";
import "./useMutation-C_my6RdQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
];
const Smile = createLucideIcon("smile", __iconNode);
const PROCEDURE_TYPES = [
  "filling",
  "crown",
  "root canal",
  "extraction",
  "cleaning",
  "scaling",
  "whitening",
  "bridge",
  "implant",
  "other"
];
const PROCEDURE_TYPE_OPTIONS = PROCEDURE_TYPES.map((p) => ({
  value: p,
  label: p.charAt(0).toUpperCase() + p.slice(1).replace(" ", " ")
}));
const PROC_STATUS_OPTIONS = [
  { value: ProcedureStatus.planned, label: "Planned" },
  { value: ProcedureStatus.inProgress, label: "In Progress" },
  { value: ProcedureStatus.completed, label: "Completed" },
  { value: ProcedureStatus.cancelled, label: "Cancelled" }
];
const TREATMENT_STATUS_OPTIONS = [
  { value: TreatmentStatus.active, label: "In Progress" },
  { value: TreatmentStatus.completed, label: "Completed" },
  { value: TreatmentStatus.cancelled, label: "Cancelled" }
];
const DEFAULT_PROC = {
  tooth_number: "",
  procedure_type: "filling",
  status: ProcedureStatus.planned,
  notes: ""
};
function TreatmentFormModal({
  open,
  onClose,
  patients,
  staffMembers,
  treatment
}) {
  const isEdit = !!treatment;
  const createTreatment = useCreateTreatment();
  const updateTreatment = useUpdateTreatment();
  const [patientId, setPatientId] = reactExports.useState(
    (treatment == null ? void 0 : treatment.patient_id.toString()) ?? ""
  );
  const [dentistId, setDentistId] = reactExports.useState(
    (treatment == null ? void 0 : treatment.dentist_id.toString()) ?? ""
  );
  const [title, setTitle] = reactExports.useState((treatment == null ? void 0 : treatment.title) ?? "");
  const [estimatedCost, setEstimatedCost] = reactExports.useState(
    (treatment == null ? void 0 : treatment.estimated_cost.toString()) ?? "0"
  );
  const [notes, setNotes] = reactExports.useState((treatment == null ? void 0 : treatment.notes) ?? "");
  const [status, setStatus] = reactExports.useState(
    (treatment == null ? void 0 : treatment.status) ?? TreatmentStatus.active
  );
  const [procedures, setProcedures] = reactExports.useState(
    (treatment == null ? void 0 : treatment.procedures.map((p) => ({
      tooth_number: p.tooth_number.toString(),
      procedure_type: p.procedure_type,
      status: p.status,
      notes: p.notes
    }))) ?? []
  );
  reactExports.useEffect(() => {
    if (open) {
      setPatientId((treatment == null ? void 0 : treatment.patient_id.toString()) ?? "");
      setDentistId((treatment == null ? void 0 : treatment.dentist_id.toString()) ?? "");
      setTitle((treatment == null ? void 0 : treatment.title) ?? "");
      setEstimatedCost((treatment == null ? void 0 : treatment.estimated_cost.toString()) ?? "0");
      setNotes((treatment == null ? void 0 : treatment.notes) ?? "");
      setStatus((treatment == null ? void 0 : treatment.status) ?? TreatmentStatus.active);
      setProcedures(
        (treatment == null ? void 0 : treatment.procedures.map((p) => ({
          tooth_number: p.tooth_number.toString(),
          procedure_type: p.procedure_type,
          status: p.status,
          notes: p.notes
        }))) ?? []
      );
    }
  }, [open, treatment]);
  const patientOptions = patients.map((p) => ({
    value: p.id.toString(),
    label: `${p.first_name} ${p.last_name}`
  }));
  const doctorOptions = staffMembers.filter((s) => s.role === "doctor" || s.role === "admin").map((s) => ({ value: s.id.toString(), label: s.name }));
  const addProcedure = () => setProcedures((prev) => [...prev, { ...DEFAULT_PROC }]);
  const removeProcedure = (i) => setProcedures((prev) => prev.filter((_, idx) => idx !== i));
  const updateProcedure = (i, field, value) => setProcedures(
    (prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p)
  );
  const isValid = !!patientId && !!title.trim();
  const handleSubmit = async () => {
    if (!isValid) {
      ue.error("Patient and treatment title are required");
      return;
    }
    const builtProcs = procedures.filter(
      (p) => p.tooth_number.trim() !== "" && !Number.isNaN(Number(p.tooth_number))
    ).map((p) => ({
      tooth_number: BigInt(p.tooth_number),
      procedure_type: p.procedure_type,
      status: p.status,
      notes: p.notes,
      dentist_id: dentistId ? BigInt(dentistId) : BigInt(1),
      completed_at: p.status === ProcedureStatus.completed ? BigInt(Date.now()) : void 0
    }));
    const input = {
      patient_id: BigInt(patientId),
      title: title.trim(),
      dentist_id: dentistId ? BigInt(dentistId) : BigInt(1),
      notes: notes.trim(),
      estimated_cost: Number(estimatedCost) || 0,
      procedures: builtProcs
    };
    try {
      if (isEdit) {
        await updateTreatment.mutateAsync({ id: treatment.id, input });
        ue.success("Treatment updated");
      } else {
        await createTreatment.mutateAsync(input);
        ue.success("Treatment plan created");
      }
      onClose();
    } catch {
      ue.error(
        isEdit ? "Failed to update treatment" : "Failed to create treatment"
      );
    }
  };
  const isPending = createTreatment.isPending || updateTreatment.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: isEdit ? "Edit Treatment Plan" : "New Treatment Plan",
      description: isEdit ? "Update the treatment details below." : "Create a treatment plan for a patient.",
      size: "lg",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "data-ocid": "treatment_form.cancel_button",
            className: "h-9 px-4 border border-border rounded-lg text-sm hover:bg-muted transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleSubmit,
            disabled: isPending || !isValid,
            "data-ocid": "treatment_form.submit_button",
            className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors",
            children: isPending ? isEdit ? "Saving..." : "Creating..." : isEdit ? "Save Changes" : "Create Treatment"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Patient *",
              options: patientOptions,
              value: patientId,
              placeholder: "Select patient...",
              onChange: setPatientId,
              "data-ocid": "treatment_form.patient.select"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Dentist",
              options: doctorOptions,
              value: dentistId,
              placeholder: "Select dentist...",
              onChange: setDentistId,
              "data-ocid": "treatment_form.dentist.select"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Treatment Title *",
            value: title,
            onChange: (e) => setTitle(e.target.value),
            placeholder: "Root Canal Therapy, Crown Placement...",
            "data-ocid": "treatment_form.title.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Estimated Cost (₹)",
              type: "number",
              min: "0",
              value: estimatedCost,
              onChange: (e) => setEstimatedCost(e.target.value),
              "data-ocid": "treatment_form.cost.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Status",
              options: TREATMENT_STATUS_OPTIONS,
              value: status,
              onChange: (v) => setStatus(v),
              "data-ocid": "treatment_form.status.select"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "treatment-notes",
              className: "text-sm font-medium text-foreground",
              children: "Clinical Notes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "treatment-notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              rows: 3,
              "data-ocid": "treatment_form.notes.textarea",
              placeholder: "Clinical observations, special instructions...",
              className: "flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Tooth Procedures" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: addProcedure,
                "data-ocid": "treatment_form.add_procedure_button",
                className: "h-7 px-2.5 rounded-md text-xs font-medium bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-colors flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                  "Add Procedure"
                ]
              }
            )
          ] }),
          procedures.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg", children: 'No procedures added. Click "Add Procedure" to add tooth-specific procedures.' }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "space-y-3",
              "data-ocid": "treatment_form.procedure.list",
              children: procedures.map((proc, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bg-muted/20 border border-border rounded-lg p-3 space-y-3",
                  "data-ocid": `treatment_form.procedure.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          label: "Tooth #",
                          type: "number",
                          min: "1",
                          max: "85",
                          value: proc.tooth_number,
                          onChange: (e) => updateProcedure(i, "tooth_number", e.target.value),
                          placeholder: "e.g. 16",
                          "data-ocid": `treatment_form.procedure.tooth.input.${i + 1}`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Select,
                        {
                          label: "Procedure Type",
                          options: PROCEDURE_TYPE_OPTIONS,
                          value: proc.procedure_type,
                          onChange: (v) => updateProcedure(i, "procedure_type", v),
                          "data-ocid": `treatment_form.procedure.type.select.${i + 1}`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Select,
                        {
                          label: "Status",
                          options: PROC_STATUS_OPTIONS,
                          value: proc.status,
                          onChange: (v) => updateProcedure(i, "status", v),
                          "data-ocid": `treatment_form.procedure.status.select.${i + 1}`
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          label: "Notes",
                          value: proc.notes,
                          onChange: (e) => updateProcedure(i, "notes", e.target.value),
                          placeholder: "Procedure notes...",
                          "data-ocid": `treatment_form.procedure.notes.input.${i + 1}`
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => removeProcedure(i),
                          "data-ocid": `treatment_form.procedure.delete_button.${i + 1}`,
                          className: "h-9 w-9 flex items-center justify-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors",
                          "aria-label": "Remove procedure",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                        }
                      )
                    ] })
                  ]
                },
                `proc-${proc.tooth_number || "new"}-${proc.procedure_type}-${i}`
              ))
            }
          )
        ] })
      ] })
    }
  );
}
const STATUS_VARIANT_MAP$1 = {
  [TreatmentStatus.active]: "inProgress",
  [TreatmentStatus.completed]: "completed",
  [TreatmentStatus.cancelled]: "cancelled"
};
const PROC_STATUS_VARIANT_MAP = {
  [ProcedureStatus.planned]: "planned",
  [ProcedureStatus.inProgress]: "inProgress",
  [ProcedureStatus.completed]: "completed",
  [ProcedureStatus.cancelled]: "cancelled"
};
function ProcedureRow({
  proc,
  index,
  dentistName,
  onUpdateStatus,
  isUpdating
}) {
  const isDone = proc.status === ProcedureStatus.completed;
  const isCancelled = proc.status === ProcedureStatus.cancelled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-start gap-4 p-4 rounded-lg border transition-colors",
        isDone ? "bg-[oklch(0.65_0.17_155_/_0.06)] border-[oklch(0.65_0.17_155_/_0.2)]" : isCancelled ? "bg-muted/20 border-border opacity-60" : "bg-card border-border hover:border-primary/30"
      ),
      "data-ocid": `treatment_detail.procedure.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex flex-col items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: proc.tooth_number.toString() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Tooth" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground capitalize", children: proc.procedure_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusBadge,
              {
                status: PROC_STATUS_VARIANT_MAP[proc.status]
              }
            )
          ] }),
          proc.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: proc.notes }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Dr. ",
              dentistName
            ] }),
            proc.completed_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Completed:",
              " ",
              new Date(Number(proc.completed_at)).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })
            ] })
          ] })
        ] }),
        !isCancelled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-[oklch(0.65_0.17_155)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            disabled: isUpdating,
            onClick: () => onUpdateStatus(
              proc,
              proc.status === ProcedureStatus.planned ? ProcedureStatus.inProgress : ProcedureStatus.completed
            ),
            "data-ocid": `treatment_detail.procedure.status_button.${index + 1}`,
            className: cn(
              "flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium transition-colors border",
              proc.status === ProcedureStatus.planned ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20" : "bg-[oklch(0.65_0.17_155_/_0.1)] text-[oklch(0.65_0.17_155)] border-[oklch(0.65_0.17_155_/_0.3)] hover:bg-[oklch(0.65_0.17_155_/_0.2)]"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3 w-3" }),
              proc.status === ProcedureStatus.planned ? "Start" : "Complete"
            ]
          }
        ) })
      ]
    }
  );
}
function TreatmentDetailPage({
  treatmentId,
  onBack
}) {
  const [showEdit, setShowEdit] = reactExports.useState(false);
  const [toothModalOpen, setToothModalOpen] = reactExports.useState(false);
  const { data: treatment, isLoading } = useTreatment(treatmentId);
  const { data: patient } = usePatient((treatment == null ? void 0 : treatment.patient_id) ?? null);
  const { data: staffMembers } = useStaffMembers();
  const { data: patients } = usePatients();
  const updateTreatment = useUpdateTreatment();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  if (!treatment) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-7 w-7" }),
        title: "Treatment not found",
        description: "This treatment plan could not be loaded.",
        action: onBack ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onBack,
            className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium",
            children: "Go Back"
          }
        ) : void 0
      }
    );
  }
  const staffMap = new Map(
    (staffMembers ?? []).map((s) => [s.id.toString(), s.name])
  );
  const dentistName = staffMap.get(treatment.dentist_id.toString()) ?? "Unknown";
  const patientName = patient ? `${patient.first_name} ${patient.last_name}` : "—";
  const statusVariant = STATUS_VARIANT_MAP$1[treatment.status];
  const handleUpdateProcedureStatus = async (proc, newStatus) => {
    const updatedProcs = treatment.procedures.map(
      (p) => p.tooth_number === proc.tooth_number && p.procedure_type === proc.procedure_type ? {
        ...p,
        status: newStatus,
        completed_at: newStatus === ProcedureStatus.completed ? BigInt(Date.now()) : p.completed_at
      } : p
    );
    const input = {
      patient_id: treatment.patient_id,
      title: treatment.title,
      dentist_id: treatment.dentist_id,
      notes: treatment.notes,
      estimated_cost: treatment.estimated_cost,
      procedures: updatedProcs
    };
    try {
      await updateTreatment.mutateAsync({ id: treatment.id, input });
      ue.success("Procedure status updated");
    } catch {
      ue.error("Failed to update procedure");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "treatment_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: treatment.title,
        description: "Treatment plan details and procedures",
        breadcrumbs: onBack ? [
          { label: "Treatments", onClick: onBack },
          { label: treatment.title }
        ] : void 0,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          onBack && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: onBack,
              "data-ocid": "treatment_detail.back_button",
              className: "h-9 px-3 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowEdit(true),
              "data-ocid": "treatment_detail.edit_button",
              className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors",
              children: "Edit Treatment"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Patient" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: patientName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Dentist" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: dentistName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Est. Cost" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            "₹",
            treatment.estimated_cost.toLocaleString("en-IN")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: statusVariant })
        ] })
      ] }),
      treatment.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Clinical Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: treatment.notes })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold text-foreground", children: [
        "Procedures",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs font-normal text-muted-foreground", children: [
          "(",
          treatment.procedures.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setToothModalOpen(true),
          "data-ocid": "treatment_detail.add_procedure_button",
          className: "h-8 px-3 bg-accent/10 text-accent border border-accent/30 rounded-lg text-xs font-medium hover:bg-accent/20 transition-colors flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            "Add Procedure"
          ]
        }
      )
    ] }),
    treatment.procedures.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "h-7 w-7" }),
        title: "No procedures added",
        description: "Add tooth procedures to this treatment plan.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setToothModalOpen(true),
            className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium",
            children: "Add Procedure"
          }
        )
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "treatment_detail.procedure.list", children: treatment.procedures.map((proc, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProcedureRow,
      {
        proc,
        index: i,
        dentistName: staffMap.get(proc.dentist_id.toString()) ?? dentistName,
        onUpdateStatus: handleUpdateProcedureStatus,
        isUpdating: updateTreatment.isPending
      },
      `${proc.tooth_number}-${proc.procedure_type}-${i}`
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToothDetailModal,
      {
        open: toothModalOpen,
        onClose: () => setToothModalOpen(false),
        toothNumber: null,
        treatment,
        staffMembers: staffMembers ?? [],
        onSave: async (proc) => {
          const input = {
            patient_id: treatment.patient_id,
            title: treatment.title,
            dentist_id: treatment.dentist_id,
            notes: treatment.notes,
            estimated_cost: treatment.estimated_cost,
            procedures: [...treatment.procedures, proc]
          };
          await updateTreatment.mutateAsync({ id: treatment.id, input });
          ue.success("Procedure added");
          setToothModalOpen(false);
        }
      }
    ),
    showEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TreatmentFormModal,
      {
        open: showEdit,
        onClose: () => setShowEdit(false),
        patients: patients ?? [],
        staffMembers: staffMembers ?? [],
        treatment
      }
    )
  ] });
}
const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: TreatmentStatus.active, label: "In Progress" },
  { value: TreatmentStatus.completed, label: "Completed" },
  { value: TreatmentStatus.cancelled, label: "Cancelled" }
];
const STATUS_VARIANT_MAP = {
  [TreatmentStatus.active]: "inProgress",
  [TreatmentStatus.completed]: "completed",
  [TreatmentStatus.cancelled]: "cancelled"
};
function TreatmentsPage() {
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editTreatment, setEditTreatment] = reactExports.useState(null);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedTreatmentId, setSelectedTreatmentId] = reactExports.useState(
    null
  );
  const { data: treatments, isLoading } = useTreatments();
  const { data: patients } = usePatients();
  const { data: staffMembers } = useStaffMembers();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const patientMap = new Map(
    (patients ?? []).map((p) => [
      p.id.toString(),
      `${p.first_name} ${p.last_name}`
    ])
  );
  const staffMap = new Map(
    (staffMembers ?? []).map((s) => [s.id.toString(), s.name])
  );
  const filtered = (treatments ?? []).filter(
    (t) => statusFilter === "all" || t.status === statusFilter
  );
  const columns = [
    {
      key: "title",
      header: "Treatment Plan",
      render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground truncate", children: t.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          t.procedures.length,
          " procedure",
          t.procedures.length !== 1 ? "s" : ""
        ] })
      ] })
    },
    {
      key: "patient",
      header: "Patient",
      render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: patientMap.get(t.patient_id.toString()) ?? "—" })
    },
    {
      key: "dentist",
      header: "Dentist",
      render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: staffMap.get(t.dentist_id.toString()) ?? "—" })
    },
    {
      key: "estimated_cost",
      header: "Est. Cost",
      align: "right",
      render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-sm font-medium text-foreground", children: [
        "₹",
        t.estimated_cost.toLocaleString("en-IN")
      ] })
    },
    {
      key: "status",
      header: "Status",
      render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatusBadge,
        {
          status: STATUS_VARIANT_MAP[t.status]
        }
      )
    },
    {
      key: "actions",
      header: "",
      render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelectedTreatmentId(t.id),
            "data-ocid": "treatments.view_button",
            className: "text-xs text-primary hover:text-primary/80 font-medium transition-colors",
            children: "View"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setEditTreatment(t),
            "data-ocid": "treatments.edit_button",
            className: "text-xs text-muted-foreground hover:text-foreground font-medium transition-colors",
            children: "Edit"
          }
        )
      ] })
    }
  ];
  if (selectedTreatmentId !== null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TreatmentDetailPage,
      {
        treatmentId: selectedTreatmentId,
        onBack: () => setSelectedTreatmentId(null)
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "treatments.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Treatments",
        description: "Manage treatment plans and procedures",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowAdd(true),
            "data-ocid": "treatments.add_button",
            className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "New Treatment"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 mb-5",
        role: "tablist",
        "aria-label": "Status filters",
        children: [
          STATUS_FILTER_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": statusFilter === opt.value,
              onClick: () => setStatusFilter(opt.value),
              "data-ocid": `treatments.filter.${opt.value}`,
              className: cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-colors border",
                statusFilter === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              ),
              children: opt.label
            },
            opt.value
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
            filtered.length,
            " treatment",
            filtered.length !== 1 ? "s" : ""
          ] })
        ]
      }
    ),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-7 w-7" }),
        title: "No treatment plans",
        description: statusFilter === "all" ? "Create your first treatment plan to get started." : `No ${statusFilter} treatments found.`,
        action: statusFilter === "all" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowAdd(true),
            className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium",
            children: "New Treatment"
          }
        ) : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Table,
      {
        columns,
        data: filtered,
        keyExtractor: (t) => t.id.toString(),
        emptyMessage: "No treatments found",
        stickyHeader: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TreatmentFormModal,
      {
        open: showAdd,
        onClose: () => setShowAdd(false),
        patients: patients ?? [],
        staffMembers: staffMembers ?? []
      }
    ),
    editTreatment && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TreatmentFormModal,
      {
        open: !!editTreatment,
        onClose: () => setEditTreatment(null),
        patients: patients ?? [],
        staffMembers: staffMembers ?? [],
        treatment: editTreatment
      }
    )
  ] });
}
export {
  TreatmentsPage as default
};
