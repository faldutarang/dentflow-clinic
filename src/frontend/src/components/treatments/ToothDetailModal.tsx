import { useState } from "react";
import { toast } from "sonner";
import { ProcedureStatus } from "../../types";
import type { StaffMember, ToothProcedure, Treatment } from "../../types";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Select } from "../shared/Select";
import { StatusBadge } from "../shared/StatusBadge";

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
  "other",
];

const PROCEDURE_TYPE_OPTIONS = PROCEDURE_TYPES.map((p) => ({
  value: p,
  label: p.charAt(0).toUpperCase() + p.slice(1),
}));

const PROC_STATUS_OPTIONS = [
  { value: ProcedureStatus.planned, label: "Planned" },
  { value: ProcedureStatus.inProgress, label: "In Progress" },
  { value: ProcedureStatus.completed, label: "Completed" },
  { value: ProcedureStatus.cancelled, label: "Cancelled" },
];

const PROC_STATUS_VARIANT_MAP: Record<ProcedureStatus, string> = {
  [ProcedureStatus.planned]: "planned",
  [ProcedureStatus.inProgress]: "inProgress",
  [ProcedureStatus.completed]: "completed",
  [ProcedureStatus.cancelled]: "cancelled",
};

interface ToothDetailModalProps {
  open: boolean;
  onClose: () => void;
  /** Tooth number — null means "any tooth" (pick tooth in form) */
  toothNumber: number | null;
  treatment: Treatment | null;
  staffMembers: StaffMember[];
  onSave: (proc: ToothProcedure) => Promise<void>;
  /** Existing procedures for this tooth, for history display */
  existingProcedures?: ToothProcedure[];
}

export function ToothDetailModal({
  open,
  onClose,
  toothNumber,
  treatment,
  staffMembers,
  onSave,
  existingProcedures = [],
}: ToothDetailModalProps) {
  const [selectedToothNum, setSelectedToothNum] = useState(
    toothNumber !== null ? toothNumber.toString() : "",
  );
  const [procedureType, setProcedureType] = useState("filling");
  const [status, setStatus] = useState<ProcedureStatus>(
    ProcedureStatus.planned,
  );
  const [notes, setNotes] = useState("");
  const [dentistId, setDentistId] = useState(
    treatment?.dentist_id.toString() ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);

  const doctorOptions = staffMembers
    .filter((s) => s.role === "doctor" || s.role === "admin")
    .map((s) => ({ value: s.id.toString(), label: s.name }));

  const handleSave = async () => {
    const toothNum = toothNumber ?? Number(selectedToothNum);
    if (!Number.isInteger(toothNum) || toothNum < 1 || toothNum > 85) {
      toast.error("Please enter a valid tooth number (1–85)");
      return;
    }

    const proc: ToothProcedure = {
      tooth_number: BigInt(toothNum),
      procedure_type: procedureType,
      status,
      notes: notes.trim(),
      dentist_id: dentistId ? BigInt(dentistId) : BigInt(1),
      completed_at:
        status === ProcedureStatus.completed ? BigInt(Date.now()) : undefined,
    };

    setIsSaving(true);
    try {
      await onSave(proc);
      // Reset form
      setSelectedToothNum(toothNumber !== null ? toothNumber.toString() : "");
      setProcedureType("filling");
      setStatus(ProcedureStatus.planned);
      setNotes("");
    } finally {
      setIsSaving(false);
    }
  };

  const displayToothNum =
    toothNumber ?? (selectedToothNum ? Number(selectedToothNum) : null);
  const historyProcs =
    toothNumber !== null
      ? existingProcedures.filter((p) => Number(p.tooth_number) === toothNumber)
      : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={displayToothNum ? `Tooth ${displayToothNum}` : "Add Procedure"}
      description={
        displayToothNum
          ? `Mark a new procedure for tooth ${displayToothNum}`
          : "Select a tooth and add a procedure"
      }
      size="md"
      data-ocid="tooth_detail.dialog"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            data-ocid="tooth_detail.cancel_button"
            className="h-9 px-4 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="tooth_detail.confirm_button"
            className="h-9 px-4 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving..." : "Save Procedure"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Tooth number input (only when not pre-selected) */}
        {toothNumber === null && (
          <Input
            label="Tooth Number"
            type="number"
            min="1"
            max="85"
            value={selectedToothNum}
            onChange={(e) => setSelectedToothNum(e.target.value)}
            placeholder="e.g. 16 (FDI notation)"
            data-ocid="tooth_detail.tooth_number.input"
            hint="FDI notation: upper right 11–18, upper left 21–28, lower left 31–38, lower right 41–48"
          />
        )}

        {/* Procedure type + status */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Procedure Type"
            options={PROCEDURE_TYPE_OPTIONS}
            value={procedureType}
            onChange={setProcedureType}
            data-ocid="tooth_detail.procedure_type.select"
          />
          <Select
            label="Status"
            options={PROC_STATUS_OPTIONS}
            value={status}
            onChange={(v) => setStatus(v as ProcedureStatus)}
            data-ocid="tooth_detail.status.select"
          />
        </div>

        {/* Dentist */}
        {doctorOptions.length > 0 && (
          <Select
            label="Performing Dentist"
            options={doctorOptions}
            value={dentistId}
            placeholder="Select dentist..."
            onChange={setDentistId}
            data-ocid="tooth_detail.dentist.select"
          />
        )}

        {/* Notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="tooth-notes"
            className="text-sm font-medium text-foreground"
          >
            Notes
          </label>
          <textarea
            id="tooth-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            data-ocid="tooth_detail.notes.textarea"
            placeholder="Procedure details, observations..."
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* History */}
        {historyProcs.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Procedure History
            </p>
            <div className="space-y-2" data-ocid="tooth_detail.history.list">
              {historyProcs.map((p, i) => (
                <div
                  key={`${p.procedure_type}-${i}`}
                  className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded-lg"
                  data-ocid={`tooth_detail.history.item.${i + 1}`}
                >
                  <div>
                    <p className="text-xs font-medium text-foreground capitalize">
                      {p.procedure_type}
                    </p>
                    {p.notes && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {p.notes}
                      </p>
                    )}
                  </div>
                  <StatusBadge
                    status={
                      PROC_STATUS_VARIANT_MAP[p.status] as Parameters<
                        typeof StatusBadge
                      >[0]["status"]
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
