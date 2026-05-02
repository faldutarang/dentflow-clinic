import { MinusCircle, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { InventoryItem } from "../../types";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Select } from "../shared/Select";

const REASON_OPTIONS = [
  { value: "Received new stock", label: "Received new stock" },
  { value: "Used in treatment", label: "Used in treatment" },
  { value: "Damaged / expired", label: "Damaged / expired" },
  { value: "Stock correction", label: "Stock correction" },
  { value: "Returned to supplier", label: "Returned to supplier" },
  { value: "Other", label: "Other" },
];

interface StockAdjustmentModalProps {
  open: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onSubmit: (delta: number, reason: string) => Promise<void>;
  isPending: boolean;
}

export function StockAdjustmentModal({
  open,
  onClose,
  item,
  onSubmit,
  isPending,
}: StockAdjustmentModalProps) {
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState(REASON_OPTIONS[0].value);
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setDirection("add");
    setQuantity("1");
    setReason(REASON_OPTIONS[0].value);
    setCustomReason("");
    setError("");
  }, [open]);

  if (!item) return null;

  const qty = Number(quantity);
  const delta = direction === "add" ? qty : -qty;
  const newStock = item.stock + delta;
  const finalReason = reason === "Other" ? customReason : reason;

  const stockLevelColor =
    newStock <= 0
      ? "text-destructive"
      : newStock <= item.reorder_level
        ? "text-[oklch(0.74_0.16_78)]"
        : "text-[oklch(0.65_0.17_155)]";

  const handleSubmit = async () => {
    if (!qty || qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (direction === "remove" && qty > item.stock) {
      setError(
        `Cannot remove more than current stock (${item.stock} ${item.unit})`,
      );
      return;
    }
    if (!finalReason.trim()) {
      setError("Please provide a reason");
      return;
    }
    setError("");
    await onSubmit(delta, finalReason);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adjust Stock"
      description={`Update stock level for ${item.name}`}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="stock-adjustment.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isPending}
            data-ocid="stock-adjustment.submit_button"
          >
            Apply Adjustment
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Item info */}
        <div className="rounded-lg bg-muted/20 border border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.category}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Current stock:
            </span>
            <span className="text-sm font-bold text-foreground">
              {item.stock} {item.unit}
            </span>
          </div>
        </div>

        {/* Direction toggle */}
        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium text-foreground mb-2 block">
            Adjustment Type
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setDirection("add");
                setError("");
              }}
              data-ocid="stock-adjustment.add.toggle"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                direction === "add"
                  ? "bg-[oklch(0.65_0.17_155/0.15)] border-[oklch(0.65_0.17_155/0.4)] text-[oklch(0.65_0.17_155)]"
                  : "border-border text-muted-foreground hover:bg-muted/20"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              Add Stock
            </button>
            <button
              type="button"
              onClick={() => {
                setDirection("remove");
                setError("");
              }}
              data-ocid="stock-adjustment.remove.toggle"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                direction === "remove"
                  ? "bg-destructive/15 border-destructive/40 text-destructive"
                  : "border-border text-muted-foreground hover:bg-muted/20"
              }`}
            >
              <MinusCircle className="h-4 w-4" />
              Remove Stock
            </button>
          </div>
        </fieldset>

        {/* Quantity */}
        <Input
          label={`Quantity to ${direction === "add" ? "Add" : "Remove"} (${item.unit})`}
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setError("");
          }}
          error={
            !error.includes("reason") && !error.includes("provide")
              ? error || undefined
              : undefined
          }
          data-ocid="stock-adjustment.quantity.input"
        />

        {/* New stock preview */}
        <div
          className="flex items-center justify-between rounded-lg bg-muted/10 border border-border px-4 py-2.5"
          aria-live="polite"
        >
          <span className="text-xs text-muted-foreground">New stock level</span>
          <span className={`text-sm font-bold tabular-nums ${stockLevelColor}`}>
            {newStock < 0 ? "0" : newStock} {item.unit}
          </span>
        </div>

        {/* Reason */}
        <Select
          label="Reason"
          value={reason}
          options={REASON_OPTIONS}
          onChange={setReason}
          data-ocid="stock-adjustment.reason.select"
        />

        {reason === "Other" && (
          <Input
            label="Custom Reason"
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value);
              setError("");
            }}
            placeholder="Describe the reason..."
            error={error.includes("provide") ? error : undefined}
            data-ocid="stock-adjustment.custom_reason.input"
          />
        )}

        {error && !reason.includes("Other") && (
          <p
            className="text-xs text-destructive"
            data-ocid="stock-adjustment.error_state"
          >
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
