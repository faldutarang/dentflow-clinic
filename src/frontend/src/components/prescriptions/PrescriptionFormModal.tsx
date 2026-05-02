import { createActor } from "@/backend";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Modal } from "@/components/shared/Modal";
import { Select } from "@/components/shared/Select";
import type { Medication, Patient, Treatment } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PrescriptionFormModalProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_MED: Medication = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  notes: "",
};

export function PrescriptionFormModal({
  open,
  onClose,
}: PrescriptionFormModalProps) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [patientId, setPatientId] = useState("");
  const [treatmentId, setTreatmentId] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    { ...EMPTY_MED },
  ]);

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

  // Filter treatments for selected patient
  const patientTreatments = patientId
    ? treatments.filter((t) => t.patient_id.toString() === patientId)
    : [];

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const dentist = await actor.listStaffMembers();
      // Use first doctor as prescriber (in real app, use logged-in user)
      const doc = dentist.find((s) => s.role === "doctor");
      if (!doc) throw new Error("No doctor found. Only doctors can prescribe.");
      const validMeds = medications.filter((m) => m.name.trim());
      if (!validMeds.length) throw new Error("Add at least one medication.");
      return actor.createPrescription({
        patient_id: BigInt(patientId),
        dentist_id: doc.id,
        medications: validMeds,
        treatment_id: treatmentId ? BigInt(treatmentId) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription created");
      handleClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create prescription");
    },
  });

  const handleClose = () => {
    setPatientId("");
    setTreatmentId("");
    setNotes("");
    setMedications([{ ...EMPTY_MED }]);
    onClose();
  };

  const updateMed = (i: number, field: keyof Medication, value: string) => {
    setMedications((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    );
  };

  const addMed = () => setMedications((prev) => [...prev, { ...EMPTY_MED }]);

  const removeMed = (i: number) =>
    setMedications((prev) => prev.filter((_, idx) => idx !== i));

  const canSubmit =
    !!patientId &&
    medications.some((m) => m.name.trim()) &&
    !createMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Prescription"
      description="Create a digital prescription for a patient"
      size="xl"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleClose}
            data-ocid="prescription-form.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => createMutation.mutate()}
            loading={createMutation.isPending}
            disabled={!canSubmit}
            data-ocid="prescription-form.submit_button"
          >
            Create Prescription
          </Button>
        </>
      }
    >
      <div className="space-y-5">
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
            data-ocid="prescription-form.patient_select"
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
            data-ocid="prescription-form.treatment_select"
          />
        </div>

        {/* Medications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Medications *</p>
            <button
              type="button"
              onClick={addMed}
              data-ocid="prescription-form.add_medication_button"
              className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Medication
            </button>
          </div>

          <div className="space-y-3">
            {medications.map((med, i) => (
              <div
                key={`med-row-${med.name || i}-${i}`}
                data-ocid={`prescription-form.medication.${i + 1}`}
                className="bg-muted/20 border border-border rounded-lg p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-accent">
                    Medication {i + 1}
                  </span>
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMed(i)}
                      data-ocid={`prescription-form.remove_medication.${i + 1}`}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove medication"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Name *"
                    value={med.name}
                    onChange={(e) => updateMed(i, "name", e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg"
                    data-ocid={`prescription-form.medication_name.${i + 1}`}
                  />
                  <Input
                    label="Dosage *"
                    value={med.dosage}
                    onChange={(e) => updateMed(i, "dosage", e.target.value)}
                    placeholder="e.g. 1 tablet"
                    data-ocid={`prescription-form.medication_dosage.${i + 1}`}
                  />
                  <Input
                    label="Frequency *"
                    value={med.frequency}
                    onChange={(e) => updateMed(i, "frequency", e.target.value)}
                    placeholder="e.g. 3 times daily"
                    data-ocid={`prescription-form.medication_frequency.${i + 1}`}
                  />
                  <Input
                    label="Duration *"
                    value={med.duration}
                    onChange={(e) => updateMed(i, "duration", e.target.value)}
                    placeholder="e.g. 5 days"
                    data-ocid={`prescription-form.medication_duration.${i + 1}`}
                  />
                </div>
                <Input
                  label="Notes"
                  value={med.notes}
                  onChange={(e) => updateMed(i, "notes", e.target.value)}
                  placeholder="e.g. Take after meals"
                  data-ocid={`prescription-form.medication_notes.${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* General notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="prescription-notes"
            className="text-sm font-medium text-foreground"
          >
            Prescription Notes
          </label>
          <textarea
            id="prescription-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional instructions or notes..."
            rows={3}
            data-ocid="prescription-form.notes_textarea"
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-colors"
          />
        </div>
      </div>
    </Modal>
  );
}
