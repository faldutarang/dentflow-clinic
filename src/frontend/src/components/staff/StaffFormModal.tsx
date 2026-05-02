import { useEffect, useState } from "react";
import type { StaffInput, StaffMember } from "../../types";
import { StaffRole } from "../../types";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";

const ROLE_OPTIONS = [
  { value: StaffRole.admin, label: "Admin" },
  { value: StaffRole.doctor, label: "Doctor" },
  { value: StaffRole.receptionist, label: "Receptionist" },
];

interface StaffFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: Omit<StaffInput, "principal">) => Promise<void>;
  isPending: boolean;
  editMember?: StaffMember | null;
}

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: StaffRole;
  qualification: string;
  license_number: string;
  hire_date: string;
};

const emptyForm = (): FormState => ({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  role: StaffRole.receptionist,
  qualification: "",
  license_number: "",
  hire_date: new Date().toISOString().split("T")[0],
});

export function StaffFormModal({
  open,
  onClose,
  onSubmit,
  isPending,
  editMember,
}: StaffFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    if (!open) return;
    if (editMember) {
      const [first, ...rest] = editMember.name.split(" ");
      setForm({
        first_name: first ?? "",
        last_name: rest.join(" "),
        email: editMember.email,
        phone: editMember.phone,
        role: editMember.role,
        qualification: editMember.qualification,
        license_number: editMember.license_number,
        hire_date: editMember.hire_date,
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [editMember, open]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.first_name.trim()) errs.first_name = "First name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email address";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({
      name: [form.first_name, form.last_name].filter(Boolean).join(" "),
      email: form.email,
      phone: form.phone,
      role: form.role,
      qualification: form.qualification,
      license_number: form.license_number,
      hire_date: form.hire_date,
    });
  };

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const isEdit = !!editMember;
  const roleAccent =
    form.role === StaffRole.admin
      ? { border: "border-l-[oklch(0.74_0.16_78)]" }
      : form.role === StaffRole.doctor
        ? { border: "border-l-[oklch(0.62_0.18_200)]" }
        : { border: "border-l-[oklch(0.65_0.17_155)]" };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Staff Member" : "Add Staff Member"}
      description={
        isEdit
          ? `Editing ${editMember?.name}`
          : "Register a new staff member to the clinic"
      }
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="staff-form.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isPending}
            data-ocid="staff-form.submit_button"
          >
            {isEdit ? "Save Changes" : "Add Staff Member"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Role selector */}
        <fieldset>
          <legend className="text-sm font-medium text-foreground mb-2 block">
            Role
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_OPTIONS.map((opt) => {
              const isSelected = form.role === opt.value;
              const colorMap = {
                [StaffRole.admin]: {
                  bg: "bg-[oklch(0.74_0.16_78/0.12)]",
                  border: "border-[oklch(0.74_0.16_78/0.5)]",
                  text: "text-[oklch(0.74_0.16_78)]",
                },
                [StaffRole.doctor]: {
                  bg: "bg-[oklch(0.62_0.18_200/0.12)]",
                  border: "border-[oklch(0.62_0.18_200/0.5)]",
                  text: "text-[oklch(0.62_0.18_200)]",
                },
                [StaffRole.receptionist]: {
                  bg: "bg-[oklch(0.65_0.17_155/0.12)]",
                  border: "border-[oklch(0.65_0.17_155/0.5)]",
                  text: "text-[oklch(0.65_0.17_155)]",
                },
              };
              const c = colorMap[opt.value];
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("role", opt.value)}
                  data-ocid={`staff-form.role.${opt.value}.toggle`}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                    isSelected
                      ? `${c.bg} ${c.border} ${c.text}`
                      : "border-border text-muted-foreground hover:bg-muted/20"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Name fields with role accent */}
        <div
          className={`rounded-lg border-l-4 pl-4 border border-border bg-muted/5 ${roleAccent.border}`}
        >
          <div className="grid grid-cols-2 gap-4 py-4">
            <Input
              label="First Name"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
              placeholder="Dr. Sarah"
              error={errors.first_name}
              data-ocid="staff-form.first_name.input"
            />
            <Input
              label="Last Name"
              value={form.last_name}
              onChange={(e) => set("last_name", e.target.value)}
              placeholder="Johnson"
              data-ocid="staff-form.last_name.input"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="sarah@dentaclinic.com"
            error={errors.email}
            data-ocid="staff-form.email.input"
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 98765 43210"
            data-ocid="staff-form.phone.input"
          />
        </div>

        {/* Professional details */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Qualification"
            value={form.qualification}
            onChange={(e) => set("qualification", e.target.value)}
            placeholder="BDS, MDS, MBBS..."
            data-ocid="staff-form.qualification.input"
          />
          <Input
            label="License Number"
            value={form.license_number}
            onChange={(e) => set("license_number", e.target.value)}
            placeholder="DCI-2024-XXXX"
            data-ocid="staff-form.license_number.input"
          />
          <Input
            label="Hire Date"
            type="date"
            value={form.hire_date}
            onChange={(e) => set("hire_date", e.target.value)}
            data-ocid="staff-form.hire_date.input"
          />
        </div>
      </div>
    </Modal>
  );
}
