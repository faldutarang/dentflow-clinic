import { Input } from "@/components/shared/Input";
import { Modal } from "@/components/shared/Modal";
import { Select } from "@/components/shared/Select";
import { useCreatePatient, useUpdatePatient } from "@/hooks/usePatients";
import { BloodGroup, Gender, type Patient, type PatientInput } from "@/types";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface PatientFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  patient?: Patient;
}

const GENDER_OPTIONS = [
  { value: Gender.male, label: "Male" },
  { value: Gender.female, label: "Female" },
  { value: Gender.other, label: "Other" },
];

const BLOOD_GROUP_OPTIONS = [
  { value: BloodGroup.aPos, label: "A+" },
  { value: BloodGroup.aNeg, label: "A−" },
  { value: BloodGroup.bPos, label: "B+" },
  { value: BloodGroup.bNeg, label: "B−" },
  { value: BloodGroup.abPos, label: "AB+" },
  { value: BloodGroup.abNeg, label: "AB−" },
  { value: BloodGroup.oPos, label: "O+" },
  { value: BloodGroup.oNeg, label: "O−" },
  { value: BloodGroup.unknown_, label: "Unknown" },
];

const EMPTY_FORM: PatientInput = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: Gender.male,
  address: "",
  medical_history: "",
  allergies: [],
  blood_group: BloodGroup.unknown_,
};

type FormErrors = Partial<Record<keyof PatientInput, string>>;

function validate(f: PatientInput): FormErrors {
  const errors: FormErrors = {};
  if (!f.first_name.trim()) errors.first_name = "First name is required";
  if (!f.last_name.trim()) errors.last_name = "Last name is required";
  if (!f.phone.trim()) errors.phone = "Phone is required";
  if (!f.date_of_birth) errors.date_of_birth = "Date of birth is required";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    errors.email = "Enter a valid email address";
  return errors;
}

export function PatientFormModal({
  open,
  onClose,
  mode,
  patient,
}: PatientFormModalProps) {
  const [form, setForm] = useState<PatientInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [allergyInput, setAllergyInput] = useState("");
  const allergyRef = useRef<HTMLInputElement>(null);

  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const isPending = createPatient.isPending || updatePatient.isPending;

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (mode === "edit" && patient) {
        setForm({
          first_name: patient.first_name,
          last_name: patient.last_name,
          email: patient.email,
          phone: patient.phone,
          date_of_birth: patient.date_of_birth,
          gender: patient.gender,
          address: patient.address,
          medical_history: patient.medical_history,
          allergies: [...patient.allergies],
          blood_group: patient.blood_group,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
      setAllergyInput("");
    }
  }, [open, mode, patient]);

  const setField = <K extends keyof PatientInput>(
    key: K,
    value: PatientInput[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const addAllergy = () => {
    const val = allergyInput.trim();
    if (!val || form.allergies.includes(val)) return;
    setField("allergies", [...form.allergies, val]);
    setAllergyInput("");
    allergyRef.current?.focus();
  };

  const removeAllergy = (a: string) => {
    setField(
      "allergies",
      form.allergies.filter((x) => x !== a),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      if (mode === "add") {
        await createPatient.mutateAsync(form);
        toast.success("Patient registered successfully");
      } else if (patient) {
        await updatePatient.mutateAsync({ id: patient.id, input: form });
        toast.success("Patient updated successfully");
      }
      onClose();
    } catch {
      toast.error(
        mode === "add"
          ? "Failed to register patient"
          : "Failed to update patient",
      );
    }
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={isPending}
        data-ocid="patient-form.cancel_button"
        className="h-9 px-4 text-sm font-medium border border-border bg-transparent text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="patient-form"
        disabled={isPending}
        data-ocid="patient-form.submit_button"
        className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending
          ? mode === "add"
            ? "Registering..."
            : "Saving..."
          : mode === "add"
            ? "Register Patient"
            : "Save Changes"}
      </button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Register New Patient" : "Edit Patient"}
      description={
        mode === "add"
          ? "Fill in the patient's details to create their record."
          : "Update the patient's information."
      }
      size="lg"
      footer={footer}
    >
      <form id="patient-form" onSubmit={handleSubmit} noValidate>
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="First Name *"
            id="pat-first-name"
            value={form.first_name}
            onChange={(e) => setField("first_name", e.target.value)}
            placeholder="Priya"
            error={errors.first_name}
            data-ocid="patient-form.first_name.input"
          />
          <Input
            label="Last Name *"
            id="pat-last-name"
            value={form.last_name}
            onChange={(e) => setField("last_name", e.target.value)}
            placeholder="Sharma"
            error={errors.last_name}
            data-ocid="patient-form.last_name.input"
          />
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="Phone *"
            id="pat-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+91 98765 43210"
            error={errors.phone}
            data-ocid="patient-form.phone.input"
          />
          <Input
            label="Email"
            id="pat-email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="priya@email.com"
            error={errors.email}
            data-ocid="patient-form.email.input"
          />
        </div>

        {/* DoB + Gender + Blood */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input
            label="Date of Birth *"
            id="pat-dob"
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setField("date_of_birth", e.target.value)}
            error={errors.date_of_birth}
            data-ocid="patient-form.date_of_birth.input"
          />
          <Select
            label="Gender"
            id="pat-gender"
            value={form.gender}
            onChange={(v) => setField("gender", v as Gender)}
            options={GENDER_OPTIONS}
            data-ocid="patient-form.gender.select"
          />
          <Select
            label="Blood Group"
            id="pat-blood"
            value={form.blood_group}
            onChange={(v) => setField("blood_group", v as BloodGroup)}
            options={BLOOD_GROUP_OPTIONS}
            data-ocid="patient-form.blood_group.select"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <Input
            label="Address"
            id="pat-address"
            value={form.address}
            onChange={(e) => setField("address", e.target.value)}
            placeholder="123, MG Road, Bangalore 560001"
            data-ocid="patient-form.address.input"
          />
        </div>

        {/* Medical History */}
        <div className="mb-4 space-y-1.5">
          <label
            htmlFor="pat-medical"
            className="text-sm font-medium text-foreground"
          >
            Medical History
          </label>
          <textarea
            id="pat-medical"
            value={form.medical_history}
            onChange={(e) => setField("medical_history", e.target.value)}
            placeholder="Hypertension, Diabetes Type 2..."
            rows={3}
            data-ocid="patient-form.medical_history.textarea"
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 resize-y transition-colors"
          />
        </div>

        {/* Allergies */}
        <div className="space-y-2">
          <label
            htmlFor="pat-allergy-input"
            className="text-sm font-medium text-foreground"
          >
            Allergies
          </label>
          <div className="flex gap-2">
            <input
              id="pat-allergy-input"
              ref={allergyRef}
              type="text"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAllergy();
                }
              }}
              placeholder="e.g. Penicillin"
              data-ocid="patient-form.allergy_input.input"
              className="flex h-9 flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
            <button
              type="button"
              onClick={addAllergy}
              disabled={!allergyInput.trim()}
              data-ocid="patient-form.add_allergy.button"
              className="inline-flex items-center gap-1 h-9 px-3 text-sm font-medium border border-border bg-transparent text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          {form.allergies.length > 0 && (
            <div
              className="flex flex-wrap gap-1.5 mt-2"
              data-ocid="patient-form.allergies.list"
            >
              {form.allergies.map((a, allergyIdx) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: "oklch(0.58 0.22 25 / 0.12)",
                    color: "oklch(0.58 0.22 25)",
                    border: "1px solid oklch(0.58 0.22 25 / 0.25)",
                  }}
                  data-ocid={`patient-form.allergy.item.${allergyIdx + 1}`}
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => removeAllergy(a)}
                    aria-label={`Remove ${a}`}
                    className="ml-0.5 hover:opacity-70 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
