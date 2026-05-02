import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Table } from "@/components/shared/Table";
import { format } from "date-fns";
import { AlertCircle, FileText, Plus, PowerOff, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PrescriptionFormModal } from "../components/prescriptions/PrescriptionFormModal";
import { usePatients } from "../hooks/usePatients";
import {
  useDeactivatePrescription,
  usePrescriptions,
} from "../hooks/usePrescriptions";
import { useStaffMembers } from "../hooks/useStaff";
import type { Prescription } from "../types";

type StatusFilter = "all" | "active" | "deactivated";

function PrintPreviewModal({
  prescription,
  onClose,
  getPatientName,
  getDoctorName,
  formatDate,
}: {
  prescription: Prescription;
  onClose: () => void;
  getPatientName: (id: bigint) => string;
  getDoctorName: (id: bigint) => string;
  formatDate: (ts: bigint) => string;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      data-ocid="prescriptions.print_dialog"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="bg-card rounded-xl border border-border shadow-xl w-full max-w-md mx-4 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Print Prescription
          </h2>
          <button
            type="button"
            data-ocid="prescriptions.print_dialog.close_button"
            onClick={onClose}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div id="prescription-print-area" className="space-y-3 text-sm">
          <div className="border-b border-border pb-3">
            <p className="font-semibold text-foreground text-base">
              Patient: {getPatientName(prescription.patient_id)}
            </p>
            <p className="text-muted-foreground">
              Prescribing Doctor: {getDoctorName(prescription.dentist_id)}
            </p>
            <p className="text-muted-foreground">
              Date: {formatDate(prescription.created_at)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-foreground">Medications:</p>
            {prescription.medications.map((med) => (
              <div
                key={med.name}
                className="pl-3 border-l-2 border-accent/40 text-muted-foreground"
              >
                <p className="font-medium text-foreground">{med.name}</p>
                <p>
                  {med.dosage} — {med.frequency}
                </p>
                {med.notes && <p className="italic">{med.notes}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            data-ocid="prescriptions.print_dialog.cancel_button"
            onClick={onClose}
            className="h-8 px-3 rounded-md text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="prescriptions.print_dialog.confirm_button"
            onClick={() => window.print()}
            className="h-8 px-3 rounded-md text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors inline-flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

function PrescriptionStatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium badge-approved">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium badge-rejected">
      Deactivated
    </span>
  );
}

export default function PrescriptionsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState<bigint | null>(null);
  const [printTarget, setPrintTarget] = useState<Prescription | null>(null);

  const { data: prescriptions = [], isLoading } = usePrescriptions();
  const { data: patients = [] } = usePatients();
  const { data: staffList = [] } = useStaffMembers();
  const deactivateMutation = useDeactivatePrescription();

  const patientMap = new Map(patients.map((p) => [p.id.toString(), p]));
  const staffMap = new Map(staffList.map((s) => [s.id.toString(), s]));

  const filtered = prescriptions.filter((rx) => {
    if (statusFilter === "active") return rx.is_active;
    if (statusFilter === "deactivated") return !rx.is_active;
    return true;
  });

  const getPatientName = (id: bigint) => {
    const p = patientMap.get(id.toString());
    return p ? `${p.first_name} ${p.last_name}` : `#${id}`;
  };

  const getDoctorName = (id: bigint) => {
    const s = staffMap.get(id.toString());
    return s ? s.name : `Dr. #${id}`;
  };

  const formatDate = (ts: bigint) => {
    try {
      return format(new Date(Number(ts / 1_000_000n)), "dd MMM yyyy");
    } catch {
      return "—";
    }
  };

  const handleDeactivate = async (id: bigint) => {
    setDeactivatingId(id);
    try {
      await deactivateMutation.mutateAsync(id);
      toast.success("Prescription deactivated");
    } catch {
      toast.error("Failed to deactivate prescription");
    } finally {
      setDeactivatingId(null);
    }
  };

  const columns = [
    {
      key: "patient",
      header: "Patient",
      render: (rx: Prescription) => (
        <span className="font-medium text-foreground">
          {getPatientName(rx.patient_id)}
        </span>
      ),
    },
    {
      key: "doctor",
      header: "Dentist",
      render: (rx: Prescription) => (
        <span className="text-accent">{getDoctorName(rx.dentist_id)}</span>
      ),
    },
    {
      key: "medications",
      header: "Medications",
      align: "center" as const,
      render: (rx: Prescription) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20">
          {rx.medications.length}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (rx: Prescription) => (
        <PrescriptionStatusBadge isActive={rx.is_active} />
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (rx: Prescription) => (
        <span className="text-muted-foreground tabular-nums">
          {formatDate(rx.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right" as const,
      render: (rx: Prescription, i: number) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            data-ocid={`prescriptions.print_button.${i + 1}`}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Print prescription"
            onClick={() => setPrintTarget(rx)}
          >
            <Printer className="h-3 w-3" />
            Print
          </button>
          {rx.is_active && (
            <button
              type="button"
              data-ocid={`prescriptions.deactivate_button.${i + 1}`}
              onClick={() => handleDeactivate(rx.id)}
              disabled={deactivatingId === rx.id}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              aria-label="Deactivate prescription"
            >
              <PowerOff className="h-3 w-3" />
              Deactivate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6" data-ocid="prescriptions.page">
      <PageHeader
        title="Prescriptions"
        description="Manage digital prescriptions for patients"
        actions={
          <Button
            onClick={() => setShowCreate(true)}
            data-ocid="prescriptions.add_button"
          >
            <Plus className="h-4 w-4" />
            New Prescription
          </Button>
        }
      />

      {/* Filters */}
      <div
        className="flex items-center gap-2"
        data-ocid="prescriptions.filter.tab"
      >
        {(["all", "active", "deactivated"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`h-8 px-3 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === f
                ? "bg-accent/15 text-accent border border-accent/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} prescription{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-20"
          data-ocid="prescriptions.loading_state"
        >
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title="No prescriptions found"
          description={
            statusFilter === "all"
              ? "Create a prescription for a patient to get started."
              : `No ${statusFilter} prescriptions.`
          }
          action={
            statusFilter === "all" ? (
              <Button
                onClick={() => setShowCreate(true)}
                data-ocid="prescriptions.empty_state_add_button"
              >
                <Plus className="h-4 w-4" />
                New Prescription
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div data-ocid="prescriptions.table">
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(rx) => rx.id.toString()}
            stickyHeader
          />
        </div>
      )}

      {/* Role notice */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/15 text-xs text-accent">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        Prescription creation requires Doctor role.
      </div>

      <PrescriptionFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {printTarget && (
        <PrintPreviewModal
          prescription={printTarget}
          onClose={() => setPrintTarget(null)}
          getPatientName={getPatientName}
          getDoctorName={getDoctorName}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
