import {
  DollarSign,
  FileText,
  Plus,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type React from "react";
import { toast } from "sonner";
import InvoiceFormModal from "../components/billing/InvoiceFormModal";
import PaymentModal from "../components/billing/PaymentModal";
import { PageHeader } from "../components/layout/PageHeader";
import { EmptyState } from "../components/shared/EmptyState";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { StatusBadge } from "../components/shared/StatusBadge";
import { Table } from "../components/shared/Table";
import { useCancelInvoice, useInvoices } from "../hooks/useBilling";
import { usePatients } from "../hooks/usePatients";
import { InvoiceStatus } from "../types";
import type { Invoice } from "../types";

type FilterStatus = "all" | InvoiceStatus;

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: InvoiceStatus.issued, label: "Pending" },
  { value: InvoiceStatus.partiallyPaid, label: "Partial" },
  { value: InvoiceStatus.paid, label: "Paid" },
  { value: InvoiceStatus.cancelled, label: "Cancelled" },
];

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
        style={{
          backgroundColor: `${accent}1a`,
          border: `1px solid ${accent}33`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-display font-bold text-foreground truncate">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export default function BillingPage({
  onNavigate,
}: {
  onNavigate?: (path: string) => void;
}) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  const { data: invoices, isLoading } = useInvoices();
  const { data: patients } = usePatients();
  const cancelInvoice = useCancelInvoice();

  if (isLoading) return <PageLoader />;

  const patientMap = new Map(
    (patients ?? []).map((p) => [
      p.id.toString(),
      `${p.first_name} ${p.last_name}`,
    ]),
  );

  const allInvoices = invoices ?? [];
  const filtered =
    filter === "all"
      ? allInvoices
      : allInvoices.filter((inv) => inv.status === filter);

  // Summary stats
  const totalRevenue = allInvoices
    .filter((i) => i.status === InvoiceStatus.paid)
    .reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = allInvoices
    .filter(
      (i) =>
        i.status === InvoiceStatus.issued ||
        i.status === InvoiceStatus.partiallyPaid,
    )
    .reduce((sum, i) => {
      const paid = i.payment_history.reduce((s, p) => s + p.amount, 0);
      return sum + (i.total - paid);
    }, 0);
  const paidCount = allInvoices.filter(
    (i) => i.status === InvoiceStatus.paid,
  ).length;
  const totalGst = allInvoices
    .filter((i) => i.status !== InvoiceStatus.cancelled)
    .reduce((sum, i) => sum + i.gst_total, 0);

  const handleCancel = async (id: bigint) => {
    if (!confirm("Cancel this invoice? This cannot be undone.")) return;
    try {
      await cancelInvoice.mutateAsync(id);
      toast.success("Invoice cancelled");
    } catch {
      toast.error("Failed to cancel invoice");
    }
  };

  const handleView = (id: bigint) => {
    onNavigate?.(`/billing/${id}`);
  };

  const columns = [
    {
      key: "id",
      header: "Invoice #",
      render: (inv: Invoice) => (
        <span className="font-mono text-muted-foreground text-xs">
          #{inv.id.toString()}
        </span>
      ),
    },
    {
      key: "patient",
      header: "Patient",
      render: (inv: Invoice) => (
        <span className="font-medium text-foreground">
          {patientMap.get(inv.patient_id.toString()) ??
            `Patient #${inv.patient_id}`}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (inv: Invoice) =>
        new Date(Number(inv.created_at / BigInt(1_000_000))).toLocaleDateString(
          "en-IN",
          { day: "2-digit", month: "short", year: "numeric" },
        ),
    },
    {
      key: "subtotal",
      header: "Subtotal",
      align: "right" as const,
      render: (inv: Invoice) =>
        `₹${inv.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "gst",
      header: "GST",
      align: "right" as const,
      render: (inv: Invoice) => (
        <span className="text-muted-foreground">
          ₹{inv.gst_total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right" as const,
      render: (inv: Invoice) => (
        <span className="font-semibold">
          ₹{inv.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (inv: Invoice) => <StatusBadge status={inv.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (inv: Invoice, i: number) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            type="button"
            onClick={() => handleView(inv.id)}
            data-ocid={`billing.view_button.${i + 1}`}
            className="px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            View
          </button>
          {(inv.status === InvoiceStatus.issued ||
            inv.status === InvoiceStatus.partiallyPaid) && (
            <button
              type="button"
              onClick={() => setPayingInvoice(inv)}
              data-ocid={`billing.record_payment_button.${i + 1}`}
              className="px-2.5 py-1 text-xs rounded-md bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-colors"
            >
              Pay
            </button>
          )}
          {inv.status !== InvoiceStatus.cancelled &&
            inv.status !== InvoiceStatus.paid && (
              <button
                type="button"
                onClick={() => handleCancel(inv.id)}
                data-ocid={`billing.cancel_button.${i + 1}`}
                className="px-2.5 py-1 text-xs rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
              >
                Cancel
              </button>
            )}
        </div>
      ),
    },
  ];

  return (
    <div data-ocid="billing.page">
      <PageHeader
        title="Billing & Payments"
        description="Manage invoices, GST, and payment records"
        actions={
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            data-ocid="billing.add_button"
            className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          sub="Paid invoices"
          icon={TrendingUp}
          accent="oklch(0.65 0.17 155)"
        />
        <StatCard
          label="Pending Amount"
          value={`₹${pendingAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          sub="Outstanding balance"
          icon={DollarSign}
          accent="oklch(0.74 0.16 78)"
        />
        <StatCard
          label="Paid Invoices"
          value={String(paidCount)}
          sub={`of ${allInvoices.length} total`}
          icon={ReceiptText}
          accent="oklch(0.62 0.18 200)"
        />
        <StatCard
          label="Total GST Collected"
          value={`₹${totalGst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          sub="All active invoices"
          icon={FileText}
          accent="oklch(0.58 0.22 25)"
        />
      </div>

      {/* Filter Tabs */}
      <div
        className="flex items-center gap-1 mb-4 bg-muted/30 border border-border rounded-lg p-1 w-fit"
        data-ocid="billing.filter.tab"
      >
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            data-ocid={`billing.filter.${opt.value}`}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === opt.value
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
            {opt.value !== "all" && (
              <span className="ml-1 text-[10px] opacity-70">
                ({allInvoices.filter((i) => i.status === opt.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ReceiptText className="h-7 w-7" />}
          title="No invoices found"
          description={
            filter === "all"
              ? "Create your first invoice to get started."
              : `No ${FILTER_OPTIONS.find((o) => o.value === filter)?.label.toLowerCase()} invoices.`
          }
          data-ocid="billing.empty_state"
        />
      ) : (
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(inv) => inv.id.toString()}
          emptyMessage="No invoices found"
          stickyHeader
        />
      )}

      {/* Create Invoice Modal */}
      <InvoiceFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {/* Record Payment Modal */}
      {payingInvoice && (
        <PaymentModal
          open={!!payingInvoice}
          onClose={() => setPayingInvoice(null)}
          invoice={payingInvoice}
          patientName={
            patientMap.get(payingInvoice.patient_id.toString()) ??
            `Patient #${payingInvoice.patient_id}`
          }
        />
      )}
    </div>
  );
}
