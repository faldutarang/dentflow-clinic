import {
  BarChart2,
  CalendarRange,
  FlaskConical,
  Package,
  Receipt,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { StatCard } from "../components/shared/Card";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { useInvoices } from "../hooks/useBilling";
import {
  useExpiryAlerts,
  useInventoryItems,
  useLowStockAlerts,
} from "../hooks/useInventory";
import { useLabOrders } from "../hooks/useLabOrders";
import { usePatients } from "../hooks/usePatients";
import { useStaffMembers } from "../hooks/useStaff";
import { useTreatments } from "../hooks/useTreatments";
import { InvoiceStatus, StaffRole, TreatmentStatus } from "../types";

// ─── Mini bar chart (no lib) ─────────────────────────────────────────────────
function BarChart({
  data,
}: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2.5">
      {data.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={item.label}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{item.label}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Donut chart (SVG, no lib) ───────────────────────────────────────────────
function DonutChart({
  segments,
}: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
        No data
      </div>
    );
  }

  const R = 48;
  const cx = 60;
  const cy = 60;
  const strokeWidth = 18;

  let offset = 0;
  const circumference = 2 * Math.PI * R;
  const arcs = segments.map((seg) => {
    const dash = (seg.value / total) * circumference;
    const arc = { ...seg, dash, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="oklch(0.25 0.025 265)"
          strokeWidth={strokeWidth}
        />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="text-foreground"
          style={{
            fontSize: 18,
            fontWeight: 700,
            fill: "oklch(0.93 0.01 265)",
          }}
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          style={{ fontSize: 9, fill: "oklch(0.58 0.04 265)" }}
        >
          total
        </text>
      </svg>
      <div className="space-y-1.5 min-w-0">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-sm shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-muted-foreground truncate">{seg.label}</span>
            <span className="font-medium text-foreground ml-auto pl-2">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Report type tabs ────────────────────────────────────────────────────────
type ReportType = "revenue" | "patients" | "inventory" | "staff";
const REPORT_TABS: { id: ReportType; label: string; icon: React.ReactNode }[] =
  [
    {
      id: "revenue",
      label: "Revenue",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    { id: "patients", label: "Patients", icon: <Users className="h-4 w-4" /> },
    {
      id: "inventory",
      label: "Inventory",
      icon: <Package className="h-4 w-4" />,
    },
    { id: "staff", label: "Staff", icon: <UserCheck className="h-4 w-4" /> },
  ];

// ─── Revenue Report ──────────────────────────────────────────────────────────
function RevenueReport({ from, to }: { from: string; to: string }) {
  const { data: invoices = [], isLoading } = useInvoices();

  const filtered = invoices.filter((inv) => {
    const d = new Date(Number(inv.created_at / 1_000_000n));
    return (
      (!from || d >= new Date(from)) && (!to || d <= new Date(`${to}T23:59:59`))
    );
  });

  const paidInvoices = filtered.filter((i) => i.status === InvoiceStatus.paid);
  const totalRevenue = paidInvoices.reduce((s, i) => s + i.total, 0);
  const gstCollected = paidInvoices.reduce((s, i) => s + i.gst_total, 0);

  const statusData = [
    {
      label: "Draft",
      value: filtered.filter((i) => i.status === "draft").length,
      color: "oklch(0.58 0.04 265)",
    },
    {
      label: "Issued",
      value: filtered.filter((i) => i.status === "issued").length,
      color: "oklch(0.62 0.18 200)",
    },
    {
      label: "Partially Paid",
      value: filtered.filter((i) => i.status === "partiallyPaid").length,
      color: "oklch(0.74 0.16 78)",
    },
    {
      label: "Paid",
      value: filtered.filter((i) => i.status === "paid").length,
      color: "oklch(0.65 0.17 155)",
    },
    {
      label: "Cancelled",
      value: filtered.filter((i) => i.status === "cancelled").length,
      color: "oklch(0.58 0.22 25)",
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div data-ocid="reports.revenue.section">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="admin"
        />
        <StatCard
          label="GST Collected"
          value={`₹${gstCollected.toLocaleString("en-IN")}`}
          icon={<Receipt className="h-5 w-5" />}
          accent="default"
        />
        <StatCard
          label="Total Invoices"
          value={filtered.length}
          icon={<Receipt className="h-5 w-5" />}
          accent="default"
        />
        <StatCard
          label="Paid Invoices"
          value={paidInvoices.length}
          icon={<Receipt className="h-5 w-5" />}
          accent="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Invoice Status Breakdown
          </h4>
          <DonutChart segments={statusData.filter((s) => s.value > 0)} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Invoice Distribution
          </h4>
          <BarChart data={statusData} />
        </div>
      </div>
    </div>
  );
}

// ─── Patient Report ──────────────────────────────────────────────────────────
function PatientReport() {
  const { data: patients = [], isLoading: pLoad } = usePatients();
  const { data: treatments = [], isLoading: tLoad } = useTreatments();

  if (pLoad || tLoad) return <PageLoader />;

  const treatmentsByPatient = treatments.reduce<Record<string, number>>(
    (acc, t) => {
      const key = t.patient_id.toString();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const avgTreatments =
    patients.length > 0
      ? (treatments.length / patients.length).toFixed(1)
      : "0";

  const statusData = [
    {
      label: "Active",
      value: treatments.filter((t) => t.status === TreatmentStatus.active)
        .length,
      color: "oklch(0.62 0.18 200)",
    },
    {
      label: "Completed",
      value: treatments.filter((t) => t.status === TreatmentStatus.completed)
        .length,
      color: "oklch(0.65 0.17 155)",
    },
    {
      label: "Cancelled",
      value: treatments.filter((t) => t.status === TreatmentStatus.cancelled)
        .length,
      color: "oklch(0.58 0.22 25)",
    },
  ];

  const patientsWithMost = Object.entries(treatmentsByPatient)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div data-ocid="reports.patients.section">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Registered"
          value={patients.length}
          icon={<Users className="h-5 w-5" />}
          accent="doctor"
        />
        <StatCard
          label="Total Treatments"
          value={treatments.length}
          icon={<Stethoscope className="h-5 w-5" />}
          accent="default"
        />
        <StatCard
          label="Avg. Treatments/Patient"
          value={avgTreatments}
          icon={<BarChart2 className="h-5 w-5" />}
          accent="default"
        />
        <StatCard
          label="Active Treatments"
          value={statusData[0].value}
          icon={<Stethoscope className="h-5 w-5" />}
          accent="success"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Treatment Status
          </h4>
          <DonutChart segments={statusData.filter((s) => s.value > 0)} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Top Patients by Treatment Count
          </h4>
          {patientsWithMost.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No treatments recorded yet.
            </p>
          ) : (
            <BarChart
              data={patientsWithMost.map(([id, count], i) => ({
                label: `Patient #${id}`,
                value: count,
                color: [
                  "oklch(0.62 0.18 200)",
                  "oklch(0.65 0.17 155)",
                  "oklch(0.74 0.16 78)",
                  "oklch(0.56 0.15 105)",
                  "oklch(0.58 0.04 265)",
                ][i % 5],
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inventory Report ────────────────────────────────────────────────────────
function InventoryReport() {
  const { data: items = [], isLoading } = useInventoryItems();
  const { data: lowStock = [] } = useLowStockAlerts();
  const { data: expiryRisk = [] } = useExpiryAlerts(30);

  if (isLoading) return <PageLoader />;

  const totalValue = items.reduce((s, i) => s + i.cost_price * i.stock, 0);
  const categoryMap = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.stock;
    return acc;
  }, {});

  const colors = [
    "oklch(0.62 0.18 200)",
    "oklch(0.65 0.17 155)",
    "oklch(0.74 0.16 78)",
    "oklch(0.56 0.15 105)",
    "oklch(0.58 0.22 25)",
  ];
  const categoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value], i) => ({
      label,
      value,
      color: colors[i % colors.length],
    }));

  return (
    <div data-ocid="reports.inventory.section">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Items"
          value={items.length}
          icon={<Package className="h-5 w-5" />}
          accent="default"
        />
        <StatCard
          label="Low Stock Items"
          value={lowStock.length}
          icon={<Package className="h-5 w-5" />}
          accent={lowStock.length > 0 ? "destructive" : "default"}
        />
        <StatCard
          label="Expiry Risk (30d)"
          value={expiryRisk.length}
          icon={<Package className="h-5 w-5" />}
          accent={expiryRisk.length > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Total Stock Value"
          value={`₹${totalValue.toLocaleString("en-IN")}`}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="admin"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Stock by Category
          </h4>
          {categoryData.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No inventory items yet.
            </p>
          ) : (
            <BarChart data={categoryData} />
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Low Stock Items
          </h4>
          {lowStock.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              All stock levels are healthy.
            </p>
          ) : (
            <div className="space-y-2">
              {lowStock.slice(0, 6).map((item) => (
                <div
                  key={item.id.toString()}
                  className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-destructive shrink-0 ml-4">
                    {item.stock} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Staff Report ─────────────────────────────────────────────────────────────
function StaffReport() {
  const { data: staff = [], isLoading } = useStaffMembers();

  if (isLoading) return <PageLoader />;

  const activeStaff = staff.filter((s) => s.is_active).length;
  const byRole = [
    {
      label: "Doctors",
      value: staff.filter((s) => s.role === StaffRole.doctor).length,
      color: "oklch(0.62 0.18 200)",
    },
    {
      label: "Admin",
      value: staff.filter((s) => s.role === StaffRole.admin).length,
      color: "oklch(0.74 0.16 78)",
    },
    {
      label: "Receptionist",
      value: staff.filter((s) => s.role === StaffRole.receptionist).length,
      color: "oklch(0.65 0.17 155)",
    },
  ];

  return (
    <div data-ocid="reports.staff.section">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Staff"
          value={staff.length}
          icon={<Users className="h-5 w-5" />}
          accent="default"
        />
        <StatCard
          label="Active Staff"
          value={activeStaff}
          icon={<UserCheck className="h-5 w-5" />}
          accent="receptionist"
        />
        <StatCard
          label="Doctors"
          value={byRole[0].value}
          icon={<Stethoscope className="h-5 w-5" />}
          accent="doctor"
        />
        <StatCard
          label="Admin / Reception"
          value={byRole[1].value + byRole[2].value}
          icon={<UserCheck className="h-5 w-5" />}
          accent="admin"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Staff by Role
          </h4>
          <DonutChart segments={byRole.filter((s) => s.value > 0)} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Staff Members
          </h4>
          {staff.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No staff members registered.
            </p>
          ) : (
            <div className="space-y-2">
              {staff.slice(0, 6).map((member) => (
                <div
                  key={member.id.toString()}
                  className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold capitalize px-2 py-0.5 rounded-full shrink-0 ml-4"
                    style={{
                      color:
                        byRole.find((r) =>
                          r.label.toLowerCase().includes(member.role),
                        )?.color ?? "oklch(0.65 0.17 155)",
                      backgroundColor: `${byRole.find((r) => r.label.toLowerCase().includes(member.role))?.color ?? "oklch(0.65 0.17 155)"}1a`,
                    }}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportType>("revenue");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div data-ocid="reports.page">
      <PageHeader
        title="Reports & Analytics"
        description="Clinic performance metrics and data insights"
      />

      {/* Report Type Tabs */}
      <div
        className="flex flex-wrap gap-1 p-1 bg-card border border-border rounded-xl mb-6 w-fit"
        data-ocid="reports.type.tabs"
      >
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`reports.${tab.id}.tab`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date range (revenue only) */}
      {activeTab === "revenue" && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarRange className="h-4 w-4" />
            <span>Date Range:</span>
          </div>
          <label className="sr-only" htmlFor="reports-from-date">
            From date
          </label>
          <input
            id="reports-from-date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            data-ocid="reports.from_date.input"
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <label className="sr-only" htmlFor="reports-to-date">
            To date
          </label>
          <input
            id="reports-to-date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            data-ocid="reports.to_date.input"
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              data-ocid="reports.clear_dates.button"
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Report content */}
      {activeTab === "revenue" && <RevenueReport from={fromDate} to={toDate} />}
      {activeTab === "patients" && <PatientReport />}
      {activeTab === "inventory" && <InventoryReport />}
      {activeTab === "staff" && <StaffReport />}
    </div>
  );
}
