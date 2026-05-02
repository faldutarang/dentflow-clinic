import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateTreatment,
  useUpdateTreatment,
} from "../../hooks/useTreatments";
import { ProcedureStatus, TreatmentStatus } from "../../types";
import type {
  Patient,
  StaffMember,
  ToothProcedure,
  Treatment,
  TreatmentInput,
} from "../../types";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Select } from "../shared/Select";

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
  label: p.charAt(0).toUpperCase() + p.slice(1).replace(" ", " "),
}));

const PROC_STATUS_OPTIONS = [
  { value: ProcedureStatus.planned, label: "Planned" },
  { value: ProcedureStatus.inProgress, label: "In Progress" },
  { value: ProcedureStatus.completed, label: "Completed" },
  { value: ProcedureStatus.cancelled, label: "Cancelled" },
];

const TREATMENT_STATUS_OPTIONS = [
  { value: TreatmentStatus.active, label: "In Progress" },
  { value: TreatmentStatus.completed, label: "Completed" },
  { value: TreatmentStatus.cancelled, label: "Cancelled" },
];

interface ProcedureFormEntry {
  tooth_number: string;
  procedure_type: string;
  status: ProcedureStatus;
  notes: string;
}

interface TreatmentFormModalProps {
  open: boolean;
  onClose: () => void;
  patients: Patient[];
  staffMembers: StaffMember[];
  treatment?: Treatment;
}

const DEFAULT_PROC: ProcedureFormEntry = {
  tooth_number: "",
  procedure_type: "filling",
  status: ProcedureStatus.planned,
  notes: "",
};

export function TreatmentFormModal({
  open,
  onClose,
  patients,
  staffMembers,
  treatment,
}: TreatmentFormModalProps) {
  const isEdit = !!treatment;
  const createTreatment = useCreateTreatment();
  const updateTreatment = useUpdateTreatment();

  const [patientId, setPatientId] = useState(
    treatment?.patient_id.toString() ?? "",
  );
  const [dentistId, setDentistId] = useState(
    treatment?.dentist_id.toString() ?? "",
  );
  const [title, setTitle] = useState(treatment?.title ?? "");
  const [estimatedCost, setEstimatedCost] = useState(
    treatment?.estimated_cost.toString() ?? "0",
  );
  const [notes, setNotes] = useState(treatment?.notes ?? "");
  const [status, setStatus] = useState<TreatmentStatus>(
    treatment?.status ?? TreatmentStatus.active,
  );
  const [procedures, setProcedures] = useState<ProcedureFormEntry[]>(
    treatment?.procedures.map((p) => ({
      tooth_number: p.tooth_number.toString(),
      procedure_type: p.procedure_type,
      status: p.status,
      notes: p.notes,
    })) ?? [],
  );

  // Reset form when treatment changes
  useEffect(() => {
    if (open) {
      setPatientId(treatment?.patient_id.toString() ?? "");
      setDentistId(treatment?.dentist_id.toString() ?? "");
      setTitle(treatment?.title ?? "");
      setEstimatedCost(treatment?.estimated_cost.toString() ?? "0");
      setNotes(treatment?.notes ?? "");
      setStatus(treatment?.status ?? TreatmentStatus.active);
      setProcedures(
        treatment?.procedures.map((p) => ({
          tooth_number: p.tooth_number.toString(),
          procedure_type: p.procedure_type,
          status: p.status,
          notes: p.notes,
        })) ?? [],
      );
    }
  }, [open, treatment]);

  const patientOptions = patients.map((p) => ({
    value: p.id.toString(),
    label: `${p.first_name} ${p.last_name}`,
  }));

  const doctorOptions = staffMembers
    .filter((s) => s.role === "doctor" || s.role === "admin")
    .map((s) => ({ value: s.id.toString(), label: s.name }));

  const addProcedure = () =>
    setProcedures((prev) => [...prev, { ...DEFAULT_PROC }]);

  const removeProcedure = (i: number) =>
    setProcedures((prev) => prev.filter((_, idx) => idx !== i));

  const updateProcedure = (
    i: number,
    field: keyof ProcedureFormEntry,
    value: string,
  ) =>
    setProcedures((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)),
    );

  const isValid = !!patientId && !!title.trim();

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Patient and treatment title are required");
      return;
    }

    const builtProcs: ToothProcedure[] = procedures
      .filter(
        (p) =>
          p.tooth_number.trim() !== "" && !Number.isNaN(Number(p.tooth_number)),
      )
      .map((p) => ({
        tooth_number: BigInt(p.tooth_number),
        procedure_type: p.procedure_type,
        status: p.status,
        notes: p.notes,
        dentist_id: dentistId ? BigInt(dentistId) : BigInt(1),
        completed_at:
          p.status === ProcedureStatus.completed
            ? BigInt(Date.now())
            : undefined,
      }));

    const input: TreatmentInput = {
      patient_id: BigInt(patientId),
      title: title.trim(),
      dentist_id: dentistId ? BigInt(dentistId) : BigInt(1),
      notes: notes.trim(),
      estimated_cost: Number(estimatedCost) || 0,
      procedures: builtProcs,
    };

    try {
      if (isEdit) {
        await updateTreatment.mutateAsync({ id: treatment.id, input });
        toast.success("Treatment updated");
      } else {
        await createTreatment.mutateAsync(input);
        toast.success("Treatment plan created");
      }
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update treatment" : "Failed to create treatment",
      );
    }
  };

  const isPending = createTreatment.isPending || updateTreatment.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Treatment Plan" : "New Treatment Plan"}
      description={
        isEdit
          ? "Update the treatment details below."
          : "Create a treatment plan for a patient."
      }
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            data-ocid="treatment_form.cancel_button"
            className="h-9 px-4 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !isValid}
            data-ocid="treatment_form.submit_button"
            className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isPending
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Treatment"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Patient + Dentist */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Patient *"
            options={patientOptions}
            value={patientId}
            placeholder="Select patient..."
            onChange={setPatientId}
            data-ocid="treatment_form.patient.select"
          />
          <Select
            label="Dentist"
            options={doctorOptions}
            value={dentistId}
            placeholder="Select dentist..."
            onChange={setDentistId}
            data-ocid="treatment_form.dentist.select"
          />
        </div>

        {/* Title */}
        <Input
          label="Treatment Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Root Canal Therapy, Crown Placement..."
          data-ocid="treatment_form.title.input"
        />

        {/* Cost + Status */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Estimated Cost (₹)"
            type="number"
            min="0"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            data-ocid="treatment_form.cost.input"
          />
          <Select
            label="Status"
            options={TREATMENT_STATUS_OPTIONS}
            value={status}
            onChange={(v) => setStatus(v as TreatmentStatus)}
            data-ocid="treatment_form.status.select"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="treatment-notes"
            className="text-sm font-medium text-foreground"
          >
            Clinical Notes
          </label>
          <textarea
            id="treatment-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            data-ocid="treatment_form.notes.textarea"
            placeholder="Clinical observations, special instructions..."
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Tooth Procedures */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">
              Tooth Procedures
            </p>
            <button
              type="button"
              onClick={addProcedure}
              data-ocid="treatment_form.add_procedure_button"
              className="h-7 px-2.5 rounded-md text-xs font-medium bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add Procedure
            </button>
          </div>

          {procedures.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
              No procedures added. Click "Add Procedure" to add tooth-specific
              procedures.
            </p>
          ) : (
            <div
              className="space-y-3"
              data-ocid="treatment_form.procedure.list"
            >
              {procedures.map((proc, i) => (
                <div
                  key={`proc-${proc.tooth_number || "new"}-${proc.procedure_type}-${i}`}
                  className="bg-muted/20 border border-border rounded-lg p-3 space-y-3"
                  data-ocid={`treatment_form.procedure.item.${i + 1}`}
                >
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Tooth #"
                      type="number"
                      min="1"
                      max="85"
                      value={proc.tooth_number}
                      onChange={(e) =>
                        updateProcedure(i, "tooth_number", e.target.value)
                      }
                      placeholder="e.g. 16"
                      data-ocid={`treatment_form.procedure.tooth.input.${i + 1}`}
                    />
                    <Select
                      label="Procedure Type"
                      options={PROCEDURE_TYPE_OPTIONS}
                      value={proc.procedure_type}
                      onChange={(v) => updateProcedure(i, "procedure_type", v)}
                      data-ocid={`treatment_form.procedure.type.select.${i + 1}`}
                    />
                    <Select
                      label="Status"
                      options={PROC_STATUS_OPTIONS}
                      value={proc.status}
                      onChange={(v) => updateProcedure(i, "status", v)}
                      data-ocid={`treatment_form.procedure.status.select.${i + 1}`}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Input
                        label="Notes"
                        value={proc.notes}
                        onChange={(e) =>
                          updateProcedure(i, "notes", e.target.value)
                        }
                        placeholder="Procedure notes..."
                        data-ocid={`treatment_form.procedure.notes.input.${i + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProcedure(i)}
                      data-ocid={`treatment_form.procedure.delete_button.${i + 1}`}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remove procedure"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
