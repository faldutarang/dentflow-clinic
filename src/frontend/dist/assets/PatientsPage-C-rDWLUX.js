import { r as reactExports, j as jsxRuntimeExports, d as Search, e as LoadingSpinner, U as Users } from "./index-CRusxQeF.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
import { T as Table } from "./Table-ByTzrkVY.js";
import { u as usePatients, a as useSearchPatients } from "./usePatients-1jxdmde2.js";
import { P as PatientFormModal } from "./PatientFormModal-Cpx3SyKq.js";
import { P as Plus } from "./plus-CqSfRGkC.js";
import { X } from "./Select-Dw0AWwQu.js";
import "./useMutation-C_my6RdQ.js";
function calcAge(dob) {
  const birth = new Date(dob);
  const now = /* @__PURE__ */ new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || m === 0 && now.getDate() < birth.getDate()) age--;
  return age;
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function bloodLabel(bg) {
  return bg.replace("Pos", "+").replace("Neg", "−").replace("unknown", "?");
}
function PatientsPage({ onNavigate }) {
  const [query, setQuery] = reactExports.useState("");
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  const [sortField, setSortField] = reactExports.useState("name");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const debounceRef = reactExports.useRef(null);
  const { data: allPatients = [], isLoading: allLoading } = usePatients();
  const { data: searchResults = [], isFetching: searchFetching } = useSearchPatients(debouncedQuery);
  const isSearching = debouncedQuery.trim().length > 0;
  const isLoading = allLoading || isSearching && searchFetching;
  const rawPatients = isSearching ? searchResults : allPatients;
  const handleQueryChange = reactExports.useCallback((val) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  }, []);
  reactExports.useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );
  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };
  const patients = reactExports.useMemo(() => {
    return [...rawPatients].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name")
        cmp = `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        );
      else if (sortField === "age")
        cmp = calcAge(a.date_of_birth) - calcAge(b.date_of_birth);
      else if (sortField === "lastVisit")
        cmp = Number(a.updated_at) - Number(b.updated_at);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rawPatients, sortField, sortDir]);
  const SortArrow = ({ field }) => sortField === field ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-primary", children: sortDir === "asc" ? "↑" : "↓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 opacity-20", children: "↕" });
  const columns = [
    {
      key: "name",
      header: "Patient",
      render: (p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onNavigate == null ? void 0 : onNavigate(`/patients/${p.id}`),
          className: "flex flex-col text-left group",
          "data-ocid": "patients.patient_name.link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground group-hover:text-primary transition-colors", children: [
              p.first_name,
              " ",
              p.last_name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.email || "—" })
          ]
        }
      )
    },
    {
      key: "phone",
      header: "Phone",
      render: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums text-sm", children: p.phone || "—" })
    },
    {
      key: "age",
      header: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => handleSort("age"),
          className: "flex items-center hover:text-foreground transition-colors",
          "data-ocid": "patients.sort-age.toggle",
          children: [
            "Age ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortArrow, { field: "age" })
          ]
        }
      ),
      render: (p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
        calcAge(p.date_of_birth),
        " yrs"
      ] }),
      align: "center"
    },
    {
      key: "gender",
      header: "Gender",
      render: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-sm text-muted-foreground", children: p.gender })
    },
    {
      key: "blood",
      header: "Blood",
      render: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs bg-muted/30 border border-border px-2 py-0.5 rounded uppercase", children: bloodLabel(p.blood_group) }),
      align: "center"
    },
    {
      key: "lastVisit",
      header: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => handleSort("lastVisit"),
          className: "flex items-center hover:text-foreground transition-colors",
          "data-ocid": "patients.sort-lastvisit.toggle",
          children: [
            "Last Visit ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortArrow, { field: "lastVisit" })
          ]
        }
      ),
      render: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: formatDate(p.updated_at) })
    },
    {
      key: "status",
      header: "Status",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: "active" }),
      align: "center"
    },
    {
      key: "actions",
      header: "",
      render: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onNavigate == null ? void 0 : onNavigate(`/patients/${p.id}`),
          className: "text-xs text-primary hover:underline font-medium",
          "data-ocid": "patients.view_details.link",
          children: "View →"
        }
      ),
      align: "right"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", "data-ocid": "patients.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Patients",
        description: `${allPatients.length} registered patient${allPatients.length !== 1 ? "s" : ""}`,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setAddOpen(true),
            "data-ocid": "patients.add_patient.primary_button",
            className: "inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Add Patient"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "search",
          placeholder: "Search by name or phone...",
          value: query,
          onChange: (e) => handleQueryChange(e.target.value),
          "data-ocid": "patients.search_input",
          className: "flex h-9 w-full rounded-lg border border-input bg-card pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        }
      ),
      query && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => handleQueryChange(""),
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
          "aria-label": "Clear search",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center py-24",
        "data-ocid": "patients.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading patients..." })
      }
    ) : patients.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "patients.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7" }),
        title: isSearching ? "No patients found" : "No patients registered",
        description: isSearching ? `No results for "${debouncedQuery}". Try a different name or phone number.` : "Add your first patient to get started.",
        action: !isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setAddOpen(true),
            "data-ocid": "patients.empty_add.primary_button",
            className: "inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Add Patient"
            ]
          }
        ) : null
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Table,
      {
        columns,
        data: patients,
        keyExtractor: (p, i) => {
          var _a;
          return ((_a = p.id) == null ? void 0 : _a.toString()) ?? String(i);
        },
        stickyHeader: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PatientFormModal,
      {
        open: addOpen,
        onClose: () => setAddOpen(false),
        mode: "add"
      }
    )
  ] });
}
export {
  PatientsPage as default
};
