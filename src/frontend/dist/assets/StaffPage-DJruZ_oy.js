import { c as createLucideIcon, r as reactExports, A as AttendanceStatus, j as jsxRuntimeExports, l as StaffRole, m as useInternetIdentity, P as PageLoader, b as UserCheck, u as ue } from "./index-CRusxQeF.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { B as Badge } from "./Badge-2qoa5wWf.js";
import { B as Button } from "./Button-CwPCyQgH.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { M as Modal, I as Input, S as Select } from "./Select-Dw0AWwQu.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
import { T as Table } from "./Table-ByTzrkVY.js";
import { C as CircleCheck } from "./circle-check-D3UMPTkH.js";
import { C as Clock } from "./clock-cX5WXH5S.js";
import { u as useStaffMembers, a as useCreateStaff, b as useUpdateStaff, c as useDeactivateStaff, d as useRecordAttendance } from "./useStaff-B8FY4OEx.js";
import { P as Plus } from "./plus-CqSfRGkC.js";
import { P as Pen } from "./pen-DoUQIFU9.js";
import "./useMutation-C_my6RdQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8", key: "bce9hv" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m16 20 2 2 4-4", key: "13tcca" }]
];
const CalendarCheck2 = createLucideIcon("calendar-check-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
const STATUS_OPTIONS = [
  {
    value: AttendanceStatus.present,
    label: "Present",
    Icon: CircleCheck,
    bg: "bg-[oklch(0.65_0.17_155/0.12)]",
    border: "border-[oklch(0.65_0.17_155/0.5)]",
    text: "text-[oklch(0.65_0.17_155)]"
  },
  {
    value: AttendanceStatus.absent,
    label: "Absent",
    Icon: CircleX,
    bg: "bg-destructive/10",
    border: "border-destructive/50",
    text: "text-destructive"
  },
  {
    value: AttendanceStatus.halfDay,
    label: "Half Day",
    Icon: Clock,
    bg: "bg-[oklch(0.74_0.16_78/0.12)]",
    border: "border-[oklch(0.74_0.16_78/0.5)]",
    text: "text-[oklch(0.74_0.16_78)]"
  }
];
function timeStringToTimestamp(dateStr, timeStr) {
  if (!timeStr) return null;
  const [hoursStr, minutesStr] = timeStr.split(":");
  const dt = new Date(dateStr);
  dt.setHours(Number(hoursStr), Number(minutesStr), 0, 0);
  return BigInt(dt.getTime()) * 1000000n;
}
function AttendanceModal({
  open,
  onClose,
  staff,
  onSubmit,
  isPending
}) {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [date, setDate] = reactExports.useState(today);
  const [checkIn, setCheckIn] = reactExports.useState("09:00");
  const [checkOut, setCheckOut] = reactExports.useState("18:00");
  const [status, setStatus] = reactExports.useState(
    AttendanceStatus.present
  );
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!open) return;
    setDate(today);
    setCheckIn("09:00");
    setCheckOut("18:00");
    setStatus(AttendanceStatus.present);
    setError("");
  }, [open, today]);
  if (!staff) return null;
  const isAbsent = status === AttendanceStatus.absent;
  const handleSubmit = async () => {
    if (!date) {
      setError("Date is required");
      return;
    }
    if (!isAbsent && checkIn && checkOut) {
      const inMs = (/* @__PURE__ */ new Date(`${date}T${checkIn}`)).getTime();
      const outMs = (/* @__PURE__ */ new Date(`${date}T${checkOut}`)).getTime();
      if (outMs <= inMs) {
        setError("Check-out time must be after check-in time");
        return;
      }
    }
    setError("");
    await onSubmit({
      date,
      checkIn: isAbsent ? null : timeStringToTimestamp(date, checkIn),
      checkOut: isAbsent ? null : timeStringToTimestamp(date, checkOut),
      status
    });
  };
  const roleColorClass = staff.role === "admin" ? "text-[oklch(0.74_0.16_78)]" : staff.role === "doctor" ? "text-[oklch(0.62_0.18_200)]" : "text-[oklch(0.65_0.17_155)]";
  const durationLabel = (() => {
    if (isAbsent || !checkIn || !checkOut) return null;
    const mins = ((/* @__PURE__ */ new Date(`${date}T${checkOut}`)).getTime() - (/* @__PURE__ */ new Date(`${date}T${checkIn}`)).getTime()) / 6e4;
    if (mins <= 0) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h${m > 0 ? ` ${m}m` : ""}`;
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: "Record Attendance",
      description: "Log attendance for a staff member",
      size: "sm",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "attendance.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "primary",
            onClick: handleSubmit,
            loading: isPending,
            "data-ocid": "attendance.submit_button",
            children: "Record Attendance"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border bg-muted/10 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-muted/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${roleColorClass}`, children: staff.name.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: staff.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs capitalize font-medium ${roleColorClass}`, children: staff.role })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Date",
            type: "date",
            value: date,
            onChange: (e) => {
              setDate(e.target.value);
              setError("");
            },
            "data-ocid": "attendance.date.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "text-sm font-medium text-foreground mb-2 block", children: "Attendance Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: STATUS_OPTIONS.map(({ value, label, Icon, bg, border, text }) => {
            const isSelected = status === value;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setStatus(value);
                  setError("");
                },
                "data-ocid": `attendance.status.${value}.toggle`,
                className: `flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-semibold transition-all ${isSelected ? `${bg} ${border} ${text}` : "border-border text-muted-foreground hover:bg-muted/20"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
                  label
                ]
              },
              value
            );
          }) })
        ] }),
        !isAbsent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Check-in Time",
              type: "time",
              value: checkIn,
              onChange: (e) => {
                setCheckIn(e.target.value);
                setError("");
              },
              "data-ocid": "attendance.check_in.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Check-out Time",
              type: "time",
              value: checkOut,
              onChange: (e) => {
                setCheckOut(e.target.value);
                setError("");
              },
              "data-ocid": "attendance.check_out.input"
            }
          )
        ] }),
        durationLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/10 border border-border px-4 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Duration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground tabular-nums", children: durationLabel })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "attendance.error_state",
            children: error
          }
        )
      ] })
    }
  );
}
const ROLE_OPTIONS = [
  { value: StaffRole.admin, label: "Admin" },
  { value: StaffRole.doctor, label: "Doctor" },
  { value: StaffRole.receptionist, label: "Receptionist" }
];
const emptyForm = () => ({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  role: StaffRole.receptionist,
  qualification: "",
  license_number: "",
  hire_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
});
function StaffFormModal({
  open,
  onClose,
  onSubmit,
  isPending,
  editMember
}) {
  const [form, setForm] = reactExports.useState(emptyForm());
  const [errors, setErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
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
        hire_date: editMember.hire_date
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [editMember, open]);
  const validate = () => {
    const errs = {};
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
      hire_date: form.hire_date
    });
  };
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: void 0 }));
  };
  const isEdit = !!editMember;
  const roleAccent = form.role === StaffRole.admin ? { border: "border-l-[oklch(0.74_0.16_78)]" } : form.role === StaffRole.doctor ? { border: "border-l-[oklch(0.62_0.18_200)]" } : { border: "border-l-[oklch(0.65_0.17_155)]" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: isEdit ? "Edit Staff Member" : "Add Staff Member",
      description: isEdit ? `Editing ${editMember == null ? void 0 : editMember.name}` : "Register a new staff member to the clinic",
      size: "lg",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "staff-form.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "primary",
            onClick: handleSubmit,
            loading: isPending,
            "data-ocid": "staff-form.submit_button",
            children: isEdit ? "Save Changes" : "Add Staff Member"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "text-sm font-medium text-foreground mb-2 block", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ROLE_OPTIONS.map((opt) => {
            const isSelected = form.role === opt.value;
            const colorMap = {
              [StaffRole.admin]: {
                bg: "bg-[oklch(0.74_0.16_78/0.12)]",
                border: "border-[oklch(0.74_0.16_78/0.5)]",
                text: "text-[oklch(0.74_0.16_78)]"
              },
              [StaffRole.doctor]: {
                bg: "bg-[oklch(0.62_0.18_200/0.12)]",
                border: "border-[oklch(0.62_0.18_200/0.5)]",
                text: "text-[oklch(0.62_0.18_200)]"
              },
              [StaffRole.receptionist]: {
                bg: "bg-[oklch(0.65_0.17_155/0.12)]",
                border: "border-[oklch(0.65_0.17_155/0.5)]",
                text: "text-[oklch(0.65_0.17_155)]"
              }
            };
            const c = colorMap[opt.value];
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => set("role", opt.value),
                "data-ocid": `staff-form.role.${opt.value}.toggle`,
                className: `px-3 py-2.5 rounded-lg border text-sm font-semibold transition-all ${isSelected ? `${c.bg} ${c.border} ${c.text}` : "border-border text-muted-foreground hover:bg-muted/20"}`,
                children: opt.label
              },
              opt.value
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `rounded-lg border-l-4 pl-4 border border-border bg-muted/5 ${roleAccent.border}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  label: "First Name",
                  value: form.first_name,
                  onChange: (e) => set("first_name", e.target.value),
                  placeholder: "Dr. Sarah",
                  error: errors.first_name,
                  "data-ocid": "staff-form.first_name.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  label: "Last Name",
                  value: form.last_name,
                  onChange: (e) => set("last_name", e.target.value),
                  placeholder: "Johnson",
                  "data-ocid": "staff-form.last_name.input"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Email",
              type: "email",
              value: form.email,
              onChange: (e) => set("email", e.target.value),
              placeholder: "sarah@dentaclinic.com",
              error: errors.email,
              "data-ocid": "staff-form.email.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Phone",
              value: form.phone,
              onChange: (e) => set("phone", e.target.value),
              placeholder: "+91 98765 43210",
              "data-ocid": "staff-form.phone.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Qualification",
              value: form.qualification,
              onChange: (e) => set("qualification", e.target.value),
              placeholder: "BDS, MDS, MBBS...",
              "data-ocid": "staff-form.qualification.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "License Number",
              value: form.license_number,
              onChange: (e) => set("license_number", e.target.value),
              placeholder: "DCI-2024-XXXX",
              "data-ocid": "staff-form.license_number.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Hire Date",
              type: "date",
              value: form.hire_date,
              onChange: (e) => set("hire_date", e.target.value),
              "data-ocid": "staff-form.hire_date.input"
            }
          )
        ] })
      ] })
    }
  );
}
const ROLE_FILTER_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: StaffRole.admin, label: "Admin" },
  { value: StaffRole.doctor, label: "Doctor" },
  { value: StaffRole.receptionist, label: "Receptionist" }
];
const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];
const ROLE_BADGE_VARIANT = {
  [StaffRole.admin]: "admin",
  [StaffRole.doctor]: "doctor",
  [StaffRole.receptionist]: "receptionist"
};
function StaffPage() {
  const [roleFilter, setRoleFilter] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editMember, setEditMember] = reactExports.useState(null);
  const [attendanceMember, setAttendanceMember] = reactExports.useState(
    null
  );
  const { data: staff, isLoading } = useStaffMembers();
  const { identity } = useInternetIdentity();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deactivateStaff = useDeactivateStaff();
  const recordAttendance = useRecordAttendance();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const filtered = (staff ?? []).filter((s) => {
    if (roleFilter && s.role !== roleFilter) return false;
    if (statusFilter === "active" && !s.is_active) return false;
    if (statusFilter === "inactive" && s.is_active) return false;
    return true;
  });
  const handleCreate = async (input) => {
    if (!identity) return;
    try {
      await createStaff.mutateAsync({
        ...input,
        principal: identity.getPrincipal()
      });
      setShowAdd(false);
      ue.success(`${input.name} added to staff`);
    } catch {
      ue.error("Failed to add staff member");
    }
  };
  const handleUpdate = async (input) => {
    if (!editMember) return;
    try {
      await updateStaff.mutateAsync({
        id: editMember.id,
        input: { ...input, principal: editMember.principal }
      });
      setEditMember(null);
      ue.success("Staff member updated");
    } catch {
      ue.error("Failed to update staff member");
    }
  };
  const handleDeactivate = async (s) => {
    if (!confirm(`Deactivate ${s.name}? They will lose system access.`)) return;
    try {
      await deactivateStaff.mutateAsync(s.id);
      ue.success(`${s.name} deactivated`);
    } catch {
      ue.error("Failed to deactivate staff member");
    }
  };
  const handleRecordAttendance = async (params) => {
    if (!attendanceMember) return;
    try {
      await recordAttendance.mutateAsync({
        staffId: attendanceMember.id,
        ...params
      });
      setAttendanceMember(null);
      const statusLabel = params.status === AttendanceStatus.present ? "Present" : params.status === AttendanceStatus.absent ? "Absent" : "Half Day";
      ue.success(`Attendance recorded: ${statusLabel}`);
    } catch {
      ue.error("Failed to record attendance");
    }
  };
  const activeCount = (staff ?? []).filter((s) => s.is_active).length;
  const totalCount = (staff ?? []).length;
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", "data-ocid": `staff.item.${i + 1}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: s.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: s.email })
      ] })
    },
    {
      key: "role",
      header: "Role",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: ROLE_BADGE_VARIANT[s.role], children: s.role.charAt(0).toUpperCase() + s.role.slice(1) })
    },
    {
      key: "phone",
      header: "Phone",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: s.phone || "—" })
    },
    {
      key: "qualification",
      header: "Qualification",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: s.qualification || "—" })
    },
    {
      key: "hire_date",
      header: "Hired",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: s.hire_date })
    },
    {
      key: "is_active",
      header: "Status",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: s.is_active ? "active" : "cancelled" })
    },
    {
      key: "actions",
      header: "",
      render: (s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setAttendanceMember(s),
            "data-ocid": `staff.attendance_button.${i + 1}`,
            title: "Record attendance",
            className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "aria-label": "Record attendance",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck2, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setEditMember(s),
            "data-ocid": `staff.edit_button.${i + 1}`,
            title: "Edit staff member",
            className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "aria-label": "Edit staff member",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
          }
        ),
        s.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => handleDeactivate(s),
            "data-ocid": `staff.deactivate_button.${i + 1}`,
            title: "Deactivate",
            className: "p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            "aria-label": "Deactivate staff member",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-4 w-4" })
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "staff.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Staff Management",
        description: "Manage clinic staff, roles, and attendance records",
        breadcrumbs: [{ label: "Clinic" }, { label: "Staff" }],
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "primary",
            size: "sm",
            onClick: () => setShowAdd(true),
            "data-ocid": "staff.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "Add Staff"
            ]
          }
        )
      }
    ),
    totalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mb-5", children: [
      {
        label: "Total Staff",
        value: totalCount,
        color: "text-foreground"
      },
      {
        label: "Active",
        value: activeCount,
        color: "text-[oklch(0.65_0.17_155)]"
      },
      {
        label: "Inactive",
        value: totalCount - activeCount,
        color: "text-muted-foreground"
      }
    ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-lg px-4 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-display font-bold ${color}`, children: value })
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-44", "data-ocid": "staff.role.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Select,
        {
          value: roleFilter,
          options: ROLE_FILTER_OPTIONS,
          onChange: setRoleFilter
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-40", "data-ocid": "staff.status.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Select,
        {
          value: statusFilter,
          options: STATUS_FILTER_OPTIONS,
          onChange: setStatusFilter
        }
      ) }),
      (roleFilter || statusFilter) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setRoleFilter("");
            setStatusFilter("");
          },
          className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
          children: "Clear filters"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
        filtered.length,
        " member",
        filtered.length !== 1 ? "s" : ""
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-7 w-7" }),
        title: roleFilter || statusFilter ? "No staff match your filters" : "No staff members yet",
        description: roleFilter || statusFilter ? "Try adjusting your filters." : "Add your first staff member to get started.",
        "data-ocid": "staff.empty_state"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Table,
      {
        columns,
        data: filtered,
        keyExtractor: (s) => s.id.toString(),
        stickyHeader: true,
        emptyMessage: "No staff found"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StaffFormModal,
      {
        open: showAdd,
        onClose: () => setShowAdd(false),
        onSubmit: handleCreate,
        isPending: createStaff.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StaffFormModal,
      {
        open: !!editMember,
        onClose: () => setEditMember(null),
        onSubmit: handleUpdate,
        isPending: updateStaff.isPending,
        editMember
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttendanceModal,
      {
        open: !!attendanceMember,
        onClose: () => setAttendanceMember(null),
        staff: attendanceMember,
        onSubmit: handleRecordAttendance,
        isPending: recordAttendance.isPending
      }
    )
  ] });
}
export {
  StaffPage as default
};
