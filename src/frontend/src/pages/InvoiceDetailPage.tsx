import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Download,
  Hash,
  Printer,
  User,
} from "lucide-react";
import { useState } from "react";
import PaymentModal from "../components/billing/PaymentModal";
import { PageHeader } from "../components/layout/PageHeader";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useInvoice } from "../hooks/useBilling";
import { usePatients } from "../hooks/usePatients";
import { InvoiceStatus, PaymentMethod } from "../types";
import type { EntityId } from "../types";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.cash]: "Cash",
  [PaymentMethod.card]: "Card",
  [PaymentMethod.upi]: "UPI",
  [PaymentMethod.netBanking]: "Net Banking",
  [PaymentMethod.cheque]: "Cheque",
  [PaymentMethod.other]: "Other",
};

interface Props {
  invoiceId: EntityId;
  onBack: () => void;
}

export default function InvoiceDetailPage({ invoiceId, onBack }: Props) {
  const [showPayment, setShowPayment] = useState(false);
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: patients } = usePatients();

  if (isLoading) return <PageLoader />;
  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Invoice not found</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Back to Billing
        </button>
      </div>
    );
  }

  const patientMap = new Map(
    (patients ?? []).map((p) => [
      p.id.toString(),
      {
        name: `${p.first_name} ${p.last_name}`,
        phone: p.phone,
        email: p.email,
      },
    ]),
  );
  const patient = patientMap.get(invoice.patient_id.toString());
  const patientName = patient?.name ?? `Patient #${invoice.patient_id}`;

  const invoiceDate = new Date(
    Number(invoice.created_at / BigInt(1_000_000)),
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const paidAmount = invoice.payment_history.reduce(
    (sum, p) => sum + p.amount,
    0,
  );
  const balanceDue = invoice.total - paidAmount;
  const canPay =
    invoice.status === InvoiceStatus.issued ||
    invoice.status === InvoiceStatus.partiallyPaid;

  // GST breakdown by rate
  const gstBreakdown = invoice.items.reduce<
    Record<number, { taxable: number; gst: number }>
  >((acc, item) => {
    const gstAmt = (item.amount * item.gst_rate) / 100;
    if (!acc[item.gst_rate]) acc[item.gst_rate] = { taxable: 0, gst: 0 };
    acc[item.gst_rate].taxable += item.amount;
    acc[item.gst_rate].gst += gstAmt;
    return acc;
  }, {});

  const handlePrint = () => window.print();

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(.print-invoice) { display: none !important; }
          .print-invoice { display: block !important; }
          .no-print { display: none !important; }
          .print-invoice { color: #000 !important; background: #fff !important; }
        }
      `}</style>

      <div data-ocid="invoice-detail.page">
        <PageHeader
          title={`Invoice #${invoice.id}`}
          breadcrumbs={[
            { label: "Billing", onClick: onBack },
            { label: `Invoice #${invoice.id}` },
          ]}
          actions={
            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={onBack}
                data-ocid="invoice-detail.back_button"
                className="h-9 px-3 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handlePrint}
                data-ocid="invoice-detail.print_button"
                className="h-9 px-3 border border-border rounded-lg text-sm hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              {canPay && (
                <button
                  type="button"
                  onClick={() => setShowPayment(true)}
                  data-ocid="invoice-detail.record_payment_button"
                  className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                >
                  <CreditCard className="h-4 w-4" />
                  Record Payment
                </button>
              )}
            </div>
          }
        />

        {/* Printable Invoice */}
        <div className="print-invoice space-y-5">
          {/* Header Card */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-display font-bold text-foreground mb-3">
                  DentaCare Pro
                </h2>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>GST No: 27AABCT1332L1ZF</p>
                  <p>123 Medical Complex, Pune, MH 411001</p>
                  <p>contact@dentacarepro.in | +91 20 1234 5678</p>
                </div>
              </div>
              <div className="text-left sm:text-right space-y-2">
                <div className="flex sm:justify-end">
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                  <Hash className="h-3.5 w-3.5" />
                  <span className="font-mono">
                    INV-{String(invoice.id).padStart(6, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                  <Calendar className="h-3.5 w-3.5" />
                  {invoiceDate}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Bill To
              </p>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {patientName}
                  </p>
                  {patient?.phone && (
                    <p className="text-xs text-muted-foreground">
                      {patient.phone}
                    </p>
                  )}
                  {patient?.email && (
                    <p className="text-xs text-muted-foreground">
                      {patient.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/20">
              <h3 className="text-sm font-semibold text-foreground">
                Line Items
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-5 py-2.5 text-left font-medium">
                      Description
                    </th>
                    <th className="px-5 py-2.5 text-right font-medium">
                      Amount
                    </th>
                    <th className="px-5 py-2.5 text-right font-medium">
                      GST Rate
                    </th>
                    <th className="px-5 py-2.5 text-right font-medium">
                      GST Amt
                    </th>
                    <th className="px-5 py-2.5 text-right font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, i) => {
                    const gstAmt = (item.amount * item.gst_rate) / 100;
                    const itemTotal = item.amount + gstAmt;
                    return (
                      <tr
                        key={`${item.description}-${i}`}
                        data-ocid={`invoice-detail.item.${i + 1}`}
                        className="border-b border-border/50 table-row-stripe"
                      >
                        <td className="px-5 py-3 text-foreground">
                          {item.description}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          ₹
                          {item.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground">
                          {item.gst_rate}%
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                          ₹
                          {gstAmt.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums font-medium">
                          ₹
                          {itemTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals + GST Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GST Breakdown */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/20">
                <h3 className="text-sm font-semibold text-foreground">
                  GST Breakdown
                </h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="px-5 py-2.5 text-left font-medium">
                      GST Rate
                    </th>
                    <th className="px-5 py-2.5 text-right font-medium">
                      Taxable Amt
                    </th>
                    <th className="px-5 py-2.5 text-right font-medium">
                      GST Amt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(gstBreakdown).map(([rate, vals]) => (
                    <tr
                      key={rate}
                      className="border-b border-border/50 table-row-stripe"
                    >
                      <td className="px-5 py-2.5">{rate}%</td>
                      <td className="px-5 py-2.5 text-right tabular-nums">
                        ₹
                        {vals.taxable.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums">
                        ₹
                        {vals.gst.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-muted/10">
                    <td className="px-5 py-2.5">Total GST</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">
                      ₹
                      {invoice.subtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-5 py-2.5 text-right tabular-nums">
                      ₹
                      {invoice.gst_total.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
                Amount Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">
                    ₹
                    {invoice.subtotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total GST</span>
                  <span className="tabular-nums">
                    ₹
                    {invoice.gst_total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t border-border pt-2 mt-1">
                  <span>Grand Total</span>
                  <span className="tabular-nums">
                    ₹
                    {invoice.total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {paidAmount > 0 && (
                  <>
                    <div
                      className="flex justify-between text-success-foreground"
                      style={{ color: "oklch(0.65 0.17 155)" }}
                    >
                      <span>Amount Paid</span>
                      <span className="tabular-nums">
                        ₹
                        {paidAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-border pt-2">
                      <span>Balance Due</span>
                      <span
                        className="tabular-nums"
                        style={{
                          color:
                            balanceDue > 0
                              ? "oklch(0.74 0.16 78)"
                              : "oklch(0.65 0.17 155)",
                        }}
                      >
                        ₹
                        {balanceDue.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment History */}
          {invoice.payment_history.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/20">
                <h3 className="text-sm font-semibold text-foreground">
                  Payment History
                </h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="px-5 py-2.5 text-left font-medium">Date</th>
                    <th className="px-5 py-2.5 text-left font-medium">
                      Method
                    </th>
                    <th className="px-5 py-2.5 text-left font-medium">
                      Reference
                    </th>
                    <th className="px-5 py-2.5 text-right font-medium">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payment_history.map((pmt, i) => (
                    <tr
                      key={`${pmt.date}-${pmt.amount}-${i}`}
                      data-ocid={`invoice-detail.payment.${i + 1}`}
                      className="border-b border-border/50 table-row-stripe"
                    >
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(
                          Number(pmt.date / BigInt(1_000_000)),
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                          {PAYMENT_METHOD_LABELS[pmt.method] ?? pmt.method}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {pmt.reference || "—"}
                      </td>
                      <td
                        className="px-5 py-3 text-right font-semibold tabular-nums"
                        style={{ color: "oklch(0.65 0.17 155)" }}
                      >
                        ₹
                        {pmt.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer note for print */}
          <div className="text-center text-xs text-muted-foreground py-2">
            This is a computer-generated invoice. Thank you for choosing
            DentaCare Pro.
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          open={showPayment}
          onClose={() => setShowPayment(false)}
          invoice={invoice}
          patientName={patientName}
        />
      )}
    </>
  );
}
