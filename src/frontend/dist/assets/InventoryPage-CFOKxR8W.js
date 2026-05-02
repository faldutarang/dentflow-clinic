import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, P as PageLoader, a as Package, u as ue } from "./index-CRusxQeF.js";
import { B as Button } from "./Button-CwPCyQgH.js";
import { M as Modal, I as Input, S as Select } from "./Select-Dw0AWwQu.js";
import { P as PageHeader } from "./PageHeader-DO9CHwhW.js";
import { B as Badge } from "./Badge-2qoa5wWf.js";
import { E as EmptyState } from "./EmptyState-DZYCptlk.js";
import { T as Table } from "./Table-ByTzrkVY.js";
import { b as useInventoryItems, u as useLowStockAlerts, a as useExpiryAlerts, c as useCreateInventoryItem, d as useUpdateInventoryItem, e as useAdjustStock, f as useDeleteInventoryItem } from "./useInventory-BxF-BI43.js";
import { P as Plus } from "./plus-CqSfRGkC.js";
import { T as TriangleAlert } from "./triangle-alert-Df_P3OKT.js";
import { P as Pen } from "./pen-DoUQIFU9.js";
import { T as Trash2 } from "./trash-2-CSaJsAG8.js";
import "./useMutation-C_my6RdQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }]
];
const CircleMinus = createLucideIcon("circle-minus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
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
  { value: "Other", label: "Other" }
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
  { value: "roll", label: "Roll" }
];
const emptyForm = () => ({
  name: "",
  category: "Consumables",
  unit: "pcs",
  stock: 0,
  reorder_level: 10,
  cost_price: 0,
  supplier: "",
  expiry_date: void 0
});
function InventoryFormModal({
  open,
  onClose,
  onSubmit,
  isPending,
  editItem
}) {
  const [form, setForm] = reactExports.useState(emptyForm());
  const [expiryDateStr, setExpiryDateStr] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
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
        expiry_date: editItem.expiry_date
      });
      setExpiryDateStr(editItem.expiry_date ?? "");
    } else {
      setForm(emptyForm());
      setExpiryDateStr("");
    }
    setErrors({});
  }, [editItem, open]);
  const validate = () => {
    const errs = {};
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
      expiry_date: expiryDateStr || void 0
    });
  };
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: void 0 }));
  };
  const isEdit = !!editItem;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: isEdit ? "Edit Inventory Item" : "Add Inventory Item",
      description: isEdit ? `Editing: ${editItem == null ? void 0 : editItem.name}` : "Add a new item to your clinic inventory",
      size: "lg",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "inventory-form.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "primary",
            onClick: handleSubmit,
            loading: isPending,
            "data-ocid": "inventory-form.submit_button",
            children: isEdit ? "Save Changes" : "Add Item"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Item Name",
            value: form.name,
            onChange: (e) => set("name", e.target.value),
            placeholder: "e.g., Dental Cotton Rolls",
            error: errors.name,
            "data-ocid": "inventory-form.name.input"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            label: "Category",
            value: form.category,
            options: CATEGORY_OPTIONS,
            onChange: (v) => set("category", v),
            "data-ocid": "inventory-form.category.select"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            label: "Unit",
            value: form.unit,
            options: UNIT_OPTIONS,
            onChange: (v) => set("unit", v),
            "data-ocid": "inventory-form.unit.select"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Current Stock",
            type: "number",
            min: 0,
            value: form.stock,
            onChange: (e) => set("stock", Number(e.target.value)),
            error: errors.stock,
            "data-ocid": "inventory-form.stock.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Reorder Level",
            type: "number",
            min: 0,
            value: form.reorder_level,
            onChange: (e) => set("reorder_level", Number(e.target.value)),
            hint: "Alert when stock drops below this",
            error: errors.reorder_level,
            "data-ocid": "inventory-form.reorder_level.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Cost Price (₹)",
            type: "number",
            min: 0,
            step: 0.01,
            value: form.cost_price,
            onChange: (e) => set("cost_price", Number(e.target.value)),
            error: errors.cost_price,
            "data-ocid": "inventory-form.cost_price.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Supplier",
            value: form.supplier,
            onChange: (e) => set("supplier", e.target.value),
            placeholder: "e.g., MedDent Supplies",
            "data-ocid": "inventory-form.supplier.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Expiry Date (optional)",
            type: "date",
            value: expiryDateStr,
            onChange: (e) => setExpiryDateStr(e.target.value),
            hint: "Leave blank if this item doesn't expire",
            "data-ocid": "inventory-form.expiry_date.input"
          }
        )
      ] })
    }
  );
}
const REASON_OPTIONS = [
  { value: "Received new stock", label: "Received new stock" },
  { value: "Used in treatment", label: "Used in treatment" },
  { value: "Damaged / expired", label: "Damaged / expired" },
  { value: "Stock correction", label: "Stock correction" },
  { value: "Returned to supplier", label: "Returned to supplier" },
  { value: "Other", label: "Other" }
];
function StockAdjustmentModal({
  open,
  onClose,
  item,
  onSubmit,
  isPending
}) {
  const [direction, setDirection] = reactExports.useState("add");
  const [quantity, setQuantity] = reactExports.useState("1");
  const [reason, setReason] = reactExports.useState(REASON_OPTIONS[0].value);
  const [customReason, setCustomReason] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
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
  const stockLevelColor = newStock <= 0 ? "text-destructive" : newStock <= item.reorder_level ? "text-[oklch(0.74_0.16_78)]" : "text-[oklch(0.65_0.17_155)]";
  const handleSubmit = async () => {
    if (!qty || qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (direction === "remove" && qty > item.stock) {
      setError(
        `Cannot remove more than current stock (${item.stock} ${item.unit})`
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: "Adjust Stock",
      description: `Update stock level for ${item.name}`,
      size: "sm",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "stock-adjustment.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "primary",
            onClick: handleSubmit,
            loading: isPending,
            "data-ocid": "stock-adjustment.submit_button",
            children: "Apply Adjustment"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/20 border border-border px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: item.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Current stock:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
              item.stock,
              " ",
              item.unit
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "text-sm font-medium text-foreground mb-2 block", children: "Adjustment Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setDirection("add");
                  setError("");
                },
                "data-ocid": "stock-adjustment.add.toggle",
                className: `flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${direction === "add" ? "bg-[oklch(0.65_0.17_155/0.15)] border-[oklch(0.65_0.17_155/0.4)] text-[oklch(0.65_0.17_155)]" : "border-border text-muted-foreground hover:bg-muted/20"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
                  "Add Stock"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setDirection("remove");
                  setError("");
                },
                "data-ocid": "stock-adjustment.remove.toggle",
                className: `flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${direction === "remove" ? "bg-destructive/15 border-destructive/40 text-destructive" : "border-border text-muted-foreground hover:bg-muted/20"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "h-4 w-4" }),
                  "Remove Stock"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: `Quantity to ${direction === "add" ? "Add" : "Remove"} (${item.unit})`,
            type: "number",
            min: 1,
            value: quantity,
            onChange: (e) => {
              setQuantity(e.target.value);
              setError("");
            },
            error: !error.includes("reason") && !error.includes("provide") ? error || void 0 : void 0,
            "data-ocid": "stock-adjustment.quantity.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg bg-muted/10 border border-border px-4 py-2.5",
            "aria-live": "polite",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "New stock level" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-sm font-bold tabular-nums ${stockLevelColor}`, children: [
                newStock < 0 ? "0" : newStock,
                " ",
                item.unit
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            label: "Reason",
            value: reason,
            options: REASON_OPTIONS,
            onChange: setReason,
            "data-ocid": "stock-adjustment.reason.select"
          }
        ),
        reason === "Other" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            label: "Custom Reason",
            value: customReason,
            onChange: (e) => {
              setCustomReason(e.target.value);
              setError("");
            },
            placeholder: "Describe the reason...",
            error: error.includes("provide") ? error : void 0,
            "data-ocid": "stock-adjustment.custom_reason.input"
          }
        ),
        error && !reason.includes("Other") && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "stock-adjustment.error_state",
            children: error
          }
        )
      ] })
    }
  );
}
const CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "Consumables", label: "Consumables" },
  { value: "Instruments", label: "Instruments" },
  { value: "Medications", label: "Medications" },
  { value: "Anesthetics", label: "Anesthetics" },
  { value: "Prosthetics", label: "Prosthetics" },
  { value: "Orthodontics", label: "Orthodontics" },
  { value: "Sterilization", label: "Sterilization" },
  { value: "PPE", label: "PPE" },
  { value: "Radiography", label: "Radiography" },
  { value: "Other", label: "Other" }
];
const STOCK_FILTER_OPTIONS = [
  { value: "", label: "All Stock Levels" },
  { value: "ok", label: "OK" },
  { value: "low", label: "Low" },
  { value: "critical", label: "Critical / Out" }
];
function getStockStatus(item) {
  if (item.stock <= 0) return "critical";
  if (item.stock <= item.reorder_level) return "low";
  return "ok";
}
function StockIndicator({ item }) {
  const status = getStockStatus(item);
  const pct = Math.min(
    100,
    item.reorder_level > 0 ? item.stock / (item.reorder_level * 3) * 100 : 100
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-[110px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full rounded-full transition-all",
        style: {
          width: `${Math.max(2, pct)}%`,
          backgroundColor: status === "ok" ? "oklch(0.65 0.17 155)" : status === "low" ? "oklch(0.74 0.16 78)" : "oklch(0.58 0.22 25)"
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "text-xs font-bold tabular-nums",
        style: {
          color: status === "ok" ? "oklch(0.65 0.17 155)" : status === "low" ? "oklch(0.74 0.16 78)" : "oklch(0.58 0.22 25)"
        },
        children: [
          item.stock,
          " ",
          item.unit
        ]
      }
    )
  ] });
}
function ExpiryBadge({ date }) {
  if (!date) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" });
  const today = /* @__PURE__ */ new Date();
  const expiry = new Date(date);
  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / 864e5);
  if (daysLeft < 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "badge-rejected text-xs whitespace-nowrap", children: "Expired" });
  if (daysLeft <= 30)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "badge-pending text-xs whitespace-nowrap", children: [
        daysLeft,
        "d left"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: date })
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: date });
}
function InventoryPage() {
  const [categoryFilter, setCategoryFilter] = reactExports.useState("");
  const [stockFilter, setStockFilter] = reactExports.useState("");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editItem, setEditItem] = reactExports.useState(null);
  const [adjustItem, setAdjustItem] = reactExports.useState(null);
  const { data: items, isLoading } = useInventoryItems();
  const { data: lowStock } = useLowStockAlerts();
  const { data: expiring } = useExpiryAlerts(30);
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const adjustStock = useAdjustStock();
  const deleteItem = useDeleteInventoryItem();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  const filtered = (items ?? []).filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (stockFilter) {
      const s = getStockStatus(item);
      if (stockFilter === "ok" && s !== "ok") return false;
      if (stockFilter === "low" && s !== "low") return false;
      if (stockFilter === "critical" && s !== "critical") return false;
    }
    return true;
  });
  const handleCreate = async (input) => {
    try {
      await createItem.mutateAsync(input);
      setShowAdd(false);
      ue.success("Item added to inventory");
    } catch {
      ue.error("Failed to add item");
    }
  };
  const handleUpdate = async (input) => {
    if (!editItem) return;
    try {
      await updateItem.mutateAsync({ id: editItem.id, input });
      setEditItem(null);
      ue.success("Item updated");
    } catch {
      ue.error("Failed to update item");
    }
  };
  const handleAdjust = async (delta, _reason) => {
    if (!adjustItem) return;
    try {
      await adjustStock.mutateAsync({ id: adjustItem.id, delta });
      setAdjustItem(null);
      ue.success(
        delta > 0 ? `Added ${delta} ${adjustItem.unit} to stock` : `Removed ${Math.abs(delta)} ${adjustItem.unit} from stock`
      );
    } catch {
      ue.error("Failed to adjust stock");
    }
  };
  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}" from inventory?`)) return;
    try {
      await deleteItem.mutateAsync(item.id);
      ue.success("Item removed from inventory");
    } catch {
      ue.error("Failed to delete item");
    }
  };
  const columns = [
    {
      key: "name",
      header: "Item",
      render: (item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground truncate", children: item.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.supplier || "—" })
      ] })
    },
    {
      key: "category",
      header: "Category",
      render: (item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: item.category })
    },
    {
      key: "stock",
      header: "Stock Level",
      render: (item) => /* @__PURE__ */ jsxRuntimeExports.jsx(StockIndicator, { item })
    },
    {
      key: "reorder_level",
      header: "Reorder At",
      align: "right",
      render: (item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
        item.reorder_level,
        " ",
        item.unit
      ] })
    },
    {
      key: "cost_price",
      header: "Cost",
      align: "right",
      render: (item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm tabular-nums", children: [
        "₹",
        item.cost_price.toFixed(2)
      ] })
    },
    {
      key: "expiry_date",
      header: "Expiry",
      render: (item) => /* @__PURE__ */ jsxRuntimeExports.jsx(ExpiryBadge, { date: item.expiry_date })
    },
    {
      key: "actions",
      header: "",
      render: (item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setAdjustItem(item),
            "data-ocid": `inventory.adjust_button.${i + 1}`,
            title: "Adjust stock",
            className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "aria-label": "Adjust stock",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setEditItem(item),
            "data-ocid": `inventory.edit_button.${i + 1}`,
            title: "Edit item",
            className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "aria-label": "Edit item",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => handleDelete(item),
            "data-ocid": `inventory.delete_button.${i + 1}`,
            title: "Delete item",
            className: "p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            "aria-label": "Delete item",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
          }
        )
      ] })
    }
  ];
  const lowStockCount = (lowStock ?? []).length;
  const expiringCount = (expiring ?? []).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "inventory.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Inventory",
        description: "Track stock levels, expiry dates, and reorder thresholds",
        breadcrumbs: [{ label: "Clinic" }, { label: "Inventory" }],
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "primary",
            size: "sm",
            onClick: () => setShowAdd(true),
            "data-ocid": "inventory.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "Add Item"
            ]
          }
        )
      }
    ),
    (lowStockCount > 0 || expiringCount > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap gap-2 mb-5",
        "data-ocid": "inventory.alerts.section",
        children: [
          lowStockCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-destructive shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: lowStockCount }),
              " item",
              lowStockCount > 1 ? "s" : "",
              " below reorder level"
            ] })
          ] }),
          expiringCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-[oklch(0.74_0.16_78/0.10)] border border-[oklch(0.74_0.16_78/0.25)] rounded-lg px-3 py-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-3.5 w-3.5 text-[oklch(0.74_0.16_78)] shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[oklch(0.74_0.16_78)] font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: expiringCount }),
              " item",
              expiringCount > 1 ? "s" : "",
              " expiring within 30 days"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48", "data-ocid": "inventory.category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Select,
        {
          value: categoryFilter,
          options: CATEGORY_FILTER_OPTIONS,
          onChange: setCategoryFilter
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-44", "data-ocid": "inventory.stock_status.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Select,
        {
          value: stockFilter,
          options: STOCK_FILTER_OPTIONS,
          onChange: setStockFilter
        }
      ) }),
      (categoryFilter || stockFilter) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setCategoryFilter("");
            setStockFilter("");
          },
          className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
          children: "Clear filters"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
        filtered.length,
        " item",
        filtered.length !== 1 ? "s" : ""
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-7 w-7" }),
        title: categoryFilter || stockFilter ? "No items match your filters" : "No inventory items yet",
        description: categoryFilter || stockFilter ? "Try adjusting your filters." : "Add your first item to start tracking stock.",
        "data-ocid": "inventory.empty_state"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Table,
      {
        columns,
        data: filtered,
        keyExtractor: (item) => item.id.toString(),
        stickyHeader: true,
        emptyMessage: "No items found"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      InventoryFormModal,
      {
        open: showAdd,
        onClose: () => setShowAdd(false),
        onSubmit: handleCreate,
        isPending: createItem.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      InventoryFormModal,
      {
        open: !!editItem,
        onClose: () => setEditItem(null),
        onSubmit: handleUpdate,
        isPending: updateItem.isPending,
        editItem
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StockAdjustmentModal,
      {
        open: !!adjustItem,
        onClose: () => setAdjustItem(null),
        item: adjustItem,
        onSubmit: handleAdjust,
        isPending: adjustStock.isPending
      }
    )
  ] });
}
export {
  InventoryPage as default
};
