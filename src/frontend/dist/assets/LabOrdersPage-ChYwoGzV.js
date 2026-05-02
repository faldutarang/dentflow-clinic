import { n as useActor, r as reactExports, p as useQuery, j as jsxRuntimeExports, u as ue, q as createActor, L as LabOrderStatus, e as LoadingSpinner, F as FlaskConical } from "./index-CRusxQeF.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { B as Button } from "./Button-CwPCyQgH.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { T as Table } from "./Table-ByTzrkVY.js";
import { M as Modal, S as Select, I as Input } from "./Select-Dw0AWwQu.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
import { t as toDate, m as millisecondsInHour, a as millisecondsInMinute, f as format } from "./format-rbhgLEdD.js";
import { u as useLabOrders } from "./useLabOrders-pRgXHUSx.js";
import { u as usePatients } from "./usePatients-1jxdmde2.js";
import { P as Plus } from "./plus-CqSfRGkC.js";
import { T as TriangleAlert } from "./triangle-alert-Df_P3OKT.js";
import { P as Pen } from "./pen-DoUQIFU9.js";
function isPast(date) {
  return +toDate(date) < Date.now();
}
function parseISO(argument, options) {
  const additionalDigits = 2;
  const dateStrings = splitDateString(argument);
  let date;
  if (dateStrings.date) {
    const parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }
  if (!date || isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  const timestamp = date.getTime();
  let time = 0;
  let offset;
  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  } else {
    const dirtyDate = new Date(timestamp + time);
    const result = /* @__PURE__ */ new Date(0);
    result.setFullYear(
      dirtyDate.getUTCFullYear(),
      dirtyDate.getUTCMonth(),
      dirtyDate.getUTCDate()
    );
    result.setHours(
      dirtyDate.getUTCHours(),
      dirtyDate.getUTCMinutes(),
      dirtyDate.getUTCSeconds(),
      dirtyDate.getUTCMilliseconds()
    );
    return result;
  }
  return new Date(timestamp + time + offset);
}
const patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
};
const dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
const timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
const timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
  const dateStrings = {};
  const array = dateString.split(patterns.dateTimeDelimiter);
  let timeString;
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(
        dateStrings.date.length,
        dateString.length
      );
    }
  }
  if (timeString) {
    const token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  const regex = new RegExp(
    "^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)"
  );
  const captures = dateString.match(regex);
  if (!captures) return { year: NaN, restDateString: "" };
  const year = captures[1] ? parseInt(captures[1]) : null;
  const century = captures[2] ? parseInt(captures[2]) : null;
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}
function parseDate(dateString, year) {
  if (year === null) return /* @__PURE__ */ new Date(NaN);
  const captures = dateString.match(dateRegex);
  if (!captures) return /* @__PURE__ */ new Date(NaN);
  const isWeekDate = !!captures[4];
  const dayOfYear = parseDateUnit(captures[1]);
  const month = parseDateUnit(captures[2]) - 1;
  const day = parseDateUnit(captures[3]);
  const week = parseDateUnit(captures[4]);
  const dayOfWeek = parseDateUnit(captures[5]) - 1;
  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    const date = /* @__PURE__ */ new Date(0);
    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}
function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
  const captures = timeString.match(timeRegex);
  if (!captures) return NaN;
  const hours = parseTimeUnit(captures[1]);
  const minutes = parseTimeUnit(captures[2]);
  const seconds = parseTimeUnit(captures[3]);
  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }
  return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
}
function parseTimeUnit(value) {
  return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
  if (timezoneString === "Z") return 0;
  const captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;
  const sign = captures[1] === "+" ? -1 : 1;
  const hours = parseInt(captures[2]);
  const minutes = captures[3] && parseInt(captures[3]) || 0;
  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }
  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  const date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  const fourthOfJanuaryDay = date.getUTCDay() || 7;
  const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
const daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }
  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}
const PROCEDURE_TYPES = [
  { value: "crown", label: "Crown" },
  { value: "bridge", label: "Bridge" },
  { value: "denture", label: "Denture" },
  { value: "night_guard", label: "Night Guard" },
  { value: "bleaching_tray", label: "Bleaching Tray" },
  { value: "other", label: "Other" }
];
function LabOrderFormModal({ open, onClose }) {
  const { actor, isFetching } = useActor(createActor);
  const [patientId, setPatientId] = reactExports.useState("");
  const [treatmentId, setTreatmentId] = reactExports.useState("");
  const [labName, setLabName] = reactExports.useState("");
  const [procedureType, setProcedureType] = reactExports.useState("");
  const [specifications, setSpecifications] = reactExports.useState("");
  const [cost, setCost] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPatients();
    },
    enabled: !!actor && !isFetching && open
  });
  const { data: treatments = [] } = useQuery({
    queryKey: ["treatments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTreatments(null);
    },
    enabled: !!actor && !isFetching && open
  });
  const patientTreatments = patientId ? treatments.filter((t) => t.patient_id.toString() === patientId) : [];
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.createLabOrder({
        patient_id: BigInt(patientId),
        treatment_id: treatmentId ? BigInt(treatmentId) : void 0,
        lab_name: labName.trim(),
        procedure_type: procedureType,
        specifications: specifications.trim(),
        cost: Number.parseFloat(cost) || 0,
        due_date: dueDate,
        notes: notes.trim()
      });
    },
    onSuccess: () => {
      ue.success("Lab order created");
      handleClose();
    },
    onError: () => {
      ue.error("Failed to create lab order");
    }
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
  const canSubmit = !!patientId && !!labName.trim() && !!procedureType && !!dueDate && !createMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose: handleClose,
      title: "New Lab Order",
      description: "Send a dental lab work order",
      size: "lg",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: handleClose,
            "data-ocid": "lab-form.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => createMutation.mutate(),
            loading: createMutation.isPending,
            disabled: !canSubmit,
            "data-ocid": "lab-form.submit_button",
            children: "Create Lab Order"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Patient *",
              value: patientId,
              onChange: setPatientId,
              placeholder: "Select patient...",
              options: patients.map((p) => ({
                value: p.id.toString(),
                label: `${p.first_name} ${p.last_name}`
              })),
              "data-ocid": "lab-form.patient_select"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Treatment (optional)",
              value: treatmentId,
              onChange: setTreatmentId,
              placeholder: "Link to treatment...",
              options: patientTreatments.map((t) => ({
                value: t.id.toString(),
                label: t.title
              })),
              disabled: !patientId,
              "data-ocid": "lab-form.treatment_select"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Lab Name *",
              value: labName,
              onChange: (e) => setLabName(e.target.value),
              placeholder: "e.g. Sunrise Dental Labs",
              "data-ocid": "lab-form.lab_name_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              label: "Procedure Type *",
              value: procedureType,
              onChange: setProcedureType,
              placeholder: "Select procedure...",
              options: PROCEDURE_TYPES,
              "data-ocid": "lab-form.procedure_type_select"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "lab-specifications",
              className: "text-sm font-medium text-foreground",
              children: "Specifications"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "lab-specifications",
              value: specifications,
              onChange: (e) => setSpecifications(e.target.value),
              placeholder: "Shade, size, material, and any special instructions...",
              rows: 3,
              "data-ocid": "lab-form.specifications_textarea",
              className: "flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-colors"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Cost (₹)",
              type: "number",
              min: "0",
              step: "0.01",
              value: cost,
              onChange: (e) => setCost(e.target.value),
              placeholder: "0.00",
              "data-ocid": "lab-form.cost_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              label: "Due Date *",
              type: "date",
              value: dueDate,
              onChange: (e) => setDueDate(e.target.value),
              "data-ocid": "lab-form.due_date_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "lab-notes",
              className: "text-sm font-medium text-foreground",
              children: "Notes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "lab-notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Additional notes for the lab...",
              rows: 2,
              "data-ocid": "lab-form.notes_textarea",
              className: "flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-colors"
            }
          )
        ] })
      ] })
    }
  );
}
const STATUS_OPTIONS = [
  { value: LabOrderStatus.pending, label: "Pending" },
  { value: LabOrderStatus.inProgress, label: "In Progress" },
  { value: LabOrderStatus.completed, label: "Completed" },
  { value: LabOrderStatus.cancelled, label: "Cancelled" }
];
const STATUS_COLORS = {
  [LabOrderStatus.pending]: "badge-pending",
  [LabOrderStatus.inProgress]: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  [LabOrderStatus.completed]: "badge-completed",
  [LabOrderStatus.cancelled]: "badge-rejected"
};
const STATUS_LABELS = {
  [LabOrderStatus.pending]: "Pending",
  [LabOrderStatus.inProgress]: "In Progress",
  [LabOrderStatus.completed]: "Completed",
  [LabOrderStatus.cancelled]: "Cancelled"
};
function LabStatusModal({ order, open, onClose }) {
  const { actor } = useActor(createActor);
  const [newStatus, setNewStatus] = reactExports.useState(order.status);
  const [completedDate, setCompletedDate] = reactExports.useState(
    order.completed_date ?? format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")
  );
  const [notes, setNotes] = reactExports.useState("");
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const completed = newStatus === LabOrderStatus.completed ? completedDate : null;
      return actor.updateLabOrderStatus(order.id, newStatus, completed);
    },
    onSuccess: () => {
      ue.success("Lab order status updated");
      onClose();
    },
    onError: () => {
      ue.error("Failed to update status");
    }
  });
  const isCompleting = newStatus === LabOrderStatus.completed;
  const isSame = newStatus === order.status;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: "Update Lab Order Status",
      description: `Order for ${order.lab_name} · ${order.procedure_type}`,
      size: "sm",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "lab-status.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => updateMutation.mutate(),
            loading: updateMutation.isPending,
            disabled: isSame || updateMutation.isPending,
            "data-ocid": "lab-status.confirm_button",
            children: "Update Status"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Current Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`,
              children: STATUS_LABELS[order.status]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            label: "New Status",
            value: newStatus,
            onChange: (v) => setNewStatus(v),
            options: STATUS_OPTIONS,
            "data-ocid": "lab-status.status_select"
          }
        ),
        isCompleting && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Completed Date",
            type: "date",
            value: completedDate,
            onChange: (e) => setCompletedDate(e.target.value),
            "data-ocid": "lab-status.completed_date_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "lab-status-notes",
              className: "text-sm font-medium text-foreground",
              children: "Notes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "lab-status-notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Reason for status change or additional notes...",
              rows: 3,
              "data-ocid": "lab-status.notes_textarea",
              className: "flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-colors"
            }
          )
        ] }),
        newStatus === LabOrderStatus.cancelled && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2",
            "data-ocid": "lab-status.error_state",
            children: "Cancelling this lab order cannot be undone. The lab will be notified."
          }
        )
      ] })
    }
  );
}
const LAB_STATUS_CONFIG = {
  [LabOrderStatus.pending]: {
    label: "Pending",
    className: "badge-pending"
  },
  [LabOrderStatus.inProgress]: {
    label: "In Progress",
    className: "badge-in-progress"
  },
  [LabOrderStatus.completed]: {
    label: "Completed",
    className: "badge-completed"
  },
  [LabOrderStatus.cancelled]: {
    label: "Cancelled",
    className: "badge-rejected"
  }
};
function LabStatusBadge({ status }) {
  const config = LAB_STATUS_CONFIG[status] ?? LAB_STATUS_CONFIG[LabOrderStatus.pending];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`,
      children: config.label
    }
  );
}
const FILTER_LABELS = [
  { value: "all", label: "All" },
  { value: LabOrderStatus.pending, label: "Pending" },
  { value: LabOrderStatus.inProgress, label: "In Progress" },
  { value: LabOrderStatus.completed, label: "Completed" },
  { value: LabOrderStatus.cancelled, label: "Cancelled" }
];
function LabOrdersPage() {
  const [filter, setFilter] = reactExports.useState("all");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [updateTarget, setUpdateTarget] = reactExports.useState(null);
  const { data: labOrders = [], isLoading } = useLabOrders();
  const { data: patients = [] } = usePatients();
  const patientMap = new Map(patients.map((p) => [p.id.toString(), p]));
  const getPatientName = (id) => {
    const p = patientMap.get(id.toString());
    return p ? `${p.first_name} ${p.last_name}` : `#${id}`;
  };
  const isOverdue = (order) => order.status !== LabOrderStatus.completed && order.status !== LabOrderStatus.cancelled && !!order.due_date && isPast(parseISO(order.due_date));
  const filtered = filter === "all" ? labOrders : labOrders.filter((o) => o.status === filter);
  const overdueCount = labOrders.filter(isOverdue).length;
  const columns = [
    {
      key: "patient",
      header: "Patient",
      render: (o) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: getPatientName(o.patient_id) })
    },
    {
      key: "lab_name",
      header: "Lab",
      render: (o) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: o.lab_name })
    },
    {
      key: "procedure_type",
      header: "Procedure",
      render: (o) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-muted-foreground", children: o.procedure_type })
    },
    {
      key: "status",
      header: "Status",
      render: (o) => /* @__PURE__ */ jsxRuntimeExports.jsx(LabStatusBadge, { status: o.status })
    },
    {
      key: "due_date",
      header: "Due Date",
      render: (o) => {
        const overdue = isOverdue(o);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `tabular-nums text-sm ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`,
              children: o.due_date ? format(parseISO(o.due_date), "dd MMM yyyy") : "—"
            }
          ),
          overdue && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-destructive/15 text-destructive border border-destructive/25", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5" }),
            "Overdue"
          ] })
        ] });
      }
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `lab-orders.edit_button.${i + 1}`,
          onClick: () => setUpdateTarget(o),
          className: "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" }),
            "Update Status"
          ]
        }
      )
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "lab-orders.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Lab Orders",
        description: "Track dental lab work and manage order status",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setShowCreate(true),
            "data-ocid": "lab-orders.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "New Lab Order"
            ]
          }
        )
      }
    ),
    overdueCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-sm text-destructive",
        "data-ocid": "lab-orders.overdue_alert",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: overdueCount }),
            " lab order",
            overdueCount > 1 ? "s are" : " is",
            " past due date."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 flex-wrap",
        "data-ocid": "lab-orders.filter.tab",
        children: [
          FILTER_LABELS.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setFilter(value),
              className: `h-8 px-3 rounded-lg text-sm font-medium transition-colors ${filter === value ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`,
              children: label
            },
            value
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
            filtered.length,
            " order",
            filtered.length !== 1 ? "s" : ""
          ] })
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center py-20",
        "data-ocid": "lab-orders.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-7 w-7" }),
        title: "No lab orders found",
        description: filter === "all" ? "Create a lab order to send work to a dental laboratory." : `No ${filter} orders.`,
        action: filter === "all" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setShowCreate(true),
            "data-ocid": "lab-orders.empty_state_add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "New Lab Order"
            ]
          }
        ) : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "lab-orders.table", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Table,
      {
        columns,
        data: filtered,
        keyExtractor: (o) => o.id.toString(),
        stickyHeader: true
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LabOrderFormModal,
      {
        open: showCreate,
        onClose: () => setShowCreate(false)
      }
    ),
    updateTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LabStatusModal,
      {
        order: updateTarget,
        open: !!updateTarget,
        onClose: () => setUpdateTarget(null)
      }
    )
  ] });
}
export {
  LabOrdersPage as default
};
