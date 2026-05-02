import { c as createLucideIcon, n as useActor, p as useQuery, o as useQueryClient, q as createActor, r as reactExports, j as jsxRuntimeExports, P as PageLoader, h as ProcedureStatus, i as cn, s as Grid3x3, t as ToothStatus, u as ue } from "./index-CRusxQeF.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { S as Select } from "./Select-Dw0AWwQu.js";
import { T as ToothDetailModal } from "./ToothDetailModal-B-pDU-EG.js";
import { u as usePatients } from "./usePatients-1jxdmde2.js";
import { u as useStaffMembers } from "./useStaff-B8FY4OEx.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
import { S as Save } from "./save-Bn-XkvOm.js";
import "./StatusBadge-De4IVkH2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
function useToothChart(patientId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["toothChart", patientId == null ? void 0 : patientId.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return null;
      return actor.getToothChart(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId
  });
}
function useUpsertToothChart() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      patientId,
      treatmentId,
      teeth
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.upsertToothChart(patientId, treatmentId, teeth);
    },
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: ["toothChart", patientId.toString()] });
    }
  });
}
const ADULT_TEETH = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
];
const CHILD_TEETH = [
  [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
];
const TOOTH_STATUS_STYLE = {
  [ToothStatus.healthy]: {
    bg: "bg-[oklch(0.65_0.17_155_/_0.15)]",
    border: "border-[oklch(0.65_0.17_155_/_0.5)]",
    text: "text-[oklch(0.65_0.17_155)]",
    legendLabel: "Healthy"
  },
  [ToothStatus.filled]: {
    bg: "bg-[oklch(0.74_0.16_78_/_0.2)]",
    border: "border-[oklch(0.74_0.16_78_/_0.6)]",
    text: "text-[oklch(0.74_0.16_78)]",
    legendLabel: "Filled"
  },
  [ToothStatus.crowned]: {
    bg: "bg-[oklch(0.62_0.18_200_/_0.2)]",
    border: "border-[oklch(0.62_0.18_200_/_0.6)]",
    text: "text-[oklch(0.62_0.18_200)]",
    legendLabel: "Crown"
  },
  [ToothStatus.decayed]: {
    bg: "bg-destructive/15",
    border: "border-destructive/60",
    text: "text-destructive",
    legendLabel: "Root Canal / Decay"
  },
  [ToothStatus.extracted]: {
    bg: "bg-muted/60",
    border: "border-muted-foreground/50",
    text: "text-muted-foreground",
    legendLabel: "Extracted"
  },
  [ToothStatus.missing]: {
    bg: "bg-transparent",
    border: "border-dashed border-muted-foreground/30",
    text: "text-muted-foreground/50",
    legendLabel: "Missing"
  },
  [ToothStatus.implant]: {
    bg: "bg-[oklch(0.56_0.15_105_/_0.2)]",
    border: "border-[oklch(0.56_0.15_105_/_0.6)]",
    text: "text-[oklch(0.56_0.15_105)]",
    legendLabel: "Implant"
  },
  [ToothStatus.other]: {
    bg: "bg-[oklch(0.62_0.18_200_/_0.08)]",
    border: "border-border",
    text: "text-muted-foreground",
    legendLabel: "Other Procedure"
  }
};
const LEGEND_ENTRIES = [
  ToothStatus.healthy,
  ToothStatus.filled,
  ToothStatus.crowned,
  ToothStatus.decayed,
  ToothStatus.extracted,
  ToothStatus.missing,
  ToothStatus.implant,
  ToothStatus.other
];
function ToothButton({ num, status, isSelected, onClick }) {
  const style = TOOTH_STATUS_STYLE[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      title: `Tooth ${num} — ${style.legendLabel}`,
      "data-ocid": `dental_chart.tooth.${num}`,
      className: cn(
        "w-10 h-10 rounded-lg border-2 text-xs font-bold transition-all duration-150 flex items-center justify-center",
        style.bg,
        style.border,
        style.text,
        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110 z-10 relative" : "hover:scale-105 hover:z-10 hover:relative"
      ),
      "aria-label": `Tooth ${num}, status: ${style.legendLabel}`,
      children: num
    }
  );
}
function DentalChartPage() {
  const [patientId, setPatientId] = reactExports.useState("");
  const [isAdult, setIsAdult] = reactExports.useState(true);
  const [selectedTooth, setSelectedTooth] = reactExports.useState(null);
  const [toothModalOpen, setToothModalOpen] = reactExports.useState(false);
  const [pendingChanges, setPendingChanges] = reactExports.useState(/* @__PURE__ */ new Map());
  const { data: patients, isLoading: pLoading } = usePatients();
  const { data: chart, isLoading: cLoading } = useToothChart(
    patientId ? BigInt(patientId) : null
  );
  const { data: staffMembers } = useStaffMembers();
  const upsert = useUpsertToothChart();
  if (pLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const patientOptions = (patients ?? []).map((p) => ({
    value: p.id.toString(),
    label: `${p.first_name} ${p.last_name}`
  }));
  const toothMap = /* @__PURE__ */ new Map();
  for (const t of (chart == null ? void 0 : chart.teeth) ?? []) {
    toothMap.set(Number(t.tooth_number), t);
  }
  const getToothStatus = (num) => {
    var _a;
    return pendingChanges.get(num) ?? ((_a = toothMap.get(num)) == null ? void 0 : _a.status) ?? ToothStatus.healthy;
  };
  const teethLayout = isAdult ? ADULT_TEETH : CHILD_TEETH;
  const hasPendingChanges = pendingChanges.size > 0;
  const handleToothClick = (num) => {
    setSelectedTooth(num);
    setToothModalOpen(true);
  };
  const handleProcedureSave = async (proc) => {
    if (!patientId) return;
    const toothNum = Number(proc.tooth_number);
    const typeToStatus = {
      filling: ToothStatus.filled,
      crown: ToothStatus.crowned,
      "root canal": ToothStatus.decayed,
      extraction: ToothStatus.extracted,
      implant: ToothStatus.implant
    };
    const newStatus = typeToStatus[proc.procedure_type] ?? ToothStatus.other;
    setPendingChanges((prev) => new Map(prev).set(toothNum, newStatus));
    ue.success(`Tooth ${toothNum} marked — click "Save Chart" to persist`, {
      duration: 3e3
    });
    setToothModalOpen(false);
    setSelectedTooth(null);
  };
  const handleSaveChart = async () => {
    if (!patientId || pendingChanges.size === 0) return;
    const existing = new Map(
      ((chart == null ? void 0 : chart.teeth) ?? []).map((t) => [Number(t.tooth_number), t])
    );
    for (const [toothNum, status] of pendingChanges.entries()) {
      existing.set(toothNum, {
        tooth_number: BigInt(toothNum),
        status,
        dentist_id: BigInt(1),
        last_updated: BigInt(Date.now())
      });
    }
    try {
      await upsert.mutateAsync({
        patientId: BigInt(patientId),
        treatmentId: null,
        teeth: Array.from(existing.values())
      });
      setPendingChanges(/* @__PURE__ */ new Map());
      ue.success("Dental chart saved successfully");
    } catch {
      ue.error("Failed to save chart");
    }
  };
  const existingProcs = [];
  for (const entry of toothMap.values()) {
    if (entry.procedure_type) {
      existingProcs.push({
        tooth_number: entry.tooth_number,
        procedure_type: entry.procedure_type,
        status: ProcedureStatus.completed,
        notes: "",
        dentist_id: entry.dentist_id,
        completed_at: entry.last_updated
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dental_chart.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Dental Charting",
        description: "Interactive digital tooth diagram — FDI notation",
        actions: hasPendingChanges && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleSaveChart,
            disabled: upsert.isPending,
            "data-ocid": "dental_chart.save_button",
            className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
              upsert.isPending ? "Saving..." : `Save Chart (${pendingChanges.size})`
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Select,
        {
          label: "Patient",
          options: patientOptions,
          value: patientId,
          placeholder: "Select a patient...",
          onChange: (v) => {
            setPatientId(v);
            setPendingChanges(/* @__PURE__ */ new Map());
            setSelectedTooth(null);
          },
          "data-ocid": "dental_chart.patient.select"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-muted rounded-lg p-1 self-end mb-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setIsAdult(true),
            "data-ocid": "dental_chart.adult.toggle",
            className: cn(
              "h-7 px-3 rounded-md text-xs font-medium transition-colors",
              isAdult ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            ),
            children: "Adult (32)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setIsAdult(false),
            "data-ocid": "dental_chart.child.toggle",
            className: cn(
              "h-7 px-3 rounded-md text-xs font-medium transition-colors",
              !isAdult ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            ),
            children: "Child (20)"
          }
        )
      ] }),
      hasPendingChanges && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "self-end mb-1 flex items-center gap-1.5 text-xs text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }),
        pendingChanges.size,
        " unsaved change",
        pendingChanges.size !== 1 ? "s" : ""
      ] })
    ] }),
    !patientId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "h-7 w-7" }),
        title: "Select a patient",
        description: "Choose a patient above to view or edit their dental chart."
      }
    ) : cLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground px-2 uppercase tracking-widest", children: "Upper Jaw" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 flex-wrap", children: teethLayout[0].map((num) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToothButton,
              {
                num,
                status: getToothStatus(num),
                isSelected: selectedTooth === num,
                onClick: () => handleToothClick(num)
              },
              num
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 border-t border-dashed border-border/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50 uppercase tracking-widest", children: "Gum Line" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 border-t border-dashed border-border/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 flex-wrap", children: teethLayout[1].map((num) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToothButton,
              {
                num,
                status: getToothStatus(num),
                isSelected: selectedTooth === num,
                onClick: () => handleToothClick(num)
              },
              num
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground px-2 uppercase tracking-widest", children: "Lower Jaw" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-5 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 text-center", children: "Color Key" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-x-5 gap-y-2 justify-center", children: LEGEND_ENTRIES.map((status) => {
            const style = TOOTH_STATUS_STYLE[status];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "h-3.5 w-3.5 rounded border-2",
                    style.bg,
                    style.border
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: style.legendLabel })
            ] }, status);
          }) })
        ] })
      ] }),
      chart && chart.teeth.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-4 gap-3",
          "data-ocid": "dental_chart.stats.panel",
          children: [
            {
              label: "Total Charted",
              value: chart.teeth.length,
              color: "text-foreground"
            },
            {
              label: "Treated",
              value: chart.teeth.filter(
                (t) => t.status !== ToothStatus.healthy && t.status !== ToothStatus.missing
              ).length,
              color: "text-primary"
            },
            {
              label: "Healthy",
              value: chart.teeth.filter(
                (t) => t.status === ToothStatus.healthy
              ).length,
              color: "text-[oklch(0.65_0.17_155)]"
            },
            {
              label: "Missing/Extracted",
              value: chart.teeth.filter(
                (t) => t.status === ToothStatus.missing || t.status === ToothStatus.extracted
              ).length,
              color: "text-muted-foreground"
            }
          ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-lg p-3 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-xl font-bold font-display", color), children: value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
              ]
            },
            label
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToothDetailModal,
      {
        open: toothModalOpen,
        onClose: () => {
          setToothModalOpen(false);
          setSelectedTooth(null);
        },
        toothNumber: selectedTooth,
        treatment: null,
        staffMembers: staffMembers ?? [],
        onSave: handleProcedureSave,
        existingProcedures: existingProcs
      }
    )
  ] });
}
export {
  DentalChartPage as default
};
