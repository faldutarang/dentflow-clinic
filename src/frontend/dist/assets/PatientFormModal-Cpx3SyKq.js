import { r as reactExports, B as BloodGroup, G as Gender, j as jsxRuntimeExports, g as LoaderCircle, u as ue } from "./index-CRusxQeF.js";
import { M as Modal, I as Input, S as Select, X } from "./Select-Dw0AWwQu.js";
import { c as useCreatePatient, d as useUpdatePatient } from "./usePatients-1jxdmde2.js";
import { P as Plus } from "./plus-CqSfRGkC.js";
const GENDER_OPTIONS = [
  { value: Gender.male, label: "Male" },
  { value: Gender.female, label: "Female" },
  { value: Gender.other, label: "Other" }
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
  { value: BloodGroup.unknown_, label: "Unknown" }
];
const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: Gender.male,
  address: "",
  medical_history: "",
  allergies: [],
  blood_group: BloodGroup.unknown_
};
function validate(f) {
  const errors = {};
  if (!f.first_name.trim()) errors.first_name = "First name is required";
  if (!f.last_name.trim()) errors.last_name = "Last name is required";
  if (!f.phone.trim()) errors.phone = "Phone is required";
  if (!f.date_of_birth) errors.date_of_birth = "Date of birth is required";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    errors.email = "Enter a valid email address";
  return errors;
}
function PatientFormModal({
  open,
  onClose,
  mode,
  patient
}) {
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [errors, setErrors] = reactExports.useState({});
  const [allergyInput, setAllergyInput] = reactExports.useState("");
  const allergyRef = reactExports.useRef(null);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const isPending = createPatient.isPending || updatePatient.isPending;
  reactExports.useEffect(() => {
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
          blood_group: patient.blood_group
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
      setAllergyInput("");
    }
  }, [open, mode, patient]);
  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: void 0 }));
  };
  const addAllergy = () => {
    var _a;
    const val = allergyInput.trim();
    if (!val || form.allergies.includes(val)) return;
    setField("allergies", [...form.allergies, val]);
    setAllergyInput("");
    (_a = allergyRef.current) == null ? void 0 : _a.focus();
  };
  const removeAllergy = (a) => {
    setField(
      "allergies",
      form.allergies.filter((x) => x !== a)
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      if (mode === "add") {
        await createPatient.mutateAsync(form);
        ue.success("Patient registered successfully");
      } else if (patient) {
        await updatePatient.mutateAsync({ id: patient.id, input: form });
        ue.success("Patient updated successfully");
      }
      onClose();
    } catch {
      ue.error(
        mode === "add" ? "Failed to register patient" : "Failed to update patient"
      );
    }
  };
  const footer = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onClose,
        disabled: isPending,
        "data-ocid": "patient-form.cancel_button",
        className: "h-9 px-4 text-sm font-medium border border-border bg-transparent text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50",
        children: "Cancel"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "submit",
        form: "patient-form",
        disabled: isPending,
        "data-ocid": "patient-form.submit_button",
        className: "inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none",
        children: [
          isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          isPending ? mode === "add" ? "Registering..." : "Saving..." : mode === "add" ? "Register Patient" : "Save Changes"
        ]
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: mode === "add" ? "Register New Patient" : "Edit Patient",
      description: mode === "add" ? "Fill in the patient's details to create their record." : "Update the patient's information.",
      size: "lg",
      footer,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "patient-form", onSubmit: handleSubmit, noValidate: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "First Name *",
              id: "pat-first-name",
              value: form.first_name,
              onChange: (e) => setField("first_name", e.target.value),
              placeholder: "Priya",
              error: errors.first_name,
              "data-ocid": "patient-form.first_name.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Last Name *",
              id: "pat-last-name",
              value: form.last_name,
              onChange: (e) => setField("last_name", e.target.value),
              placeholder: "Sharma",
              error: errors.last_name,
              "data-ocid": "patient-form.last_name.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Phone *",
              id: "pat-phone",
              type: "tel",
              value: form.phone,
              onChange: (e) => setField("phone", e.target.value),
              placeholder: "+91 98765 43210",
              error: errors.phone,
              "data-ocid": "patient-form.phone.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Email",
              id: "pat-email",
              type: "email",
              value: form.email,
              onChange: (e) => setField("email", e.target.value),
              placeholder: "priya@email.com",
              error: errors.email,
              "data-ocid": "patient-form.email.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Date of Birth *",
              id: "pat-dob",
              type: "date",
              value: form.date_of_birth,
              onChange: (e) => setField("date_of_birth", e.target.value),
              error: errors.date_of_birth,
              "data-ocid": "patient-form.date_of_birth.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Gender",
              id: "pat-gender",
              value: form.gender,
              onChange: (v) => setField("gender", v),
              options: GENDER_OPTIONS,
              "data-ocid": "patient-form.gender.select"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Blood Group",
              id: "pat-blood",
              value: form.blood_group,
              onChange: (v) => setField("blood_group", v),
              options: BLOOD_GROUP_OPTIONS,
              "data-ocid": "patient-form.blood_group.select"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Address",
            id: "pat-address",
            value: form.address,
            onChange: (e) => setField("address", e.target.value),
            placeholder: "123, MG Road, Bangalore 560001",
            "data-ocid": "patient-form.address.input"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "pat-medical",
              className: "text-sm font-medium text-foreground",
              children: "Medical History"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "pat-medical",
              value: form.medical_history,
              onChange: (e) => setField("medical_history", e.target.value),
              placeholder: "Hypertension, Diabetes Type 2...",
              rows: 3,
              "data-ocid": "patient-form.medical_history.textarea",
              className: "flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 resize-y transition-colors"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "pat-allergy-input",
              className: "text-sm font-medium text-foreground",
              children: "Allergies"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "pat-allergy-input",
                ref: allergyRef,
                type: "text",
                value: allergyInput,
                onChange: (e) => setAllergyInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAllergy();
                  }
                },
                placeholder: "e.g. Penicillin",
                "data-ocid": "patient-form.allergy_input.input",
                className: "flex h-9 flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: addAllergy,
                disabled: !allergyInput.trim(),
                "data-ocid": "patient-form.add_allergy.button",
                className: "inline-flex items-center gap-1 h-9 px-3 text-sm font-medium border border-border bg-transparent text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  " Add"
                ]
              }
            )
          ] }),
          form.allergies.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex flex-wrap gap-1.5 mt-2",
              "data-ocid": "patient-form.allergies.list",
              children: form.allergies.map((a, allergyIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  style: {
                    background: "oklch(0.58 0.22 25 / 0.12)",
                    color: "oklch(0.58 0.22 25)",
                    border: "1px solid oklch(0.58 0.22 25 / 0.25)"
                  },
                  "data-ocid": `patient-form.allergy.item.${allergyIdx + 1}`,
                  children: [
                    a,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeAllergy(a),
                        "aria-label": `Remove ${a}`,
                        className: "ml-0.5 hover:opacity-70 transition-opacity",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                      }
                    )
                  ]
                },
                a
              ))
            }
          )
        ] })
      ] })
    }
  );
}
export {
  PatientFormModal as P
};
