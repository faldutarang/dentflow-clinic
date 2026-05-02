import { cn } from "@/lib/utils";
import { Grid3X3, Info, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../components/layout/PageHeader";
import { EmptyState } from "../components/shared/EmptyState";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { Select } from "../components/shared/Select";
import { ToothDetailModal } from "../components/treatments/ToothDetailModal";
import { usePatients } from "../hooks/usePatients";
import { useStaffMembers } from "../hooks/useStaff";
import { useToothChart, useUpsertToothChart } from "../hooks/useToothChart";
import { ProcedureStatus, ToothStatus } from "../types";
import type { ToothEntry, ToothProcedure } from "../types";

// Adult FDI notation (32 teeth), child primary dentition (20 teeth)
const ADULT_TEETH: [number[], number[]] = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
];

const CHILD_TEETH: [number[], number[]] = [
  [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
];

// Status colors — tooth chart color coding per design spec
const TOOTH_STATUS_STYLE: Record<
  ToothStatus,
  { bg: string; border: string; text: string; legendLabel: string }
> = {
  [ToothStatus.healthy]: {
    bg: "bg-[oklch(0.65_0.17_155_/_0.15)]",
    border: "border-[oklch(0.65_0.17_155_/_0.5)]",
    text: "text-[oklch(0.65_0.17_155)]",
    legendLabel: "Healthy",
  },
  [ToothStatus.filled]: {
    bg: "bg-[oklch(0.74_0.16_78_/_0.2)]",
    border: "border-[oklch(0.74_0.16_78_/_0.6)]",
    text: "text-[oklch(0.74_0.16_78)]",
    legendLabel: "Filled",
  },
  [ToothStatus.crowned]: {
    bg: "bg-[oklch(0.62_0.18_200_/_0.2)]",
    border: "border-[oklch(0.62_0.18_200_/_0.6)]",
    text: "text-[oklch(0.62_0.18_200)]",
    legendLabel: "Crown",
  },
  [ToothStatus.decayed]: {
    bg: "bg-destructive/15",
    border: "border-destructive/60",
    text: "text-destructive",
    legendLabel: "Root Canal / Decay",
  },
  [ToothStatus.extracted]: {
    bg: "bg-muted/60",
    border: "border-muted-foreground/50",
    text: "text-muted-foreground",
    legendLabel: "Extracted",
  },
  [ToothStatus.missing]: {
    bg: "bg-transparent",
    border: "border-dashed border-muted-foreground/30",
    text: "text-muted-foreground/50",
    legendLabel: "Missing",
  },
  [ToothStatus.implant]: {
    bg: "bg-[oklch(0.56_0.15_105_/_0.2)]",
    border: "border-[oklch(0.56_0.15_105_/_0.6)]",
    text: "text-[oklch(0.56_0.15_105)]",
    legendLabel: "Implant",
  },
  [ToothStatus.other]: {
    bg: "bg-[oklch(0.62_0.18_200_/_0.08)]",
    border: "border-border",
    text: "text-muted-foreground",
    legendLabel: "Other Procedure",
  },
};

const LEGEND_ENTRIES: ToothStatus[] = [
  ToothStatus.healthy,
  ToothStatus.filled,
  ToothStatus.crowned,
  ToothStatus.decayed,
  ToothStatus.extracted,
  ToothStatus.missing,
  ToothStatus.implant,
  ToothStatus.other,
];

interface ToothButtonProps {
  num: number;
  status: ToothStatus;
  isSelected: boolean;
  onClick: () => void;
}

function ToothButton({ num, status, isSelected, onClick }: ToothButtonProps) {
  const style = TOOTH_STATUS_STYLE[status];
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Tooth ${num} — ${style.legendLabel}`}
      data-ocid={`dental_chart.tooth.${num}`}
      className={cn(
        "w-10 h-10 rounded-lg border-2 text-xs font-bold transition-all duration-150 flex items-center justify-center",
        style.bg,
        style.border,
        style.text,
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110 z-10 relative"
          : "hover:scale-105 hover:z-10 hover:relative",
      )}
      aria-label={`Tooth ${num}, status: ${style.legendLabel}`}
    >
      {num}
    </button>
  );
}

export default function DentalChartPage() {
  const [patientId, setPatientId] = useState("");
  const [isAdult, setIsAdult] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [toothModalOpen, setToothModalOpen] = useState(false);
  // Local override map: toothNum → status (before saving)
  const [pendingChanges, setPendingChanges] = useState<
    Map<number, ToothStatus>
  >(new Map());

  const { data: patients, isLoading: pLoading } = usePatients();
  const { data: chart, isLoading: cLoading } = useToothChart(
    patientId ? BigInt(patientId) : null,
  );
  const { data: staffMembers } = useStaffMembers();
  const upsert = useUpsertToothChart();

  if (pLoading) return <PageLoader />;

  const patientOptions = (patients ?? []).map((p) => ({
    value: p.id.toString(),
    label: `${p.first_name} ${p.last_name}`,
  }));

  const toothMap = new Map<number, ToothEntry>();
  for (const t of chart?.teeth ?? []) {
    toothMap.set(Number(t.tooth_number), t);
  }

  const getToothStatus = (num: number): ToothStatus =>
    pendingChanges.get(num) ?? toothMap.get(num)?.status ?? ToothStatus.healthy;

  const teethLayout = isAdult ? ADULT_TEETH : CHILD_TEETH;
  const hasPendingChanges = pendingChanges.size > 0;

  const handleToothClick = (num: number) => {
    setSelectedTooth(num);
    setToothModalOpen(true);
  };

  const handleProcedureSave = async (proc: ToothProcedure) => {
    if (!patientId) return;
    const toothNum = Number(proc.tooth_number);

    // Map procedure type to tooth status
    const typeToStatus: Record<string, ToothStatus> = {
      filling: ToothStatus.filled,
      crown: ToothStatus.crowned,
      "root canal": ToothStatus.decayed,
      extraction: ToothStatus.extracted,
      implant: ToothStatus.implant,
    };
    const newStatus = typeToStatus[proc.procedure_type] ?? ToothStatus.other;

    // Stage the change locally
    setPendingChanges((prev) => new Map(prev).set(toothNum, newStatus));
    toast.success(`Tooth ${toothNum} marked — click "Save Chart" to persist`, {
      duration: 3000,
    });
    setToothModalOpen(false);
    setSelectedTooth(null);
  };

  const handleSaveChart = async () => {
    if (!patientId || pendingChanges.size === 0) return;
    const existing = new Map<number, ToothEntry>(
      (chart?.teeth ?? []).map((t) => [Number(t.tooth_number), t]),
    );

    for (const [toothNum, status] of pendingChanges.entries()) {
      existing.set(toothNum, {
        tooth_number: BigInt(toothNum),
        status,
        dentist_id: BigInt(1),
        last_updated: BigInt(Date.now()),
      });
    }

    try {
      await upsert.mutateAsync({
        patientId: BigInt(patientId),
        treatmentId: null,
        teeth: Array.from(existing.values()),
      });
      setPendingChanges(new Map());
      toast.success("Dental chart saved successfully");
    } catch {
      toast.error("Failed to save chart");
    }
  };

  // Derive existing procs from chart for ToothDetailModal history
  const existingProcs: ToothProcedure[] = [];
  for (const entry of toothMap.values()) {
    if (entry.procedure_type) {
      existingProcs.push({
        tooth_number: entry.tooth_number,
        procedure_type: entry.procedure_type,
        status: ProcedureStatus.completed,
        notes: "",
        dentist_id: entry.dentist_id,
        completed_at: entry.last_updated,
      });
    }
  }

  return (
    <div data-ocid="dental_chart.page">
      <PageHeader
        title="Dental Charting"
        description="Interactive digital tooth diagram — FDI notation"
        actions={
          hasPendingChanges && (
            <button
              type="button"
              onClick={handleSaveChart}
              disabled={upsert.isPending}
              data-ocid="dental_chart.save_button"
              className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {upsert.isPending
                ? "Saving..."
                : `Save Chart (${pendingChanges.size})`}
            </button>
          )
        }
      />

      {/* Controls bar */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="w-64">
          <Select
            label="Patient"
            options={patientOptions}
            value={patientId}
            placeholder="Select a patient..."
            onChange={(v) => {
              setPatientId(v);
              setPendingChanges(new Map());
              setSelectedTooth(null);
            }}
            data-ocid="dental_chart.patient.select"
          />
        </div>

        {/* Adult / Child toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1 self-end mb-0.5">
          <button
            type="button"
            onClick={() => setIsAdult(true)}
            data-ocid="dental_chart.adult.toggle"
            className={cn(
              "h-7 px-3 rounded-md text-xs font-medium transition-colors",
              isAdult
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Adult (32)
          </button>
          <button
            type="button"
            onClick={() => setIsAdult(false)}
            data-ocid="dental_chart.child.toggle"
            className={cn(
              "h-7 px-3 rounded-md text-xs font-medium transition-colors",
              !isAdult
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Child (20)
          </button>
        </div>

        {hasPendingChanges && (
          <div className="self-end mb-1 flex items-center gap-1.5 text-xs text-primary">
            <Info className="h-3.5 w-3.5" />
            {pendingChanges.size} unsaved change
            {pendingChanges.size !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {!patientId ? (
        <EmptyState
          icon={<Grid3X3 className="h-7 w-7" />}
          title="Select a patient"
          description="Choose a patient above to view or edit their dental chart."
        />
      ) : cLoading ? (
        <PageLoader />
      ) : (
        <div className="space-y-6">
          {/* Chart diagram */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="space-y-8">
              {/* Upper jaw label */}
              <div>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-medium text-muted-foreground px-2 uppercase tracking-widest">
                    Upper Jaw
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {teethLayout[0].map((num) => (
                    <ToothButton
                      key={num}
                      num={num}
                      status={getToothStatus(num)}
                      isSelected={selectedTooth === num}
                      onClick={() => handleToothClick(num)}
                    />
                  ))}
                </div>
              </div>

              {/* Gum divider */}
              <div className="flex items-center justify-center gap-2">
                <div className="flex-1 border-t border-dashed border-border/50" />
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                  Gum Line
                </span>
                <div className="flex-1 border-t border-dashed border-border/50" />
              </div>

              {/* Lower jaw */}
              <div>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {teethLayout[1].map((num) => (
                    <ToothButton
                      key={num}
                      num={num}
                      status={getToothStatus(num)}
                      isSelected={selectedTooth === num}
                      onClick={() => handleToothClick(num)}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-medium text-muted-foreground px-2 uppercase tracking-widest">
                    Lower Jaw
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 text-center">
                Color Key
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
                {LEGEND_ENTRIES.map((status) => {
                  const style = TOOTH_STATUS_STYLE[status];
                  return (
                    <div key={status} className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "h-3.5 w-3.5 rounded border-2",
                          style.bg,
                          style.border,
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {style.legendLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats summary */}
          {chart && chart.teeth.length > 0 && (
            <div
              className="grid grid-cols-4 gap-3"
              data-ocid="dental_chart.stats.panel"
            >
              {[
                {
                  label: "Total Charted",
                  value: chart.teeth.length,
                  color: "text-foreground",
                },
                {
                  label: "Treated",
                  value: chart.teeth.filter(
                    (t) =>
                      t.status !== ToothStatus.healthy &&
                      t.status !== ToothStatus.missing,
                  ).length,
                  color: "text-primary",
                },
                {
                  label: "Healthy",
                  value: chart.teeth.filter(
                    (t) => t.status === ToothStatus.healthy,
                  ).length,
                  color: "text-[oklch(0.65_0.17_155)]",
                },
                {
                  label: "Missing/Extracted",
                  value: chart.teeth.filter(
                    (t) =>
                      t.status === ToothStatus.missing ||
                      t.status === ToothStatus.extracted,
                  ).length,
                  color: "text-muted-foreground",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-lg p-3 text-center"
                >
                  <p className={cn("text-xl font-bold font-display", color)}>
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tooth Detail Modal */}
      <ToothDetailModal
        open={toothModalOpen}
        onClose={() => {
          setToothModalOpen(false);
          setSelectedTooth(null);
        }}
        toothNumber={selectedTooth}
        treatment={null}
        staffMembers={staffMembers ?? []}
        onSave={handleProcedureSave}
        existingProcedures={existingProcs}
      />
    </div>
  );
}
