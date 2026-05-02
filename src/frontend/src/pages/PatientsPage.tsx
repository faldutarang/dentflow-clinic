import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Table } from "@/components/shared/Table";
import { usePatients, useSearchPatients } from "@/hooks/usePatients";
import type { Patient } from "@/types";
import { Plus, Search, Users, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PatientFormModal } from "../components/patients/PatientFormModal";

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function bloodLabel(bg: string) {
  return bg.replace("Pos", "+").replace("Neg", "−").replace("unknown", "?");
}

type SortField = "name" | "age" | "lastVisit";
type SortDir = "asc" | "desc";

interface PatientsPageProps {
  onNavigate?: (path: string) => void;
}

export default function PatientsPage({ onNavigate }: PatientsPageProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [addOpen, setAddOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: allPatients = [], isLoading: allLoading } = usePatients();
  const { data: searchResults = [], isFetching: searchFetching } =
    useSearchPatients(debouncedQuery);

  const isSearching = debouncedQuery.trim().length > 0;
  const isLoading = allLoading || (isSearching && searchFetching);
  const rawPatients: Patient[] = isSearching ? searchResults : allPatients;

  const handleQueryChange = useCallback((val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const patients = useMemo(() => {
    return [...rawPatients].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name")
        cmp = `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`,
        );
      else if (sortField === "age")
        cmp = calcAge(a.date_of_birth) - calcAge(b.date_of_birth);
      else if (sortField === "lastVisit")
        cmp = Number(a.updated_at) - Number(b.updated_at);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rawPatients, sortField, sortDir]);

  const SortArrow = ({ field }: { field: SortField }) =>
    sortField === field ? (
      <span className="ml-1 text-primary">{sortDir === "asc" ? "↑" : "↓"}</span>
    ) : (
      <span className="ml-1 opacity-20">↕</span>
    );

  const columns = [
    {
      key: "name",
      header: "Patient",
      render: (p: Patient) => (
        <button
          type="button"
          onClick={() => onNavigate?.(`/patients/${p.id}`)}
          className="flex flex-col text-left group"
          data-ocid="patients.patient_name.link"
        >
          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
            {p.first_name} {p.last_name}
          </span>
          <span className="text-xs text-muted-foreground">
            {p.email || "—"}
          </span>
        </button>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (p: Patient) => (
        <span className="tabular-nums text-sm">{p.phone || "—"}</span>
      ),
    },
    {
      key: "age",
      header: (
        <button
          type="button"
          onClick={() => handleSort("age")}
          className="flex items-center hover:text-foreground transition-colors"
          data-ocid="patients.sort-age.toggle"
        >
          Age <SortArrow field="age" />
        </button>
      ) as unknown as string,
      render: (p: Patient) => (
        <span className="text-sm">{calcAge(p.date_of_birth)} yrs</span>
      ),
      align: "center" as const,
    },
    {
      key: "gender",
      header: "Gender",
      render: (p: Patient) => (
        <span className="capitalize text-sm text-muted-foreground">
          {p.gender}
        </span>
      ),
    },
    {
      key: "blood",
      header: "Blood",
      render: (p: Patient) => (
        <span className="font-mono text-xs bg-muted/30 border border-border px-2 py-0.5 rounded uppercase">
          {bloodLabel(p.blood_group)}
        </span>
      ),
      align: "center" as const,
    },
    {
      key: "lastVisit",
      header: (
        <button
          type="button"
          onClick={() => handleSort("lastVisit")}
          className="flex items-center hover:text-foreground transition-colors"
          data-ocid="patients.sort-lastvisit.toggle"
        >
          Last Visit <SortArrow field="lastVisit" />
        </button>
      ) as unknown as string,
      render: (p: Patient) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(p.updated_at)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => <StatusBadge status="active" />,
      align: "center" as const,
    },
    {
      key: "actions",
      header: "",
      render: (p: Patient) => (
        <button
          type="button"
          onClick={() => onNavigate?.(`/patients/${p.id}`)}
          className="text-xs text-primary hover:underline font-medium"
          data-ocid="patients.view_details.link"
        >
          View →
        </button>
      ),
      align: "right" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6" data-ocid="patients.page">
      <PageHeader
        title="Patients"
        description={`${allPatients.length} registered patient${allPatients.length !== 1 ? "s" : ""}`}
        actions={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            data-ocid="patients.add_patient.primary_button"
            className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Patient
          </button>
        }
      />

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Search by name or phone..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          data-ocid="patients.search_input"
          className="flex h-9 w-full rounded-lg border border-input bg-card pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => handleQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-24"
          data-ocid="patients.loading_state"
        >
          <LoadingSpinner size="lg" label="Loading patients..." />
        </div>
      ) : patients.length === 0 ? (
        <div data-ocid="patients.empty_state">
          <EmptyState
            icon={<Users className="h-7 w-7" />}
            title={isSearching ? "No patients found" : "No patients registered"}
            description={
              isSearching
                ? `No results for "${debouncedQuery}". Try a different name or phone number.`
                : "Add your first patient to get started."
            }
            action={
              !isSearching ? (
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  data-ocid="patients.empty_add.primary_button"
                  className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add Patient
                </button>
              ) : null
            }
          />
        </div>
      ) : (
        <Table
          columns={columns as Parameters<typeof Table>[0]["columns"]}
          data={patients}
          keyExtractor={(p, i) => p.id?.toString() ?? String(i)}
          stickyHeader
        />
      )}

      <PatientFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode="add"
      />
    </div>
  );
}
