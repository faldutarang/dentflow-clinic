import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateInvoice } from "../../hooks/useBilling";
import { usePatients } from "../../hooks/usePatients";
import type { InvoiceItem } from "../../types";
import { Modal } from "../shared/Modal";
import { Select } from "../shared/Select";

interface InvoiceFormModalProps {
  open: boolean;
  onClose: () => void;
}

interface LineItemRow {
  id: number;
  description: string;
  amount: string;
  gst_rate: string;
}

const GST_RATE_OPTIONS = [
  { value: "0", label: "0% (Exempt)" },
  { value: "5", label: "5% GST" },
  { value: "12", label: "12% GST" },
  { value: "18", label: "18% GST" },
  { value: "28", label: "28% GST" },
];

const EMPTY_ROW = (): LineItemRow => ({
  id: Date.now() + Math.random(),
  description: "",
  amount: "",
  gst_rate: "18",
});

function calcTotals(rows: LineItemRow[]) {
  let subtotal = 0;
  let gstTotal = 0;
  for (const row of rows) {
    const amt = Number(row.amount) || 0;
    const rate = Number(row.gst_rate) || 0;
    subtotal += amt;
    gstTotal += (amt * rate) / 100;
  }
  return { subtotal, gstTotal, grandTotal: subtotal + gstTotal };
}

export default function InvoiceFormModal({
  open,
  onClose,
}: InvoiceFormModalProps) {
  const [patientId, setPatientId] = useState("");
  const [rows, setRows] = useState<LineItemRow[]>([EMPTY_ROW()]);

  const { data: patients } = usePatients();
  const createInvoice = useCreateInvoice();

  // Reset on open
  useEffect(() => {
    if (open) {
      setPatientId("");
      setRows([EMPTY_ROW()]);
    }
  }, [open]);

  const patientOptions = (patients ?? []).map((p) => ({
    value: p.id.toString(),
    label: `${p.first_name} ${p.last_name}`,
  }));

  const { subtotal, gstTotal, grandTotal } = calcTotals(rows);

  const addRow = () => setRows((prev) => [...prev, EMPTY_ROW()]);
  const removeRow = (idx: number) =>
    setRows((prev) => prev.filter((_, i) => i !== idx));

  const updateRow = (idx: number, field: keyof LineItemRow, value: string) =>
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    );

  const isValid =
    !!patientId &&
    rows.length > 0 &&
    rows.every((r) => r.description.trim() && Number(r.amount) > 0);

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      const items: InvoiceItem[] = rows.map((r) => ({
        description: r.description.trim(),
        amount: Number(r.amount),
        gst_rate: Number(r.gst_rate),
      }));
      await createInvoice.mutateAsync({
        patient_id: BigInt(patientId),
        items,
      });
      toast.success("Invoice created successfully");
      onClose();
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Invoice"
      description="Add line items and calculate GST automatically"
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            data-ocid="invoice-form.cancel_button"
            className="h-9 px-4 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || createInvoice.isPending}
            data-ocid="invoice-form.submit_button"
            className="h-9 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {createInvoice.isPending ? "Creating..." : "Create Invoice"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Patient */}
        <Select
          label="Patient"
          options={patientOptions}
          value={patientId}
          placeholder="Select patient..."
          onChange={setPatientId}
          data-ocid="invoice-form.patient.select"
        />

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Line Items</p>
            <button
              type="button"
              onClick={addRow}
              data-ocid="invoice-form.add_item_button"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_120px_110px_36px] gap-0 bg-muted/30 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
              <span>Description</span>
              <span className="text-right pr-2">Amount (₹)</span>
              <span className="text-right pr-2">GST Rate</span>
              <span />
            </div>

            {rows.map((row, idx) => {
              const amt = Number(row.amount) || 0;
              const rate = Number(row.gst_rate) || 0;
              const gstAmt = (amt * rate) / 100;
              const rowTotal = amt + gstAmt;

              return (
                <div
                  key={row.id}
                  data-ocid={`invoice-form.item.${idx + 1}`}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <div className="grid grid-cols-[1fr_120px_110px_36px] gap-0 px-3 py-2 items-start">
                    <input
                      value={row.description}
                      onChange={(e) =>
                        updateRow(idx, "description", e.target.value)
                      }
                      placeholder="Root Canal, Crown, Cleaning…"
                      data-ocid={`invoice-form.description.${idx + 1}`}
                      className="text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none pr-2 w-full"
                    />
                    <input
                      type="number"
                      min="0"
                      value={row.amount}
                      onChange={(e) => updateRow(idx, "amount", e.target.value)}
                      placeholder="0"
                      data-ocid={`invoice-form.amount.${idx + 1}`}
                      className="text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-right tabular-nums pr-2 w-full"
                    />
                    <select
                      value={row.gst_rate}
                      onChange={(e) =>
                        updateRow(idx, "gst_rate", e.target.value)
                      }
                      data-ocid={`invoice-form.gst_rate.${idx + 1}`}
                      className="text-sm bg-transparent text-foreground focus:outline-none text-right pr-2 w-full appearance-none"
                    >
                      {GST_RATE_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-card"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      disabled={rows.length === 1}
                      data-ocid={`invoice-form.remove_item.${idx + 1}`}
                      className="flex items-center justify-center h-7 w-7 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      aria-label="Remove line item"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {amt > 0 && (
                    <div className="px-3 pb-2 text-[11px] text-muted-foreground flex justify-end gap-3">
                      <span>
                        GST: ₹
                        {gstAmt.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="font-medium text-foreground">
                        Item Total: ₹
                        {rowTotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals Summary */}
        {subtotal > 0 && (
          <div className="bg-muted/20 border border-border rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">
                ₹
                {subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Total GST</span>
              <span className="tabular-nums">
                ₹
                {gstTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t border-border pt-2 mt-1 text-foreground">
              <span>Grand Total</span>
              <span className="tabular-nums">
                ₹
                {grandTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
