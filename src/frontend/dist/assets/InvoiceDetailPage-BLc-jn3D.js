import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, P as PageLoader, I as InvoiceStatus, k as PaymentMethod } from "./index-CRusxQeF.js";
import { P as PaymentModal } from "./PaymentModal-Ai0007lk.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { S as StatusBadge } from "./StatusBadge-De4IVkH2.js";
import { c as useInvoice } from "./useBilling-Cm7xg-nE.js";
import { u as usePatients } from "./usePatients-1jxdmde2.js";
import { A as ArrowLeft } from "./arrow-left-B9W68Srg.js";
import { P as Printer } from "./printer-DW7fu9Up.js";
import { H as Hash } from "./hash-DEw8IING.js";
import { C as Calendar } from "./calendar-FFzdZsSO.js";
import { U as User } from "./user-DtzG4PId.js";
import "./Select-Dw0AWwQu.js";
import "./useMutation-C_my6RdQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode);
const PAYMENT_METHOD_LABELS = {
  [PaymentMethod.cash]: "Cash",
  [PaymentMethod.card]: "Card",
  [PaymentMethod.upi]: "UPI",
  [PaymentMethod.netBanking]: "Net Banking",
  [PaymentMethod.cheque]: "Cheque",
  [PaymentMethod.other]: "Other"
};
function InvoiceDetailPage({ invoiceId, onBack }) {
  const [showPayment, setShowPayment] = reactExports.useState(false);
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: patients } = usePatients();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  if (!invoice) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "Invoice not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "mt-4 text-sm text-primary hover:underline",
          children: "Back to Billing"
        }
      )
    ] });
  }
  const patientMap = new Map(
    (patients ?? []).map((p) => [
      p.id.toString(),
      {
        name: `${p.first_name} ${p.last_name}`,
        phone: p.phone,
        email: p.email
      }
    ])
  );
  const patient = patientMap.get(invoice.patient_id.toString());
  const patientName = (patient == null ? void 0 : patient.name) ?? `Patient #${invoice.patient_id}`;
  const invoiceDate = new Date(
    Number(invoice.created_at / BigInt(1e6))
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const paidAmount = invoice.payment_history.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const balanceDue = invoice.total - paidAmount;
  const canPay = invoice.status === InvoiceStatus.issued || invoice.status === InvoiceStatus.partiallyPaid;
  const gstBreakdown = invoice.items.reduce((acc, item) => {
    const gstAmt = item.amount * item.gst_rate / 100;
    if (!acc[item.gst_rate]) acc[item.gst_rate] = { taxable: 0, gst: 0 };
    acc[item.gst_rate].taxable += item.amount;
    acc[item.gst_rate].gst += gstAmt;
    return acc;
  }, {});
  const handlePrint = () => window.print();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media print {
          body > *:not(.print-invoice) { display: none !important; }
          .print-invoice { display: block !important; }
          .no-print { display: none !important; }
          .print-invoice { color: #000 !important; background: #fff !important; }
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "invoice-detail.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: `Invoice #${invoice.id}`,
          breadcrumbs: [
            { label: "Billing", onClick: onBack },
            { label: `Invoice #${invoice.id}` }
          ],
          actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 no-print", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: onBack,
                "data-ocid": "invoice-detail.back_button",
                className: "h-9 px-3 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
                  "Back"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handlePrint,
                "data-ocid": "invoice-detail.print_button",
                className: "h-9 px-3 border border-border rounded-lg text-sm hover:bg-muted transition-colors flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
                  "Print"
                ]
              }
            ),
            canPay && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowPayment(true),
                "data-ocid": "invoice-detail.record_payment_button",
                className: "h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" }),
                  "Record Payment"
                ]
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-invoice space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-foreground mb-3", children: "DentaCare Pro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "GST No: 27AABCT1332L1ZF" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "123 Medical Complex, Pune, MH 411001" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "contact@dentacarepro.in | +91 20 1234 5678" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left sm:text-right space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex sm:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: invoice.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground sm:justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                  "INV-",
                  String(invoice.id).padStart(6, "0")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground sm:justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
                invoiceDate
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-2", children: "Bill To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-muted-foreground mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: patientName }),
                (patient == null ? void 0 : patient.phone) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: patient.phone }),
                (patient == null ? void 0 : patient.email) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: patient.email })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Line Items" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left font-medium", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right font-medium", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right font-medium", children: "GST Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right font-medium", children: "GST Amt" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right font-medium", children: "Total" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: invoice.items.map((item, i) => {
              const gstAmt = item.amount * item.gst_rate / 100;
              const itemTotal = item.amount + gstAmt;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `invoice-detail.item.${i + 1}`,
                  className: "border-b border-border/50 table-row-stripe",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-foreground", children: item.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-right tabular-nums", children: [
                      "₹",
                      item.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-right text-muted-foreground", children: [
                      item.gst_rate,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-right tabular-nums text-muted-foreground", children: [
                      "₹",
                      gstAmt.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-right tabular-nums font-medium", children: [
                      "₹",
                      itemTotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] })
                  ]
                },
                `${item.description}-${i}`
              );
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "GST Breakdown" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs text-muted-foreground border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left font-medium", children: "GST Rate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right font-medium", children: "Taxable Amt" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right font-medium", children: "GST Amt" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
                Object.entries(gstBreakdown).map(([rate, vals]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border/50 table-row-stripe",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-2.5", children: [
                        rate,
                        "%"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-2.5 text-right tabular-nums", children: [
                        "₹",
                        vals.taxable.toLocaleString("en-IN", {
                          minimumFractionDigits: 2
                        })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-2.5 text-right tabular-nums", children: [
                        "₹",
                        vals.gst.toLocaleString("en-IN", {
                          minimumFractionDigits: 2
                        })
                      ] })
                    ]
                  },
                  rate
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "font-semibold bg-muted/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: "Total GST" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-2.5 text-right tabular-nums", children: [
                    "₹",
                    invoice.subtotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2
                    })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-2.5 text-right tabular-nums", children: [
                    "₹",
                    invoice.gst_total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2
                    })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground border-b border-border pb-3", children: "Amount Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                  "₹",
                  invoice.subtotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total GST" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                  "₹",
                  invoice.gst_total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold text-base border-t border-border pt-2 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Grand Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                  "₹",
                  invoice.total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })
                ] })
              ] }),
              paidAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex justify-between text-success-foreground",
                    style: { color: "oklch(0.65 0.17 155)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Amount Paid" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                        "₹",
                        paidAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2
                        })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold border-t border-border pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance Due" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "tabular-nums",
                      style: {
                        color: balanceDue > 0 ? "oklch(0.74 0.16 78)" : "oklch(0.65 0.17 155)"
                      },
                      children: [
                        "₹",
                        balanceDue.toLocaleString("en-IN", {
                          minimumFractionDigits: 2
                        })
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] }),
        invoice.payment_history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Payment History" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs text-muted-foreground border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left font-medium", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left font-medium", children: "Method" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left font-medium", children: "Reference" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right font-medium", children: "Amount" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: invoice.payment_history.map((pmt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                "data-ocid": `invoice-detail.payment.${i + 1}`,
                className: "border-b border-border/50 table-row-stripe",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: new Date(
                    Number(pmt.date / BigInt(1e6))
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                    PAYMENT_METHOD_LABELS[pmt.method] ?? pmt.method
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-mono text-xs text-muted-foreground", children: pmt.reference || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "td",
                    {
                      className: "px-5 py-3 text-right font-semibold tabular-nums",
                      style: { color: "oklch(0.65 0.17 155)" },
                      children: [
                        "₹",
                        pmt.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2
                        })
                      ]
                    }
                  )
                ]
              },
              `${pmt.date}-${pmt.amount}-${i}`
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-muted-foreground py-2", children: "This is a computer-generated invoice. Thank you for choosing DentaCare Pro." })
      ] })
    ] }),
    showPayment && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentModal,
      {
        open: showPayment,
        onClose: () => setShowPayment(false),
        invoice,
        patientName
      }
    )
  ] });
}
export {
  InvoiceDetailPage as default
};
