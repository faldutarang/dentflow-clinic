import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLabOrders } from "@/hooks/useLabOrders";
import { usePatient } from "@/hooks/usePatients";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { useTreatments } from "@/hooks/useTreatments";
import type {
  EntityId,
  LabOrder,
  Patient,
  Prescription,
  Treatment,
} from "@/types";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  ClipboardList,
  Droplet,
  Edit2,
  FileText,
  FlaskConical,
  Heart,
  LayoutGrid,
  Mail,
  MapPin,
  Phone,
  Pill,
  Stethoscope,
  User,
} from "lucide-react";
import { useState } from "react";
import { PatientFormModal } from "../components/patients/PatientFormModal";

type TabId =
  | "overview"
  | "treatments"
  | "chart"
  | "prescriptions"
  | "documents"
  | "lab";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    id: "treatments",
    label: "Treatments",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "chart",
    label: "Dental Chart",
    icon: <Stethoscope className="h-4 w-4" />,
  },
  {
    id: "prescriptions",
    label: "Prescriptions",
    icon: <Pill className="h-4 w-4" />,
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "lab",
    label: "Lab Orders",
    icon: <FlaskConical className="h-4 w-4" />,
  },
];

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

function bloodGroupLabel(bg: string) {
  return bg.replace("Pos", "+").replace("Neg", "−").replace("unknown", "?");
}

// ----- Sub-tabs -----

function OverviewTab({ patient }: { patient: Patient }) {
  const fields = [
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Date of Birth",
      value: patient.date_of_birth,
    },
    {
      icon: <User className="h-4 w-4" />,
      label: "Gender",
      value: patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1),
    },
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
      value: patient.email || "—",
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: "Phone",
      value: patient.phone,
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "Address",
      value: patient.address || "—",
    },
    {
      icon: <Droplet className="h-4 w-4" />,
      label: "Blood Group",
      value: bloodGroupLabel(patient.blood_group),
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Registered",
      value: formatDate(patient.created_at),
    },
  ];

  return (
    <div
      className="grid md:grid-cols-2 gap-6"
      data-ocid="patient-detail.overview.section"
    >
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Registration Info
        </h3>
        <dl className="space-y-3">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <span className="mt-0.5 text-muted-foreground shrink-0">
                {f.icon}
              </span>
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                <dd className="text-sm text-foreground font-medium break-words">
                  {f.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-destructive" />
            Medical History
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {patient.medical_history || "No medical history recorded."}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            Allergies
          </h3>
          {patient.allergies.length === 0 ? (
            <p className="text-sm text-muted-foreground">None reported.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: "oklch(0.58 0.22 25 / 0.12)",
                    color: "oklch(0.58 0.22 25)",
                    border: "1px solid oklch(0.58 0.22 25 / 0.25)",
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TreatmentsTab({ patientId }: { patientId: EntityId }) {
  const { data: treatments = [], isLoading } = useTreatments(patientId);

  if (isLoading)
    return (
      <div
        className="py-16 flex justify-center"
        data-ocid="patient-detail.treatments.loading_state"
      >
        <LoadingSpinner />
      </div>
    );

  if (treatments.length === 0)
    return (
      <div data-ocid="patient-detail.treatments.empty_state">
        <EmptyState
          icon={<Activity className="h-7 w-7" />}
          title="No treatments yet"
          description="Treatment plans will appear here once created."
        />
      </div>
    );

  return (
    <div className="space-y-3" data-ocid="patient-detail.treatments.list">
      {treatments.map((t: Treatment, i: number) => (
        <div
          key={t.id?.toString()}
          className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4"
          data-ocid={`patient-detail.treatments.item.${i + 1}`}
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{t.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.procedures.length} procedure
              {t.procedures.length !== 1 ? "s" : ""} · Est. ₹
              {t.estimated_cost.toLocaleString("en-IN")}
            </p>
            {t.notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {t.notes}
              </p>
            )}
          </div>
          <div className="shrink-0">
            <StatusBadge
              status={t.status as "active" | "completed" | "cancelled"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PrescriptionsTab({ patientId }: { patientId: EntityId }) {
  const { data: prescriptions = [], isLoading } = usePrescriptions(patientId);

  if (isLoading)
    return (
      <div
        className="py-16 flex justify-center"
        data-ocid="patient-detail.prescriptions.loading_state"
      >
        <LoadingSpinner />
      </div>
    );

  if (prescriptions.length === 0)
    return (
      <div data-ocid="patient-detail.prescriptions.empty_state">
        <EmptyState
          icon={<Pill className="h-7 w-7" />}
          title="No prescriptions"
          description="Prescription records will appear here."
        />
      </div>
    );

  return (
    <div className="space-y-3" data-ocid="patient-detail.prescriptions.list">
      {prescriptions.map((rx: Prescription, i: number) => (
        <div
          key={rx.id?.toString()}
          className="bg-card border border-border rounded-xl p-4"
          data-ocid={`patient-detail.prescriptions.item.${i + 1}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">
              Issued {formatDate(rx.created_at)}
            </span>
            <StatusBadge status={rx.is_active ? "active" : "completed"} />
          </div>
          <div className="space-y-2">
            {rx.medications.map((med, mi) => (
              <div
                key={`${med.name}-${mi}`}
                className="flex items-start gap-3 text-sm"
              >
                <span className="h-5 w-5 mt-0.5 flex-shrink-0 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-[10px] text-primary font-bold">
                  {mi + 1}
                </span>
                <div>
                  <p className="font-medium text-foreground">{med.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {med.dosage} · {med.frequency} · {med.duration}
                  </p>
                  {med.notes && (
                    <p className="text-xs text-muted-foreground/70">
                      {med.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LabOrdersTab({ patientId }: { patientId: EntityId }) {
  const { data: orders = [], isLoading } = useLabOrders(patientId);

  if (isLoading)
    return (
      <div
        className="py-16 flex justify-center"
        data-ocid="patient-detail.lab.loading_state"
      >
        <LoadingSpinner />
      </div>
    );

  if (orders.length === 0)
    return (
      <div data-ocid="patient-detail.lab.empty_state">
        <EmptyState
          icon={<FlaskConical className="h-7 w-7" />}
          title="No lab orders"
          description="Lab orders placed for this patient will appear here."
        />
      </div>
    );

  return (
    <div className="space-y-3" data-ocid="patient-detail.lab.list">
      {orders.map((order: LabOrder, i: number) => (
        <div
          key={order.id?.toString()}
          className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4"
          data-ocid={`patient-detail.lab.item.${i + 1}`}
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground">
              {order.procedure_type}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {order.lab_name} · Due {order.due_date} · ₹
              {order.cost.toLocaleString("en-IN")}
            </p>
            {order.notes && (
              <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                {order.notes}
              </p>
            )}
          </div>
          <StatusBadge
            status={
              order.status as
                | "pending"
                | "inProgress"
                | "completed"
                | "cancelled"
            }
          />
        </div>
      ))}
    </div>
  );
}

function DocumentsTab({ patientId: _patientId }: { patientId: EntityId }) {
  // Documents list can be extended — currently shows placeholder since listDocuments requires owner_type
  return (
    <div data-ocid="patient-detail.documents.empty_state">
      <EmptyState
        icon={<FileText className="h-7 w-7" />}
        title="No documents uploaded"
        description="X-rays and clinical documents attached to this patient will appear here."
      />
    </div>
  );
}

function DentalChartTab({
  patientId,
  onNavigate,
}: {
  patientId: EntityId;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      data-ocid="patient-detail.chart.section"
    >
      <div className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center">
        <Stethoscope className="h-8 w-8 text-accent" />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">
          Digital Dental Chart
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          View and annotate the patient&apos;s tooth-by-tooth record.
        </p>
      </div>
      <button
        type="button"
        onClick={() => onNavigate?.(`/dental-chart?patientId=${patientId}`)}
        data-ocid="patient-detail.chart.open_chart.primary_button"
        className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Stethoscope className="h-4 w-4" />
        Open Dental Chart
      </button>
    </div>
  );
}

// ----- Main component -----

interface PatientDetailPageProps {
  patientId?: EntityId;
  onNavigate?: (path: string) => void;
}

export default function PatientDetailPage({
  patientId,
  onNavigate,
}: PatientDetailPageProps) {
  const [tab, setTab] = useState<TabId>("overview");
  const [editOpen, setEditOpen] = useState(false);

  const id = patientId ?? null;
  const { data: patient, isLoading } = usePatient(id);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        data-ocid="patient-detail.loading_state"
      >
        <LoadingSpinner size="lg" label="Loading patient..." />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6" data-ocid="patient-detail.error_state">
        <EmptyState
          icon={<User className="h-7 w-7" />}
          title="Patient not found"
          description="This patient record does not exist or was removed."
          action={
            <button
              type="button"
              onClick={() => onNavigate?.("/patients")}
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Patients
            </button>
          }
        />
      </div>
    );
  }

  const age = calcAge(patient.date_of_birth);
  const allergyCount = patient.allergies.length;

  return (
    <div className="flex flex-col gap-6 p-6" data-ocid="patient-detail.page">
      {/* Back nav */}
      <button
        type="button"
        onClick={() => onNavigate?.("/patients")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        data-ocid="patient-detail.back.link"
      >
        <ArrowLeft className="h-4 w-4" />
        All Patients
      </button>

      {/* Profile header */}
      <div
        className="bg-card border border-border rounded-xl p-6"
        data-ocid="patient-detail.profile.card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
              <span className="font-display text-xl font-bold text-primary">
                {patient.first_name[0]}
                {patient.last_name[0]}
              </span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {patient.first_name} {patient.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-sm text-muted-foreground">
                  {age} yrs ·{" "}
                  {patient.gender.charAt(0).toUpperCase() +
                    patient.gender.slice(1)}
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="font-mono text-xs bg-muted/40 border border-border px-2 py-0.5 rounded text-foreground uppercase">
                  {bloodGroupLabel(patient.blood_group)}
                </span>
                {allergyCount > 0 && (
                  <Badge variant="default" size="sm">
                    {allergyCount} allerg{allergyCount !== 1 ? "ies" : "y"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{patient.phone}</span>
            </div>
            {patient.email && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate max-w-[200px]">{patient.email}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              data-ocid="patient-detail.edit.edit_button"
              className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium border border-border bg-transparent text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border" data-ocid="patient-detail.tabs">
        <nav
          className="flex gap-1 overflow-x-auto pb-0"
          aria-label="Patient detail tabs"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              data-ocid={`patient-detail.tab-${t.id}.tab`}
              className={`
                flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }
              `}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div data-ocid="patient-detail.tab-content.panel">
        {tab === "overview" && <OverviewTab patient={patient} />}
        {tab === "treatments" && <TreatmentsTab patientId={patient.id} />}
        {tab === "chart" && (
          <DentalChartTab patientId={patient.id} onNavigate={onNavigate} />
        )}
        {tab === "prescriptions" && <PrescriptionsTab patientId={patient.id} />}
        {tab === "documents" && <DocumentsTab patientId={patient.id} />}
        {tab === "lab" && <LabOrdersTab patientId={patient.id} />}
      </div>

      <PatientFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        patient={patient}
      />
    </div>
  );
}
