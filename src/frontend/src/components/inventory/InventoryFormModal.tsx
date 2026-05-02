import { useEffect, useState } from "react";
import type { InventoryItemInput } from "../../types";
import type { InventoryItem } from "../../types";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Select } from "../shared/Select";

const CATEGORY_OPTIONS = [
  { value: "Consumables", label: "Consumables" },
  { value: "Instruments", label: "Instruments" },
  { value: "Medications", label: "Medications" },
  { value: "Anesthetics", label: "Anesthetics" },
  { value: "Prosthetics", label: "Prosthetics" },
  { value: "Orthodontics", label: "Orthodontics" },
  { value: "Sterilization", label: "Sterilization" },
  { value: "PPE", label: "PPE" },
  { value: "Radiography", label: "Radiography" },
  { value: "Other", label: "Other" },
];

const UNIT_OPTIONS = [
  { value: "pcs", label: "Pieces" },
  { value: "box", label: "Box" },
  { value: "pack", label: "Pack" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "L", label: "Liters (L)" },
  { value: "g", label: "Grams (g)" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "vial", label: "Vial" },
  { value: "strip", label: "Strip" },
  { value: "roll", label: "Roll" },
];

interface InventoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: InventoryItemInput) => Promise<void>;
  isPending: boolean;
  editItem?: InventoryItem | null;
}

const emptyForm = (): InventoryItemInput => ({
  name: "",
  category: "Consumables",
  unit: "pcs",
  stock: 0,
  reorder_level: 10,
  cost_price: 0,
  supplier: "",
  expiry_date: undefined,
});

export function InventoryFormModal({
  open,
  onClose,
  onSubmit,
  isPending,
  editItem,
}: InventoryFormModalProps) {
  const [form, setForm] = useState<InventoryItemInput>(emptyForm());
  const [expiryDateStr, setExpiryDateStr] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof InventoryItemInput, string>>
  >({});

  useEffect(() => {
    if (!open) return;
    if (editItem) {
      setForm({
        name: editItem.name,
        category: editItem.category,
        unit: editItem.unit,
        stock: editItem.stock,
        reorder_level: editItem.reorder_level,
        cost_price: editItem.cost_price,
        supplier: editItem.supplier,
        expiry_date: editItem.expiry_date,
      });
      setExpiryDateStr(editItem.expiry_date ?? "");
    } else {
      setForm(emptyForm());
      setExpiryDateStr("");
    }
    setErrors({});
  }, [editItem, open]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof InventoryItemInput, string>> = {};
    if (!form.name.trim()) errs.name = "Item name is required";
    if (form.stock < 0) errs.stock = "Stock cannot be negative";
    if (form.cost_price < 0) errs.cost_price = "Cost price cannot be negative";
    if (form.reorder_level < 0)
      errs.reorder_level = "Reorder level cannot be negative";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({
      ...form,
      expiry_date: expiryDateStr || undefined,
    });
  };

  const set = (
    key: keyof InventoryItemInput,
    value: string | number | undefined,
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const isEdit = !!editItem;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Inventory Item" : "Add Inventory Item"}
      description={
        isEdit
          ? `Editing: ${editItem?.name}`
          : "Add a new item to your clinic inventory"
      }
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="inventory-form.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isPending}
            data-ocid="inventory-form.submit_button"
          >
            {isEdit ? "Save Changes" : "Add Item"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Item Name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g., Dental Cotton Rolls"
            error={errors.name}
            data-ocid="inventory-form.name.input"
          />
        </div>

        <Select
          label="Category"
          value={form.category}
          options={CATEGORY_OPTIONS}
          onChange={(v) => set("category", v)}
          data-ocid="inventory-form.category.select"
        />

        <Select
          label="Unit"
          value={form.unit}
          options={UNIT_OPTIONS}
          onChange={(v) => set("unit", v)}
          data-ocid="inventory-form.unit.select"
        />

        <Input
          label="Current Stock"
          type="number"
          min={0}
          value={form.stock}
          onChange={(e) => set("stock", Number(e.target.value))}
          error={errors.stock}
          data-ocid="inventory-form.stock.input"
        />

        <Input
          label="Reorder Level"
          type="number"
          min={0}
          value={form.reorder_level}
          onChange={(e) => set("reorder_level", Number(e.target.value))}
          hint="Alert when stock drops below this"
          error={errors.reorder_level}
          data-ocid="inventory-form.reorder_level.input"
        />

        <Input
          label="Cost Price (₹)"
          type="number"
          min={0}
          step={0.01}
          value={form.cost_price}
          onChange={(e) => set("cost_price", Number(e.target.value))}
          error={errors.cost_price}
          data-ocid="inventory-form.cost_price.input"
        />

        <Input
          label="Supplier"
          value={form.supplier}
          onChange={(e) => set("supplier", e.target.value)}
          placeholder="e.g., MedDent Supplies"
          data-ocid="inventory-form.supplier.input"
        />

        <Input
          label="Expiry Date (optional)"
          type="date"
          value={expiryDateStr}
          onChange={(e) => setExpiryDateStr(e.target.value)}
          hint="Leave blank if this item doesn't expire"
          data-ocid="inventory-form.expiry_date.input"
        />
      </div>
    </Modal>
  );
}
