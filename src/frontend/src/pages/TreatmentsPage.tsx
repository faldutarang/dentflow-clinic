import { cn } from "@/lib/utils";
import { Plus, Stethoscope } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { EmptyState } from "../components/shared/EmptyState";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { StatusBadge } from "../components/shared/StatusBadge";
import { Table } from "../components/shared/Table";
import { TreatmentFormModal } from "../components/treatments/TreatmentFormModal";
import { usePatients } from "../hooks/usePatients";
import { useStaffMembers } from "../hooks/useStaff";
import { useTreatments } from "../hooks/useTreatments";
import { TreatmentStatus } from "../types";
import type { Treatment } from "../types";
import TreatmentDetailPage from "./TreatmentDetailPage";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: TreatmentStatus.active, label: "In Progress" },
  { value: TreatmentStatus.completed, label: "Completed" },
  { value: TreatmentStatus.cancelled, label: "Cancelled" },
];

const STATUS_VARIANT_MAP: Record<TreatmentStatus, string> = {
  [TreatmentStatus.active]: "inProgress",
  [TreatmentStatus.completed]: "completed",
  [TreatmentStatus.cancelled]: "cancelled",
};

export default function TreatmentsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [editTreatment, setEditTreatment] = useState<Treatment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<bigint | null>(
    null,
  );

  const { data: treatments, isLoading } = useTreatments();
  const { data: patients } = usePatients();
  const { data: staffMembers } = useStaffMembers();

  if (isLoading) return <PageLoader />;

  const patientMap = new Map(
    (patients ?? []).map((p) => [
      p.id.toString(),
      `${p.first_name} ${p.last_name}`,
    ]),
  );
  const staffMap = new Map(
    (staffMembers ?? []).map((s) => [s.id.toString(), s.name]),
  );

  const filtered = (treatments ?? []).filter(
    (t) => statusFilter === "all" || t.status === statusFilter,
  );

  const columns = [
    {
      key: "title",
      header: "Treatment Plan",
      render: (t: Treatment) => (
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {t.title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.procedures.length} procedure
            {t.procedures.length !== 1 ? "s" : ""}
          </p>
        </div>
      ),
    },
    {
      key: "patient",
      header: "Patient",
      render: (t: Treatment) => (
        <span className="text-sm text-foreground">
          {patientMap.get(t.patient_id.toString()) ?? "—"}
        </span>
      ),
    },
    {
      key: "dentist",
      header: "Dentist",
      render: (t: Treatment) => (
        <span className="text-sm text-foreground">
          {staffMap.get(t.dentist_id.toString()) ?? "—"}
        </span>
      ),
    },
    {
      key: "estimated_cost",
      header: "Est. Cost",
      align: "right" as const,
      render: (t: Treatment) => (
        <span className="tabular-nums text-sm font-medium text-foreground">
          ₹{t.estimated_cost.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t: Treatment) => (
        <StatusBadge
          status={
            STATUS_VARIANT_MAP[t.status] as Parameters<
              typeof StatusBadge
            >[0]["status"]
          }
        />
      ),
    },
    {
      key: "actions",
      header: "",
      render: (t: Treatment) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedTreatmentId(t.id)}
            data-ocid="treatments.view_button"
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => setEditTreatment(t)}
            data-ocid="treatments.edit_button"
            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  // If detail view selected, render it inline
  if (selectedTreatmentId !== null) {
    return (
      <TreatmentDetailPage
        treatmentId={selectedTreatmentId}
        onBack={() => setSelectedTreatmentId(null)}
      />
    );
  }

  return (
    <div data-ocid="treatments.page">
      <PageHeader
        title="Treatments"
        description="Manage treatment plans and procedures"
        actions={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            data-ocid="treatments.add_button"
            className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Treatment
          </button>
        }
      />

      {/* Filters */}
      <div
        className="flex items-center gap-2 mb-5"
        role="tablist"
        aria-label="Status filters"
      >
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={statusFilter === opt.value}
            onClick={() => setStatusFilter(opt.value)}
            data-ocid={`treatments.filter.${opt.value}`}
            className={cn(
              "h-8 px-3 rounded-lg text-xs font-medium transition-colors border",
              statusFilter === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted",
            )}
          >
            {opt.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} treatment{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="h-7 w-7" />}
          title="No treatment plans"
          description={
            statusFilter === "all"
              ? "Create your first treatment plan to get started."
              : `No ${statusFilter} treatments found.`
          }
          action={
            statusFilter === "all" ? (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                New Treatment
              </button>
            ) : undefined
          }
        />
      ) : (
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(t) => t.id.toString()}
          emptyMessage="No treatments found"
          stickyHeader
        />
      )}

      <TreatmentFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        patients={patients ?? []}
        staffMembers={staffMembers ?? []}
      />

      {editTreatment && (
        <TreatmentFormModal
          open={!!editTreatment}
          onClose={() => setEditTreatment(null)}
          patients={patients ?? []}
          staffMembers={staffMembers ?? []}
          treatment={editTreatment}
        />
      )}
    </div>
  );
}
