import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ClipboardList,
  Plus,
  Smile,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../components/layout/PageHeader";
import { EmptyState } from "../components/shared/EmptyState";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ToothDetailModal } from "../components/treatments/ToothDetailModal";
import { TreatmentFormModal } from "../components/treatments/TreatmentFormModal";
import { usePatient } from "../hooks/usePatients";
import { usePatients } from "../hooks/usePatients";
import { useStaffMembers } from "../hooks/useStaff";
import { useTreatment, useUpdateTreatment } from "../hooks/useTreatments";
import { ProcedureStatus, TreatmentStatus } from "../types";
import type { ToothProcedure, Treatment, TreatmentInput } from "../types";

interface TreatmentDetailPageProps {
  treatmentId: bigint;
  onBack?: () => void;
}

const STATUS_VARIANT_MAP: Record<TreatmentStatus, string> = {
  [TreatmentStatus.active]: "inProgress",
  [TreatmentStatus.completed]: "completed",
  [TreatmentStatus.cancelled]: "cancelled",
};

const PROC_STATUS_VARIANT_MAP: Record<ProcedureStatus, string> = {
  [ProcedureStatus.planned]: "planned",
  [ProcedureStatus.inProgress]: "inProgress",
  [ProcedureStatus.completed]: "completed",
  [ProcedureStatus.cancelled]: "cancelled",
};

function ProcedureRow({
  proc,
  index,
  dentistName,
  onUpdateStatus,
  isUpdating,
}: {
  proc: ToothProcedure;
  index: number;
  dentistName: string;
  onUpdateStatus: (proc: ToothProcedure, status: ProcedureStatus) => void;
  isUpdating: boolean;
}) {
  const isDone = proc.status === ProcedureStatus.completed;
  const isCancelled = proc.status === ProcedureStatus.cancelled;

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border transition-colors",
        isDone
          ? "bg-[oklch(0.65_0.17_155_/_0.06)] border-[oklch(0.65_0.17_155_/_0.2)]"
          : isCancelled
            ? "bg-muted/20 border-border opacity-60"
            : "bg-card border-border hover:border-primary/30",
      )}
      data-ocid={`treatment_detail.procedure.item.${index + 1}`}
    >
      {/* Tooth badge */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {proc.tooth_number.toString()}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">Tooth</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-foreground capitalize">
            {proc.procedure_type}
          </span>
          <StatusBadge
            status={
              PROC_STATUS_VARIANT_MAP[proc.status] as Parameters<
                typeof StatusBadge
              >[0]["status"]
            }
          />
        </div>
        {proc.notes && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {proc.notes}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>Dr. {dentistName}</span>
          {proc.completed_at && (
            <span>
              Completed:{" "}
              {new Date(Number(proc.completed_at)).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Status action */}
      {!isCancelled && (
        <div className="flex-shrink-0">
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-[oklch(0.65_0.17_155)]" />
          ) : (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onUpdateStatus(
                  proc,
                  proc.status === ProcedureStatus.planned
                    ? ProcedureStatus.inProgress
                    : ProcedureStatus.completed,
                )
              }
              data-ocid={`treatment_detail.procedure.status_button.${index + 1}`}
              className={cn(
                "flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium transition-colors border",
                proc.status === ProcedureStatus.planned
                  ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                  : "bg-[oklch(0.65_0.17_155_/_0.1)] text-[oklch(0.65_0.17_155)] border-[oklch(0.65_0.17_155_/_0.3)] hover:bg-[oklch(0.65_0.17_155_/_0.2)]",
              )}
            >
              <Circle className="h-3 w-3" />
              {proc.status === ProcedureStatus.planned ? "Start" : "Complete"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TreatmentDetailPage({
  treatmentId,
  onBack,
}: TreatmentDetailPageProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [toothModalOpen, setToothModalOpen] = useState(false);

  const { data: treatment, isLoading } = useTreatment(treatmentId);
  const { data: patient } = usePatient(treatment?.patient_id ?? null);
  const { data: staffMembers } = useStaffMembers();
  const { data: patients } = usePatients();
  const updateTreatment = useUpdateTreatment();

  if (isLoading) return <PageLoader />;
  if (!treatment) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-7 w-7" />}
        title="Treatment not found"
        description="This treatment plan could not be loaded."
        action={
          onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Go Back
            </button>
          ) : undefined
        }
      />
    );
  }

  const staffMap = new Map(
    (staffMembers ?? []).map((s) => [s.id.toString(), s.name]),
  );
  const dentistName =
    staffMap.get(treatment.dentist_id.toString()) ?? "Unknown";
  const patientName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : "—";
  const statusVariant = STATUS_VARIANT_MAP[treatment.status] as Parameters<
    typeof StatusBadge
  >[0]["status"];

  const handleUpdateProcedureStatus = async (
    proc: ToothProcedure,
    newStatus: ProcedureStatus,
  ) => {
    const updatedProcs = treatment.procedures.map((p) =>
      p.tooth_number === proc.tooth_number &&
      p.procedure_type === proc.procedure_type
        ? {
            ...p,
            status: newStatus,
            completed_at:
              newStatus === ProcedureStatus.completed
                ? BigInt(Date.now())
                : p.completed_at,
          }
        : p,
    );
    const input: TreatmentInput = {
      patient_id: treatment.patient_id,
      title: treatment.title,
      dentist_id: treatment.dentist_id,
      notes: treatment.notes,
      estimated_cost: treatment.estimated_cost,
      procedures: updatedProcs,
    };
    try {
      await updateTreatment.mutateAsync({ id: treatment.id, input });
      toast.success("Procedure status updated");
    } catch {
      toast.error("Failed to update procedure");
    }
  };

  return (
    <div data-ocid="treatment_detail.page">
      <PageHeader
        title={treatment.title}
        description="Treatment plan details and procedures"
        breadcrumbs={
          onBack
            ? [
                { label: "Treatments", onClick: onBack },
                { label: treatment.title },
              ]
            : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                data-ocid="treatment_detail.back_button"
                className="h-9 px-3 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowEdit(true)}
              data-ocid="treatment_detail.edit_button"
              className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Edit Treatment
            </button>
          </div>
        }
      />

      {/* Treatment header card */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Patient
            </p>
            <p className="text-sm font-semibold text-foreground">
              {patientName}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Dentist
            </p>
            <p className="text-sm font-semibold text-foreground">
              {dentistName}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Est. Cost
            </p>
            <p className="text-sm font-semibold text-foreground">
              ₹{treatment.estimated_cost.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Status
            </p>
            <StatusBadge status={statusVariant} />
          </div>
        </div>

        {treatment.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Clinical Notes
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {treatment.notes}
            </p>
          </div>
        )}
      </div>

      {/* Procedures */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Procedures
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({treatment.procedures.length})
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setToothModalOpen(true)}
          data-ocid="treatment_detail.add_procedure_button"
          className="h-8 px-3 bg-accent/10 text-accent border border-accent/30 rounded-lg text-xs font-medium hover:bg-accent/20 transition-colors flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Procedure
        </button>
      </div>

      {treatment.procedures.length === 0 ? (
        <EmptyState
          icon={<Smile className="h-7 w-7" />}
          title="No procedures added"
          description="Add tooth procedures to this treatment plan."
          action={
            <button
              type="button"
              onClick={() => setToothModalOpen(true)}
              className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Add Procedure
            </button>
          }
        />
      ) : (
        <div className="space-y-3" data-ocid="treatment_detail.procedure.list">
          {treatment.procedures.map((proc, i) => (
            <ProcedureRow
              key={`${proc.tooth_number}-${proc.procedure_type}-${i}`}
              proc={proc}
              index={i}
              dentistName={
                staffMap.get(proc.dentist_id.toString()) ?? dentistName
              }
              onUpdateStatus={handleUpdateProcedureStatus}
              isUpdating={updateTreatment.isPending}
            />
          ))}
        </div>
      )}

      {/* Add Procedure via ToothDetailModal */}
      <ToothDetailModal
        open={toothModalOpen}
        onClose={() => setToothModalOpen(false)}
        toothNumber={null}
        treatment={treatment}
        staffMembers={staffMembers ?? []}
        onSave={async (proc) => {
          const input: TreatmentInput = {
            patient_id: treatment.patient_id,
            title: treatment.title,
            dentist_id: treatment.dentist_id,
            notes: treatment.notes,
            estimated_cost: treatment.estimated_cost,
            procedures: [...treatment.procedures, proc],
          };
          await updateTreatment.mutateAsync({ id: treatment.id, input });
          toast.success("Procedure added");
          setToothModalOpen(false);
        }}
      />

      {showEdit && (
        <TreatmentFormModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          patients={patients ?? []}
          staffMembers={staffMembers ?? []}
          treatment={treatment}
        />
      )}
    </div>
  );
}
