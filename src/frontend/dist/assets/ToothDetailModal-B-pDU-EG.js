import { r as reactExports, h as ProcedureStatus, j as jsxRuntimeExports, u as ue } from "./index-CRusxQeF.js";
import { M as Modal, I as Input, S as Select } from "./Select-Dw0AWwQu.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
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
  label: p.charAt(0).toUpperCase() + p.slice(1)
}));
const PROC_STATUS_OPTIONS = [
  { value: ProcedureStatus.planned, label: "Planned" },
  { value: ProcedureStatus.inProgress, label: "In Progress" },
  { value: ProcedureStatus.completed, label: "Completed" },
  { value: ProcedureStatus.cancelled, label: "Cancelled" }
];
const PROC_STATUS_VARIANT_MAP = {
  [ProcedureStatus.planned]: "planned",
  [ProcedureStatus.inProgress]: "inProgress",
  [ProcedureStatus.completed]: "completed",
  [ProcedureStatus.cancelled]: "cancelled"
};
function ToothDetailModal({
  open,
  onClose,
  toothNumber,
  treatment,
  staffMembers,
  onSave,
  existingProcedures = []
}) {
  const [selectedToothNum, setSelectedToothNum] = reactExports.useState(
    toothNumber !== null ? toothNumber.toString() : ""
  );
  const [procedureType, setProcedureType] = reactExports.useState("filling");
  const [status, setStatus] = reactExports.useState(
    ProcedureStatus.planned
  );
  const [notes, setNotes] = reactExports.useState("");
  const [dentistId, setDentistId] = reactExports.useState(
    (treatment == null ? void 0 : treatment.dentist_id.toString()) ?? ""
  );
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const doctorOptions = staffMembers.filter((s) => s.role === "doctor" || s.role === "admin").map((s) => ({ value: s.id.toString(), label: s.name }));
  const handleSave = async () => {
    const toothNum = toothNumber ?? Number(selectedToothNum);
    if (!Number.isInteger(toothNum) || toothNum < 1 || toothNum > 85) {
      ue.error("Please enter a valid tooth number (1–85)");
      return;
    }
    const proc = {
      tooth_number: BigInt(toothNum),
      procedure_type: procedureType,
      status,
      notes: notes.trim(),
      dentist_id: dentistId ? BigInt(dentistId) : BigInt(1),
      completed_at: status === ProcedureStatus.completed ? BigInt(Date.now()) : void 0
    };
    setIsSaving(true);
    try {
      await onSave(proc);
      setSelectedToothNum(toothNumber !== null ? toothNumber.toString() : "");
      setProcedureType("filling");
      setStatus(ProcedureStatus.planned);
      setNotes("");
    } finally {
      setIsSaving(false);
    }
  };
  const displayToothNum = toothNumber ?? (selectedToothNum ? Number(selectedToothNum) : null);
  const historyProcs = toothNumber !== null ? existingProcedures.filter((p) => Number(p.tooth_number) === toothNumber) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: displayToothNum ? `Tooth ${displayToothNum}` : "Add Procedure",
      description: displayToothNum ? `Mark a new procedure for tooth ${displayToothNum}` : "Select a tooth and add a procedure",
      size: "md",
      "data-ocid": "tooth_detail.dialog",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "data-ocid": "tooth_detail.cancel_button",
            className: "h-9 px-4 border border-border rounded-lg text-sm hover:bg-muted transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleSave,
            disabled: isSaving,
            "data-ocid": "tooth_detail.confirm_button",
            className: "h-9 px-4 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors",
            children: isSaving ? "Saving..." : "Save Procedure"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        toothNumber === null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Tooth Number",
            type: "number",
            min: "1",
            max: "85",
            value: selectedToothNum,
            onChange: (e) => setSelectedToothNum(e.target.value),
            placeholder: "e.g. 16 (FDI notation)",
            "data-ocid": "tooth_detail.tooth_number.input",
            hint: "FDI notation: upper right 11–18, upper left 21–28, lower left 31–38, lower right 41–48"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Procedure Type",
              options: PROCEDURE_TYPE_OPTIONS,
              value: procedureType,
              onChange: setProcedureType,
              "data-ocid": "tooth_detail.procedure_type.select"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Status",
              options: PROC_STATUS_OPTIONS,
              value: status,
              onChange: (v) => setStatus(v),
              "data-ocid": "tooth_detail.status.select"
            }
          )
        ] }),
        doctorOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            label: "Performing Dentist",
            options: doctorOptions,
            value: dentistId,
            placeholder: "Select dentist...",
            onChange: setDentistId,
            "data-ocid": "tooth_detail.dentist.select"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "tooth-notes",
              className: "text-sm font-medium text-foreground",
              children: "Notes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "tooth-notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              rows: 3,
              "data-ocid": "tooth_detail.notes.textarea",
              placeholder: "Procedure details, observations...",
              className: "flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            }
          )
        ] }),
        historyProcs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2", children: "Procedure History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "tooth_detail.history.list", children: historyProcs.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between py-2 px-3 bg-muted/20 rounded-lg",
              "data-ocid": `tooth_detail.history.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground capitalize", children: p.procedure_type }),
                  p.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-[200px]", children: p.notes })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatusBadge,
                  {
                    status: PROC_STATUS_VARIANT_MAP[p.status]
                  }
                )
              ]
            },
            `${p.procedure_type}-${i}`
          )) })
        ] })
      ] })
    }
  );
}
export {
  ToothDetailModal as T
};
