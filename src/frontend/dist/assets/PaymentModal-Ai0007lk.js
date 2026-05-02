import { r as reactExports, k as PaymentMethod, j as jsxRuntimeExports, u as ue } from "./index-CRusxQeF.js";
import { d as useRecordPayment } from "./useBilling-Cm7xg-nE.js";
import { M as Modal, I as Input, S as Select } from "./Select-Dw0AWwQu.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
const PAYMENT_METHOD_OPTIONS = [
  { value: PaymentMethod.cash, label: "Cash" },
  { value: PaymentMethod.card, label: "Card (Debit/Credit)" },
  { value: PaymentMethod.upi, label: "UPI" },
  { value: PaymentMethod.netBanking, label: "Net Banking" },
  { value: PaymentMethod.cheque, label: "Cheque" },
  { value: PaymentMethod.other, label: "Other" }
];
function PaymentModal({
  open,
  onClose,
  invoice,
  patientName
}) {
  const paidAmount = invoice.payment_history.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const balanceDue = invoice.total - paidAmount;
  const [amount, setAmount] = reactExports.useState(balanceDue.toFixed(2));
  const [method, setMethod] = reactExports.useState(PaymentMethod.cash);
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [reference, setReference] = reactExports.useState("");
  const [amountError, setAmountError] = reactExports.useState("");
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
  const isValid = Number(amount) > 0 && Number(amount) <= balanceDue && !!method && !!date && !amountError;
  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      const dateTs = BigInt(new Date(date).getTime()) * BigInt(1e6);
      await recordPayment.mutateAsync({
        id: invoice.id,
        payment: {
          amount: Number(amount),
          method,
          date: dateTs,
          reference: reference.trim()
        }
      });
      ue.success("Payment recorded successfully");
      onClose();
    } catch {
      ue.error("Failed to record payment");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: "Record Payment",
      description: `Invoice #${invoice.id} · ${patientName}`,
      size: "sm",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "data-ocid": "payment-modal.cancel_button",
            className: "h-9 px-4 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleSubmit,
            disabled: !isValid || recordPayment.isPending,
            "data-ocid": "payment-modal.submit_button",
            className: "h-9 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors",
            children: recordPayment.isPending ? "Recording..." : "Record Payment"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border rounded-lg p-3 space-y-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: invoice.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Invoice Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums font-medium", children: [
              "₹",
              invoice.total.toLocaleString("en-IN", {
                minimumFractionDigits: 2
              })
            ] })
          ] }),
          paidAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex justify-between",
              style: { color: "oklch(0.65 0.17 155)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Already Paid" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                  "₹",
                  paidAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold border-t border-border pt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance Due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "tabular-nums",
                style: { color: "oklch(0.74 0.16 78)" },
                children: [
                  "₹",
                  balanceDue.toLocaleString("en-IN", { minimumFractionDigits: 2 })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Amount (₹)",
            type: "number",
            min: "0",
            step: "0.01",
            value: amount,
            onChange: (e) => {
              setAmount(e.target.value);
              setAmountError("");
            },
            onBlur: handleAmountBlur,
            error: amountError,
            placeholder: balanceDue.toFixed(2),
            "data-ocid": "payment-modal.amount.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            label: "Payment Method",
            options: PAYMENT_METHOD_OPTIONS,
            value: method,
            onChange: setMethod,
            "data-ocid": "payment-modal.method.select"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Payment Date",
            type: "date",
            value: date,
            onChange: (e) => setDate(e.target.value),
            "data-ocid": "payment-modal.date.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Reference / Transaction ID (optional)",
            value: reference,
            onChange: (e) => setReference(e.target.value),
            placeholder: "UPI Ref, Cheque No., Transaction ID…",
            "data-ocid": "payment-modal.reference.input"
          }
        )
      ] })
    }
  );
}
export {
  PaymentModal as P
};
