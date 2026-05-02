import { createActor } from "@/backend";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Modal } from "@/components/shared/Modal";
import { Select } from "@/components/shared/Select";
import type { Patient, Treatment } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface LabOrderFormModalProps {
  open: boolean;
  onClose: () => void;
}

const PROCEDURE_TYPES = [
  { value: "crown", label: "Crown" },
  { value: "bridge", label: "Bridge" },
  { value: "denture", label: "Denture" },
  { value: "night_guard", label: "Night Guard" },
  { value: "bleaching_tray", label: "Bleaching Tray" },
  { value: "other", label: "Other" },
];

export function LabOrderFormModal({ open, onClose }: LabOrderFormModalProps) {
  const { actor, isFetching } = useActor(createActor);

  const [patientId, setPatientId] = useState("");
  const [treatmentId, setTreatmentId] = useState("");
  const [labName, setLabName] = useState("");
  const [procedureType, setProcedureType] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [cost, setCost] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPatients();
    },
    enabled: !!actor && !isFetching && open,
  });

  const { data: treatments = [] } = useQuery<Treatment[]>({
    queryKey: ["treatments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTreatments(null);
    },
    enabled: !!actor && !isFetching && open,
  });

  const patientTreatments = patientId
    ? treatments.filter((t) => t.patient_id.toString() === patientId)
    : [];

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.createLabOrder({
        patient_id: BigInt(patientId),
        treatment_id: treatmentId ? BigInt(treatmentId) : undefined,
        lab_name: labName.trim(),
        procedure_type: procedureType,
        specifications: specifications.trim(),
        cost: Number.parseFloat(cost) || 0,
        due_date: dueDate,
        notes: notes.trim(),
      });
    },
    onSuccess: () => {
      toast.success("Lab order created");
      handleClose();
    },
    onError: () => {
      toast.error("Failed to create lab order");
    },
  });

  const handleClose = () => {
    setPatientId("");
    setTreatmentId("");
    setLabName("");
    setProcedureType("");
    setSpecifications("");
    setCost("");
    setDueDate("");
    setNotes("");
    onClose();
  };

  const canSubmit =
    !!patientId &&
    !!labName.trim() &&
    !!procedureType &&
    !!dueDate &&
    !createMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Lab Order"
      description="Send a dental lab work order"
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleClose}
            data-ocid="lab-form.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => createMutation.mutate()}
            loading={createMutation.isPending}
            disabled={!canSubmit}
            data-ocid="lab-form.submit_button"
          >
            Create Lab Order
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Patient & Treatment */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Patient *"
            value={patientId}
            onChange={setPatientId}
            placeholder="Select patient..."
            options={patients.map((p) => ({
              value: p.id.toString(),
              label: `${p.first_name} ${p.last_name}`,
            }))}
            data-ocid="lab-form.patient_select"
          />
          <Select
            label="Treatment (optional)"
            value={treatmentId}
            onChange={setTreatmentId}
            placeholder="Link to treatment..."
            options={patientTreatments.map((t) => ({
              value: t.id.toString(),
              label: t.title,
            }))}
            disabled={!patientId}
            data-ocid="lab-form.treatment_select"
          />
        </div>

        {/* Lab & Procedure */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Lab Name *"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            placeholder="e.g. Sunrise Dental Labs"
            data-ocid="lab-form.lab_name_input"
          />
          <Select
            label="Procedure Type *"
            value={procedureType}
            onChange={setProcedureType}
            placeholder="Select procedure..."
            options={PROCEDURE_TYPES}
            data-ocid="lab-form.procedure_type_select"
          />
        </div>

        {/* Specifications */}
        <div className="space-y-1.5">
          <label
            htmlFor="lab-specifications"
            className="text-sm font-medium text-foreground"
          >
            Specifications
          </label>
          <textarea
            id="lab-specifications"
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            placeholder="Shade, size, material, and any special instructions..."
            rows={3}
            data-ocid="lab-form.specifications_textarea"
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-colors"
          />
        </div>

        {/* Cost & Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cost (₹)"
            type="number"
            min="0"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            data-ocid="lab-form.cost_input"
          />
          <Input
            label="Due Date *"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            data-ocid="lab-form.due_date_input"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="lab-notes"
            className="text-sm font-medium text-foreground"
          >
            Notes
          </label>
          <textarea
            id="lab-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes for the lab..."
            rows={2}
            data-ocid="lab-form.notes_textarea"
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-colors"
          />
        </div>
      </div>
    </Modal>
  );
}
