import {
  Calendar,
  ClipboardList,
  FlaskConical,
  Package,
  PlusCircle,
  Receipt,
  Stethoscope,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { StatCard } from "../components/shared/Card";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { StatusBadge } from "../components/shared/StatusBadge";
import { Table } from "../components/shared/Table";
import { useInvoices } from "../hooks/useBilling";
import { useExpiryAlerts, useLowStockAlerts } from "../hooks/useInventory";
import { useLabOrders } from "../hooks/useLabOrders";
import { usePatients } from "../hooks/usePatients";
import { usePrescriptions } from "../hooks/usePrescriptions";
import { useStaffMembers } from "../hooks/useStaff";
import { useTreatments } from "../hooks/useTreatments";
import type {
  Invoice,
  LabOrder,
  Patient,
  StaffMember,
  StaffRole,
  Treatment,
} from "../types";
import { InvoiceStatus, LabOrderStatus, TreatmentStatus } from "../types";

interface DashboardPageProps {
  role: StaffRole;
  staff: StaffMember | null;
  onNavigate: (path: string) => void;
}

// ─── Quick Action Button ────────────────────────────────────────────────────
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  accent: string;
  ocid: string;
  onClick: () => void;
}

function QuickAction({ icon, label, accent, ocid, onClick }: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all duration-200 group"
    >
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </button>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({
  title,
  icon,
  linkLabel,
  linkOcid,
  onLink,
}: {
  title: string;
  icon?: React.ReactNode;
  linkLabel?: string;
  linkOcid?: string;
  onLink?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {linkLabel && onLink && (
        <button
          type="button"
          onClick={onLink}
          data-ocid={linkOcid}
          className="text-xs text-primary hover:underline"
        >
          {linkLabel}
        </button>
      )}
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
function AdminDashboard({
  patients,
  invoices,
  staff,
  lowStock,
  onNavigate,
}: {
  patients: Patient[];
  invoices: Invoice[];
  staff: StaffMember[];
  lowStock: ReturnType<typeof useLowStockAlerts>["data"];
  onNavigate: (p: string) => void;
}) {
  const today = new Date().toDateString();
  const todayAppts = invoices.filter(
    (inv) =>
      new Date(Number(inv.created_at / 1_000_000n)).toDateString() === today,
  ).length;

  const monthlyRevenue = invoices
    .filter((inv) => {
      const d = new Date(Number(inv.created_at / 1_000_000n));
      const now = new Date();
      return (
        inv.status === InvoiceStatus.paid &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((s, inv) => s + inv.total, 0);

  const pendingInvoices = invoices.filter(
    (inv) =>
      inv.status === InvoiceStatus.issued ||
      inv.status === InvoiceStatus.partiallyPaid,
  );

  const recentPatients = [...patients]
    .sort((a, b) => Number(b.created_at - a.created_at))
    .slice(0, 5);

  const recentInvoices = [...invoices]
    .sort((a, b) => Number(b.created_at - a.created_at))
    .slice(0, 5);

  const activeStaff = staff.filter((s) => s.is_active).length;

  return (
    <>
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div data-ocid="dashboard.total_patients.card">
          <StatCard
            label="Total Patients"
            value={patients.length}
            icon={<Users className="h-5 w-5" />}
            accent="doctor"
          />
        </div>
        <div data-ocid="dashboard.today_appointments.card">
          <StatCard
            label="Today's Activity"
            value={todayAppts}
            icon={<Calendar className="h-5 w-5" />}
            accent="default"
          />
        </div>
        <div data-ocid="dashboard.monthly_revenue.card">
          <StatCard
            label="Monthly Revenue"
            value={`₹${monthlyRevenue.toLocaleString("en-IN")}`}
            icon={<Receipt className="h-5 w-5" />}
            accent="admin"
          />
        </div>
        <div data-ocid="dashboard.pending_invoices.card">
          <StatCard
            label="Pending Invoices"
            value={pendingInvoices.length}
            icon={<Receipt className="h-5 w-5" />}
            accent={pendingInvoices.length > 5 ? "warning" : "default"}
          />
        </div>
        <div data-ocid="dashboard.low_stock.card">
          <StatCard
            label="Low Stock Items"
            value={(lowStock ?? []).length}
            icon={<Package className="h-5 w-5" />}
            accent={(lowStock ?? []).length > 0 ? "destructive" : "default"}
          />
        </div>
        <div data-ocid="dashboard.active_staff.card">
          <StatCard
            label="Staff Active"
            value={activeStaff}
            icon={<UserCheck className="h-5 w-5" />}
            accent="receptionist"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-0.5">
          Quick Actions
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <QuickAction
            icon={<UserPlus className="h-5 w-5" />}
            label="Add Patient"
            accent="oklch(0.62 0.18 200)"
            ocid="dashboard.add_patient.button"
            onClick={() => onNavigate("/patients")}
          />
          <QuickAction
            icon={<Receipt className="h-5 w-5" />}
            label="Create Invoice"
            accent="oklch(0.74 0.16 78)"
            ocid="dashboard.create_invoice.button"
            onClick={() => onNavigate("/billing")}
          />
          <QuickAction
            icon={<UserPlus className="h-5 w-5" />}
            label="Add Staff"
            accent="oklch(0.65 0.17 155)"
            ocid="dashboard.add_staff.button"
            onClick={() => onNavigate("/staff")}
          />
          <QuickAction
            icon={<Stethoscope className="h-5 w-5" />}
            label="New Treatment"
            accent="oklch(0.62 0.18 200)"
            ocid="dashboard.new_treatment.button"
            onClick={() => onNavigate("/treatments")}
          />
          <QuickAction
            icon={<FlaskConical className="h-5 w-5" />}
            label="Lab Orders"
            accent="oklch(0.56 0.15 105)"
            ocid="dashboard.lab_orders.button"
            onClick={() => onNavigate("/lab-orders")}
          />
          <QuickAction
            icon={<Package className="h-5 w-5" />}
            label="Inventory"
            accent="oklch(0.58 0.04 265)"
            ocid="dashboard.inventory.button"
            onClick={() => onNavigate("/inventory")}
          />
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="dashboard.recent_patients.list"
        >
          <SectionHeader
            title="Recent Patients"
            icon={<Users className="h-4 w-4 text-[oklch(0.62_0.18_200)]" />}
            linkLabel="View all"
            linkOcid="dashboard.view_all_patients.link"
            onLink={() => onNavigate("/patients")}
          />
          <Table
            columns={[
              {
                key: "name",
                header: "Patient",
                render: (row: Patient) => `${row.first_name} ${row.last_name}`,
              },
              { key: "phone", header: "Phone" },
              {
                key: "created_at",
                header: "Registered",
                render: (row: Patient) =>
                  new Date(
                    Number(row.created_at / 1_000_000n),
                  ).toLocaleDateString("en-IN"),
              },
            ]}
            data={recentPatients}
            keyExtractor={(row) => row.id.toString()}
            emptyMessage="No patients registered yet"
          />
        </div>

        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="dashboard.recent_invoices.list"
        >
          <SectionHeader
            title="Recent Invoices"
            icon={<Receipt className="h-4 w-4 text-[oklch(0.74_0.16_78)]" />}
            linkLabel="View all"
            linkOcid="dashboard.view_all_invoices.link"
            onLink={() => onNavigate("/billing")}
          />
          <Table
            columns={[
              {
                key: "id",
                header: "Invoice",
                render: (row: Invoice) => `#${row.id}`,
              },
              {
                key: "total",
                header: "Amount",
                align: "right",
                render: (row: Invoice) =>
                  `₹${row.total.toLocaleString("en-IN")}`,
              },
              {
                key: "status",
                header: "Status",
                render: (row: Invoice) => <StatusBadge status={row.status} />,
              },
            ]}
            data={recentInvoices}
            keyExtractor={(row) => row.id.toString()}
            emptyMessage="No invoices yet"
          />
        </div>
      </div>
    </>
  );
}

// ─── Doctor Dashboard ─────────────────────────────────────────────────────────
function DoctorDashboard({
  patients,
  treatments,
  labOrders,
  prescriptions,
  onNavigate,
}: {
  patients: Patient[];
  treatments: Treatment[];
  labOrders: LabOrder[];
  prescriptions: ReturnType<typeof usePrescriptions>["data"];
  onNavigate: (p: string) => void;
}) {
  const pendingLab = labOrders.filter(
    (o) =>
      o.status === LabOrderStatus.pending ||
      o.status === LabOrderStatus.inProgress,
  );
  const activePrescriptions = (prescriptions ?? []).filter(
    (p) => p.is_active,
  ).length;
  const inProgress = treatments.filter(
    (t) => t.status === TreatmentStatus.active,
  ).length;

  const recentTreatments = [...treatments]
    .sort((a, b) => Number(b.updated_at - a.updated_at))
    .slice(0, 6);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div data-ocid="dashboard.pending_lab.card">
          <StatCard
            label="Pending Lab Orders"
            value={pendingLab.length}
            icon={<FlaskConical className="h-5 w-5" />}
            accent={pendingLab.length > 0 ? "warning" : "default"}
          />
        </div>
        <div data-ocid="dashboard.active_prescriptions.card">
          <StatCard
            label="Active Prescriptions"
            value={activePrescriptions}
            icon={<ClipboardList className="h-5 w-5" />}
            accent="doctor"
          />
        </div>
        <div data-ocid="dashboard.treatments_in_progress.card">
          <StatCard
            label="Treatments In Progress"
            value={inProgress}
            icon={<Stethoscope className="h-5 w-5" />}
            accent="doctor"
          />
        </div>
        <div data-ocid="dashboard.total_patients.card">
          <StatCard
            label="Total Patients"
            value={patients.length}
            icon={<Users className="h-5 w-5" />}
            accent="default"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Treatments */}
        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="dashboard.recent_treatments.list"
        >
          <SectionHeader
            title="Recent Treatments"
            icon={
              <Stethoscope className="h-4 w-4 text-[oklch(0.62_0.18_200)]" />
            }
            linkLabel="View all"
            linkOcid="dashboard.view_all_treatments.link"
            onLink={() => onNavigate("/treatments")}
          />
          <Table
            columns={[
              { key: "title", header: "Treatment" },
              {
                key: "estimated_cost",
                header: "Est. Cost",
                align: "right",
                render: (row: Treatment) =>
                  `₹${row.estimated_cost.toLocaleString("en-IN")}`,
              },
              {
                key: "status",
                header: "Status",
                render: (row: Treatment) => <StatusBadge status={row.status} />,
              },
            ]}
            data={recentTreatments}
            keyExtractor={(row) => row.id.toString()}
            emptyMessage="No treatments yet"
          />
        </div>

        {/* Pending Lab Orders */}
        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="dashboard.pending_lab_orders.list"
        >
          <SectionHeader
            title="Pending Lab Orders"
            icon={
              <FlaskConical className="h-4 w-4 text-[oklch(0.56_0.15_105)]" />
            }
            linkLabel="View all"
            linkOcid="dashboard.view_all_lab_orders.link"
            onLink={() => onNavigate("/lab-orders")}
          />
          <Table
            columns={[
              { key: "lab_name", header: "Lab" },
              { key: "procedure_type", header: "Procedure" },
              { key: "due_date", header: "Due" },
              {
                key: "status",
                header: "Status",
                render: (row: LabOrder) => <StatusBadge status={row.status} />,
              },
            ]}
            data={pendingLab.slice(0, 5)}
            keyExtractor={(row) => row.id.toString()}
            emptyMessage="No pending lab orders"
          />
        </div>
      </div>
    </>
  );
}

// ─── Receptionist Dashboard ───────────────────────────────────────────────────
function ReceptionistDashboard({
  patients,
  invoices,
  lowStock,
  expiryAlerts,
  onNavigate,
}: {
  patients: Patient[];
  invoices: Invoice[];
  lowStock: ReturnType<typeof useLowStockAlerts>["data"];
  expiryAlerts: ReturnType<typeof useExpiryAlerts>["data"];
  onNavigate: (p: string) => void;
}) {
  const today = new Date().toDateString();
  const todayRegistrations = patients.filter(
    (p) => new Date(Number(p.created_at / 1_000_000n)).toDateString() === today,
  ).length;

  const pendingPayments = invoices.filter(
    (inv) =>
      inv.status === InvoiceStatus.issued ||
      inv.status === InvoiceStatus.partiallyPaid,
  );

  const recentPatients = [...patients]
    .sort((a, b) => Number(b.created_at - a.created_at))
    .slice(0, 5);

  const pendingInvoices = [...pendingPayments]
    .sort((a, b) => Number(b.created_at - a.created_at))
    .slice(0, 5);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div data-ocid="dashboard.today_registrations.card">
          <StatCard
            label="Today's Registrations"
            value={todayRegistrations}
            icon={<UserPlus className="h-5 w-5" />}
            accent="receptionist"
          />
        </div>
        <div data-ocid="dashboard.pending_payments.card">
          <StatCard
            label="Pending Payments"
            value={pendingPayments.length}
            icon={<Receipt className="h-5 w-5" />}
            accent={pendingPayments.length > 3 ? "warning" : "default"}
          />
        </div>
        <div data-ocid="dashboard.low_stock_alerts.card">
          <StatCard
            label="Low Stock Alerts"
            value={(lowStock ?? []).length + (expiryAlerts ?? []).length}
            icon={<Package className="h-5 w-5" />}
            accent={(lowStock ?? []).length > 0 ? "destructive" : "default"}
          />
        </div>
        <div data-ocid="dashboard.total_patients.card">
          <StatCard
            label="Total Patients"
            value={patients.length}
            icon={<Users className="h-5 w-5" />}
            accent="doctor"
          />
        </div>
      </div>

      {/* Quick check-in: recent patients + pending invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="dashboard.recent_patients.list"
        >
          <SectionHeader
            title="Quick Check-in"
            icon={<Users className="h-4 w-4 text-[oklch(0.65_0.17_155)]" />}
            linkLabel="All Patients"
            linkOcid="dashboard.view_all_patients.link"
            onLink={() => onNavigate("/patients")}
          />
          <Table
            columns={[
              {
                key: "name",
                header: "Patient",
                render: (row: Patient) => `${row.first_name} ${row.last_name}`,
              },
              { key: "phone", header: "Phone" },
              {
                key: "created_at",
                header: "Registered",
                render: (row: Patient) =>
                  new Date(
                    Number(row.created_at / 1_000_000n),
                  ).toLocaleDateString("en-IN"),
              },
            ]}
            data={recentPatients}
            keyExtractor={(row) => row.id.toString()}
            emptyMessage="No recent patients"
          />
        </div>

        <div
          className="bg-card border border-border rounded-xl"
          data-ocid="dashboard.pending_invoices.list"
        >
          <SectionHeader
            title="Pending Invoices"
            icon={<Receipt className="h-4 w-4 text-[oklch(0.74_0.16_78)]" />}
            linkLabel="View all"
            linkOcid="dashboard.view_all_invoices.link"
            onLink={() => onNavigate("/billing")}
          />
          <Table
            columns={[
              {
                key: "id",
                header: "Invoice",
                render: (row: Invoice) => `#${row.id}`,
              },
              {
                key: "total",
                header: "Amount",
                align: "right",
                render: (row: Invoice) =>
                  `₹${row.total.toLocaleString("en-IN")}`,
              },
              {
                key: "status",
                header: "Status",
                render: (row: Invoice) => <StatusBadge status={row.status} />,
              },
            ]}
            data={pendingInvoices}
            keyExtractor={(row) => row.id.toString()}
            emptyMessage="No pending invoices"
          />
        </div>
      </div>
    </>
  );
}

// ─── Role badge ──────────────────────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; color: string; bg: string }> =
  {
    admin: {
      label: "Admin",
      color: "oklch(0.74 0.16 78)",
      bg: "oklch(0.74 0.16 78 / 0.12)",
    },
    doctor: {
      label: "Doctor",
      color: "oklch(0.62 0.18 200)",
      bg: "oklch(0.62 0.18 200 / 0.12)",
    },
    receptionist: {
      label: "Receptionist",
      color: "oklch(0.65 0.17 155)",
      bg: "oklch(0.65 0.17 155 / 0.12)",
    },
  };

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function DashboardPage({
  role,
  staff,
  onNavigate,
}: DashboardPageProps) {
  const { data: patients = [], isLoading: pLoading } = usePatients();
  const { data: invoices = [], isLoading: iLoading } = useInvoices();
  const { data: treatments = [] } = useTreatments();
  const { data: labOrders = [] } = useLabOrders();
  const { data: prescriptions } = usePrescriptions();
  const { data: lowStock } = useLowStockAlerts();
  const { data: expiryAlerts } = useExpiryAlerts();
  const { data: staffList = [] } = useStaffMembers();

  if (pLoading || iLoading) return <PageLoader />;

  const roleMeta = ROLE_META[role] ?? ROLE_META.admin;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div data-ocid="dashboard.page">
      {/* Role-aware header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ color: roleMeta.color, backgroundColor: roleMeta.bg }}
            >
              {roleMeta.label}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {greeting}
            {staff ? `, ${staff.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Role-specific content */}
      {role === "admin" && (
        <AdminDashboard
          patients={patients}
          invoices={invoices}
          staff={staffList}
          lowStock={lowStock}
          onNavigate={onNavigate}
        />
      )}
      {role === "doctor" && (
        <DoctorDashboard
          patients={patients}
          treatments={treatments}
          labOrders={labOrders}
          prescriptions={prescriptions}
          onNavigate={onNavigate}
        />
      )}
      {role === "receptionist" && (
        <ReceptionistDashboard
          patients={patients}
          invoices={invoices}
          lowStock={lowStock}
          expiryAlerts={expiryAlerts}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
