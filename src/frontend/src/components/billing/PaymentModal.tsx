import { useState } from "react";
import { toast } from "sonner";
import { useRecordPayment } from "../../hooks/useBilling";
import { PaymentMethod } from "../../types";
import type { Invoice } from "../../types";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Select } from "../shared/Select";
import { StatusBadge } from "../shared/StatusBadge";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  patientName: string;
}

const PAYMENT_METHOD_OPTIONS = [
  { value: PaymentMethod.cash, label: "Cash" },
  { value: PaymentMethod.card, label: "Card (Debit/Credit)" },
  { value: PaymentMethod.upi, label: "UPI" },
  { value: PaymentMethod.netBanking, label: "Net Banking" },
  { value: PaymentMethod.cheque, label: "Cheque" },
  { value: PaymentMethod.other, label: "Other" },
];

export default function PaymentModal({
  open,
  onClose,
  invoice,
  patientName,
}: PaymentModalProps) {
  const paidAmount = invoice.payment_history.reduce(
    (sum, p) => sum + p.amount,
    0,
  );
  const balanceDue = invoice.total - paidAmount;

  const [amount, setAmount] = useState(balanceDue.toFixed(2));
  const [method, setMethod] = useState<string>(PaymentMethod.cash);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [amountError, setAmountError] = useState("");

  const recordPayment = useRecordPayment();

  const handleAmountBlur = () => {
    const val = Number(amount);
    if (Number.isNaN(val) || val <= 0) {
      setAmountError("Enter a valid amount greater than 0");
    } else if (val > balanceDue) {
      setAmountError(`Cannot exceed balance due of ₹${balanceDue.toFixed(2)}`);
    } else {
      setAmountError("");
    }
  };

  const isValid =
    Number(amount) > 0 &&
    Number(amount) <= balanceDue &&
    !!method &&
    !!date &&
    !amountError;

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      // Convert date string to nanosecond timestamp (bigint)
      const dateTs = BigInt(new Date(date).getTime()) * BigInt(1_000_000);
      await recordPayment.mutateAsync({
        id: invoice.id,
        payment: {
          amount: Number(amount),
          method: method as PaymentMethod,
          date: dateTs,
          reference: reference.trim(),
        },
      });
      toast.success("Payment recorded successfully");
      onClose();
    } catch {
      toast.error("Failed to record payment");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Payment"
      description={`Invoice #${invoice.id} · ${patientName}`}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            data-ocid="payment-modal.cancel_button"
            className="h-9 px-4 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || recordPayment.isPending}
            data-ocid="payment-modal.submit_button"
            className="h-9 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {recordPayment.isPending ? "Recording..." : "Record Payment"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Invoice Summary */}
        <div className="bg-muted/20 border border-border rounded-lg p-3 space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={invoice.status} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Invoice Total</span>
            <span className="tabular-nums font-medium">
              ₹
              {invoice.total.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          {paidAmount > 0 && (
            <div
              className="flex justify-between"
              style={{ color: "oklch(0.65 0.17 155)" }}
            >
              <span>Already Paid</span>
              <span className="tabular-nums">
                ₹
                {paidAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t border-border pt-1.5">
            <span>Balance Due</span>
            <span
              className="tabular-nums"
              style={{ color: "oklch(0.74 0.16 78)" }}
            >
              ₹
              {balanceDue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="Amount (₹)"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setAmountError("");
          }}
          onBlur={handleAmountBlur}
          error={amountError}
          placeholder={balanceDue.toFixed(2)}
          data-ocid="payment-modal.amount.input"
        />

        {/* Payment Method */}
        <Select
          label="Payment Method"
          options={PAYMENT_METHOD_OPTIONS}
          value={method}
          onChange={setMethod}
          data-ocid="payment-modal.method.select"
        />

        {/* Date */}
        <Input
          label="Payment Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          data-ocid="payment-modal.date.input"
        />

        {/* Reference */}
        <Input
          label="Reference / Transaction ID (optional)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="UPI Ref, Cheque No., Transaction ID…"
          data-ocid="payment-modal.reference.input"
        />
      </div>
    </Modal>
  );
}
