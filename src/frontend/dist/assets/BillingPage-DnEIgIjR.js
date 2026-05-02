import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, u as ue, P as PageLoader, I as InvoiceStatus } from "./index-CRusxQeF.js";
import { a as useCreateInvoice, u as useInvoices, b as useCancelInvoice } from "./useBilling-Cm7xg-nE.js";
import { u as usePatients } from "./usePatients-1jxdmde2.js";
import { M as Modal, S as Select } from "./Select-Dw0AWwQu.js";
import { P as Plus } from "./plus-CqSfRGkC.js";
import { P as PaymentModal } from "./PaymentModal-Ai0007lk.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
import { T as Table } from "./Table-ByTzrkVY.js";
import { T as TrendingUp } from "./trending-up-BFYEtP5l.js";
import { F as FileText } from "./file-text-DIr3Iiet.js";
import "./useMutation-C_my6RdQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M14 8H8", key: "1l3xfs" }],
  ["path", { d: "M16 12H8", key: "1fr5h0" }],
  ["path", { d: "M13 16H8", key: "wsln4y" }]
];
const ReceiptText = createLucideIcon("receipt-text", __iconNode);
const GST_RATE_OPTIONS = [
  { value: "0", label: "0% (Exempt)" },
  { value: "5", label: "5% GST" },
  { value: "12", label: "12% GST" },
  { value: "18", label: "18% GST" },
  { value: "28", label: "28% GST" }
];
const EMPTY_ROW = () => ({
  id: Date.now() + Math.random(),
  description: "",
  amount: "",
  gst_rate: "18"
});
function calcTotals(rows) {
  let subtotal = 0;
  let gstTotal = 0;
  for (const row of rows) {
    const amt = Number(row.amount) || 0;
    const rate = Number(row.gst_rate) || 0;
    subtotal += amt;
    gstTotal += amt * rate / 100;
  }
  return { subtotal, gstTotal, grandTotal: subtotal + gstTotal };
}
function InvoiceFormModal({
  open,
  onClose
}) {
  const [patientId, setPatientId] = reactExports.useState("");
  const [rows, setRows] = reactExports.useState([EMPTY_ROW()]);
  const { data: patients } = usePatients();
  const createInvoice = useCreateInvoice();
  reactExports.useEffect(() => {
    if (open) {
      setPatientId("");
      setRows([EMPTY_ROW()]);
    }
  }, [open]);
  const patientOptions = (patients ?? []).map((p) => ({
    value: p.id.toString(),
    label: `${p.first_name} ${p.last_name}`
  }));
  const { subtotal, gstTotal, grandTotal } = calcTotals(rows);
  const addRow = () => setRows((prev) => [...prev, EMPTY_ROW()]);
  const removeRow = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));
  const updateRow = (idx, field, value) => setRows(
    (prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r)
  );
  const isValid = !!patientId && rows.length > 0 && rows.every((r) => r.description.trim() && Number(r.amount) > 0);
  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      const items = rows.map((r) => ({
        description: r.description.trim(),
        amount: Number(r.amount),
        gst_rate: Number(r.gst_rate)
      }));
      await createInvoice.mutateAsync({
        patient_id: BigInt(patientId),
        items
      });
      ue.success("Invoice created successfully");
      onClose();
    } catch {
      ue.error("Failed to create invoice");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: "Create Invoice",
      description: "Add line items and calculate GST automatically",
      size: "lg",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "data-ocid": "invoice-form.cancel_button",
            className: "h-9 px-4 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleSubmit,
            disabled: !isValid || createInvoice.isPending,
            "data-ocid": "invoice-form.submit_button",
            className: "h-9 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors",
            children: createInvoice.isPending ? "Creating..." : "Create Invoice"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            label: "Patient",
            options: patientOptions,
            value: patientId,
            placeholder: "Select patient...",
            onChange: setPatientId,
            "data-ocid": "invoice-form.patient.select"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Line Items" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: addRow,
                "data-ocid": "invoice-form.add_item_button",
                className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  "Add Item"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-lg overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_120px_110px_36px] gap-0 bg-muted/30 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right pr-2", children: "Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right pr-2", children: "GST Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
            ] }),
            rows.map((row, idx) => {
              const amt = Number(row.amount) || 0;
              const rate = Number(row.gst_rate) || 0;
              const gstAmt = amt * rate / 100;
              const rowTotal = amt + gstAmt;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `invoice-form.item.${idx + 1}`,
                  className: "border-b border-border/50 last:border-b-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_120px_110px_36px] gap-0 px-3 py-2 items-start", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          value: row.description,
                          onChange: (e) => updateRow(idx, "description", e.target.value),
                          placeholder: "Root Canal, Crown, Cleaning…",
                          "data-ocid": `invoice-form.description.${idx + 1}`,
                          className: "text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none pr-2 w-full"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          min: "0",
                          value: row.amount,
                          onChange: (e) => updateRow(idx, "amount", e.target.value),
                          placeholder: "0",
                          "data-ocid": `invoice-form.amount.${idx + 1}`,
                          className: "text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-right tabular-nums pr-2 w-full"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "select",
                        {
                          value: row.gst_rate,
                          onChange: (e) => updateRow(idx, "gst_rate", e.target.value),
                          "data-ocid": `invoice-form.gst_rate.${idx + 1}`,
                          className: "text-sm bg-transparent text-foreground focus:outline-none text-right pr-2 w-full appearance-none",
                          children: GST_RATE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "option",
                            {
                              value: opt.value,
                              className: "bg-card",
                              children: opt.label
                            },
                            opt.value
                          ))
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => removeRow(idx),
                          disabled: rows.length === 1,
                          "data-ocid": `invoice-form.remove_item.${idx + 1}`,
                          className: "flex items-center justify-center h-7 w-7 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:pointer-events-none",
                          "aria-label": "Remove line item",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" })
                        }
                      )
                    ] }),
                    amt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-2 text-[11px] text-muted-foreground flex justify-end gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "GST: ₹",
                        gstAmt.toLocaleString("en-IN", {
                          minimumFractionDigits: 2
                        })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                        "Item Total: ₹",
                        rowTotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2
                        })
                      ] })
                    ] })
                  ]
                },
                row.id
              );
            })
          ] })
        ] }),
        subtotal > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border rounded-lg p-4 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
              "₹",
              subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total GST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
              "₹",
              gstTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold text-base border-t border-border pt-2 mt-1 text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Grand Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
              "₹",
              grandTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2
              })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: InvoiceStatus.issued, label: "Pending" },
  { value: InvoiceStatus.partiallyPaid, label: "Partial" },
  { value: InvoiceStatus.paid, label: "Paid" },
  { value: InvoiceStatus.cancelled, label: "Cancelled" }
];
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
        style: {
          backgroundColor: `${accent}1a`,
          border: `1px solid ${accent}33`
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5", style: { color: accent } })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-bold text-foreground truncate", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sub })
    ] })
  ] });
}
function BillingPage({
  onNavigate
}) {
  var _a;
  const [filter, setFilter] = reactExports.useState("all");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [payingInvoice, setPayingInvoice] = reactExports.useState(null);
  const { data: invoices, isLoading } = useInvoices();
  const { data: patients } = usePatients();
  const cancelInvoice = useCancelInvoice();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const patientMap = new Map(
    (patients ?? []).map((p) => [
      p.id.toString(),
      `${p.first_name} ${p.last_name}`
    ])
  );
  const allInvoices = invoices ?? [];
  const filtered = filter === "all" ? allInvoices : allInvoices.filter((inv) => inv.status === filter);
  const totalRevenue = allInvoices.filter((i) => i.status === InvoiceStatus.paid).reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = allInvoices.filter(
    (i) => i.status === InvoiceStatus.issued || i.status === InvoiceStatus.partiallyPaid
  ).reduce((sum, i) => {
    const paid = i.payment_history.reduce((s, p) => s + p.amount, 0);
    return sum + (i.total - paid);
  }, 0);
  const paidCount = allInvoices.filter(
    (i) => i.status === InvoiceStatus.paid
  ).length;
  const totalGst = allInvoices.filter((i) => i.status !== InvoiceStatus.cancelled).reduce((sum, i) => sum + i.gst_total, 0);
  const handleCancel = async (id) => {
    if (!confirm("Cancel this invoice? This cannot be undone.")) return;
    try {
      await cancelInvoice.mutateAsync(id);
      ue.success("Invoice cancelled");
    } catch {
      ue.error("Failed to cancel invoice");
    }
  };
  const handleView = (id) => {
    onNavigate == null ? void 0 : onNavigate(`/billing/${id}`);
  };
  const columns = [
    {
      key: "id",
      header: "Invoice #",
      render: (inv) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground text-xs", children: [
        "#",
        inv.id.toString()
      ] })
    },
    {
      key: "patient",
      header: "Patient",
      render: (inv) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: patientMap.get(inv.patient_id.toString()) ?? `Patient #${inv.patient_id}` })
    },
    {
      key: "date",
      header: "Date",
      render: (inv) => new Date(Number(inv.created_at / BigInt(1e6))).toLocaleDateString(
        "en-IN",
        { day: "2-digit", month: "short", year: "numeric" }
      )
    },
    {
      key: "subtotal",
      header: "Subtotal",
      align: "right",
      render: (inv) => `₹${inv.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    },
    {
      key: "gst",
      header: "GST",
      align: "right",
      render: (inv) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "₹",
        inv.gst_total.toLocaleString("en-IN", { minimumFractionDigits: 2 })
      ] })
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (inv) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
        "₹",
        inv.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })
      ] })
    },
    {
      key: "status",
      header: "Status",
      render: (inv) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: inv.status })
    },
    {
      key: "actions",
      header: "",
      render: (inv, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => handleView(inv.id),
            "data-ocid": `billing.view_button.${i + 1}`,
            className: "px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            children: "View"
          }
        ),
        (inv.status === InvoiceStatus.issued || inv.status === InvoiceStatus.partiallyPaid) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setPayingInvoice(inv),
            "data-ocid": `billing.record_payment_button.${i + 1}`,
            className: "px-2.5 py-1 text-xs rounded-md bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-colors",
            children: "Pay"
          }
        ),
        inv.status !== InvoiceStatus.cancelled && inv.status !== InvoiceStatus.paid && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => handleCancel(inv.id),
            "data-ocid": `billing.cancel_button.${i + 1}`,
            className: "px-2.5 py-1 text-xs rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors",
            children: "Cancel"
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "billing.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Billing & Payments",
        description: "Manage invoices, GST, and payment records",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowCreate(true),
            "data-ocid": "billing.add_button",
            className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "New Invoice"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Revenue",
          value: `₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
          sub: "Paid invoices",
          icon: TrendingUp,
          accent: "oklch(0.65 0.17 155)"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Pending Amount",
          value: `₹${pendingAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
          sub: "Outstanding balance",
          icon: DollarSign,
          accent: "oklch(0.74 0.16 78)"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Paid Invoices",
          value: String(paidCount),
          sub: `of ${allInvoices.length} total`,
          icon: ReceiptText,
          accent: "oklch(0.62 0.18 200)"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total GST Collected",
          value: `₹${totalGst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
          sub: "All active invoices",
          icon: FileText,
          accent: "oklch(0.58 0.22 25)"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-1 mb-4 bg-muted/30 border border-border rounded-lg p-1 w-fit",
        "data-ocid": "billing.filter.tab",
        children: FILTER_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFilter(opt.value),
            "data-ocid": `billing.filter.${opt.value}`,
            className: `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === opt.value ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              opt.label,
              opt.value !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-[10px] opacity-70", children: [
                "(",
                allInvoices.filter((i) => i.status === opt.value).length,
                ")"
              ] })
            ]
          },
          opt.value
        ))
      }
    ),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "h-7 w-7" }),
        title: "No invoices found",
        description: filter === "all" ? "Create your first invoice to get started." : `No ${(_a = FILTER_OPTIONS.find((o) => o.value === filter)) == null ? void 0 : _a.label.toLowerCase()} invoices.`,
        "data-ocid": "billing.empty_state"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Table,
      {
        columns,
        data: filtered,
        keyExtractor: (inv) => inv.id.toString(),
        emptyMessage: "No invoices found",
        stickyHeader: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      InvoiceFormModal,
      {
        open: showCreate,
        onClose: () => setShowCreate(false)
      }
    ),
    payingInvoice && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentModal,
      {
        open: !!payingInvoice,
        onClose: () => setPayingInvoice(null),
        invoice: payingInvoice,
        patientName: patientMap.get(payingInvoice.patient_id.toString()) ?? `Patient #${payingInvoice.patient_id}`
      }
    )
  ] });
}
export {
  BillingPage as default
};
