import {
  AlertTriangle,
  CalendarClock,
  Edit2,
  Package,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { InventoryFormModal } from "../components/inventory/InventoryFormModal";
import { StockAdjustmentModal } from "../components/inventory/StockAdjustmentModal";
import { PageHeader } from "../components/layout/PageHeader";
import { Badge } from "../components/shared/Badge";
import { Button } from "../components/shared/Button";
import { EmptyState } from "../components/shared/EmptyState";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { Select } from "../components/shared/Select";
import { Table } from "../components/shared/Table";
import {
  useAdjustStock,
  useCreateInventoryItem,
  useDeleteInventoryItem,
  useExpiryAlerts,
  useInventoryItems,
  useLowStockAlerts,
  useUpdateInventoryItem,
} from "../hooks/useInventory";
import type { InventoryItem, InventoryItemInput } from "../types";

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
  { value: "Other", label: "Other" },
];

const STOCK_FILTER_OPTIONS = [
  { value: "", label: "All Stock Levels" },
  { value: "ok", label: "OK" },
  { value: "low", label: "Low" },
  { value: "critical", label: "Critical / Out" },
];

type StockStatus = "ok" | "low" | "critical";

function getStockStatus(item: InventoryItem): StockStatus {
  if (item.stock <= 0) return "critical";
  if (item.stock <= item.reorder_level) return "low";
  return "ok";
}

function StockIndicator({ item }: { item: InventoryItem }) {
  const status = getStockStatus(item);
  const pct = Math.min(
    100,
    item.reorder_level > 0
      ? (item.stock / (item.reorder_level * 3)) * 100
      : 100,
  );

  return (
    <div className="flex items-center gap-2.5 min-w-[110px]">
      <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.max(2, pct)}%`,
            backgroundColor:
              status === "ok"
                ? "oklch(0.65 0.17 155)"
                : status === "low"
                  ? "oklch(0.74 0.16 78)"
                  : "oklch(0.58 0.22 25)",
          }}
        />
      </div>
      <span
        className="text-xs font-bold tabular-nums"
        style={{
          color:
            status === "ok"
              ? "oklch(0.65 0.17 155)"
              : status === "low"
                ? "oklch(0.74 0.16 78)"
                : "oklch(0.58 0.22 25)",
        }}
      >
        {item.stock} {item.unit}
      </span>
    </div>
  );
}

function ExpiryBadge({ date }: { date?: string }) {
  if (!date) return <span className="text-muted-foreground text-xs">—</span>;
  const today = new Date();
  const expiry = new Date(date);
  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
  if (daysLeft < 0)
    return (
      <Badge className="badge-rejected text-xs whitespace-nowrap">
        Expired
      </Badge>
    );
  if (daysLeft <= 30)
    return (
      <span className="flex flex-col gap-0.5">
        <Badge className="badge-pending text-xs whitespace-nowrap">
          {daysLeft}d left
        </Badge>
        <span className="text-[10px] text-muted-foreground">{date}</span>
      </span>
    );
  return <span className="text-xs text-muted-foreground">{date}</span>;
}

export default function InventoryPage() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);

  const { data: items, isLoading } = useInventoryItems();
  const { data: lowStock } = useLowStockAlerts();
  const { data: expiring } = useExpiryAlerts(30);
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const adjustStock = useAdjustStock();
  const deleteItem = useDeleteInventoryItem();

  if (isLoading) return <PageLoader />;

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

  const handleCreate = async (input: InventoryItemInput) => {
    try {
      await createItem.mutateAsync(input);
      setShowAdd(false);
      toast.success("Item added to inventory");
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleUpdate = async (input: InventoryItemInput) => {
    if (!editItem) return;
    try {
      await updateItem.mutateAsync({ id: editItem.id, input });
      setEditItem(null);
      toast.success("Item updated");
    } catch {
      toast.error("Failed to update item");
    }
  };

  const handleAdjust = async (delta: number, _reason: string) => {
    if (!adjustItem) return;
    try {
      await adjustStock.mutateAsync({ id: adjustItem.id, delta });
      setAdjustItem(null);
      toast.success(
        delta > 0
          ? `Added ${delta} ${adjustItem.unit} to stock`
          : `Removed ${Math.abs(delta)} ${adjustItem.unit} from stock`,
      );
    } catch {
      toast.error("Failed to adjust stock");
    }
  };

  const handleDelete = async (item: InventoryItem) => {
    if (!confirm(`Delete "${item.name}" from inventory?`)) return;
    try {
      await deleteItem.mutateAsync(item.id);
      toast.success("Item removed from inventory");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Item",
      render: (item: InventoryItem) => (
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {item.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {item.supplier || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item: InventoryItem) => (
        <Badge variant="secondary">{item.category}</Badge>
      ),
    },
    {
      key: "stock",
      header: "Stock Level",
      render: (item: InventoryItem) => <StockIndicator item={item} />,
    },
    {
      key: "reorder_level",
      header: "Reorder At",
      align: "right" as const,
      render: (item: InventoryItem) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {item.reorder_level} {item.unit}
        </span>
      ),
    },
    {
      key: "cost_price",
      header: "Cost",
      align: "right" as const,
      render: (item: InventoryItem) => (
        <span className="text-sm tabular-nums">
          ₹{item.cost_price.toFixed(2)}
        </span>
      ),
    },
    {
      key: "expiry_date",
      header: "Expiry",
      render: (item: InventoryItem) => <ExpiryBadge date={item.expiry_date} />,
    },
    {
      key: "actions",
      header: "",
      render: (item: InventoryItem, i: number) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAdjustItem(item)}
            data-ocid={`inventory.adjust_button.${i + 1}`}
            title="Adjust stock"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Adjust stock"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEditItem(item)}
            data-ocid={`inventory.edit_button.${i + 1}`}
            title="Edit item"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Edit item"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(item)}
            data-ocid={`inventory.delete_button.${i + 1}`}
            title="Delete item"
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Delete item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const lowStockCount = (lowStock ?? []).length;
  const expiringCount = (expiring ?? []).length;

  return (
    <div data-ocid="inventory.page">
      <PageHeader
        title="Inventory"
        description="Track stock levels, expiry dates, and reorder thresholds"
        breadcrumbs={[{ label: "Clinic" }, { label: "Inventory" }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAdd(true)}
            data-ocid="inventory.add_button"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        }
      />

      {/* Alert banner */}
      {(lowStockCount > 0 || expiringCount > 0) && (
        <div
          className="flex flex-wrap gap-2 mb-5"
          data-ocid="inventory.alerts.section"
        >
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
              <span className="text-destructive font-medium">
                <strong>{lowStockCount}</strong> item
                {lowStockCount > 1 ? "s" : ""} below reorder level
              </span>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="flex items-center gap-2 bg-[oklch(0.74_0.16_78/0.10)] border border-[oklch(0.74_0.16_78/0.25)] rounded-lg px-3 py-2 text-xs">
              <CalendarClock className="h-3.5 w-3.5 text-[oklch(0.74_0.16_78)] shrink-0" />
              <span className="text-[oklch(0.74_0.16_78)] font-medium">
                <strong>{expiringCount}</strong> item
                {expiringCount > 1 ? "s" : ""} expiring within 30 days
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="w-48" data-ocid="inventory.category.select">
          <Select
            value={categoryFilter}
            options={CATEGORY_FILTER_OPTIONS}
            onChange={setCategoryFilter}
          />
        </div>
        <div className="w-44" data-ocid="inventory.stock_status.select">
          <Select
            value={stockFilter}
            options={STOCK_FILTER_OPTIONS}
            onChange={setStockFilter}
          />
        </div>
        {(categoryFilter || stockFilter) && (
          <button
            type="button"
            onClick={() => {
              setCategoryFilter("");
              setStockFilter("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-7 w-7" />}
          title={
            categoryFilter || stockFilter
              ? "No items match your filters"
              : "No inventory items yet"
          }
          description={
            categoryFilter || stockFilter
              ? "Try adjusting your filters."
              : "Add your first item to start tracking stock."
          }
          data-ocid="inventory.empty_state"
        />
      ) : (
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          stickyHeader
          emptyMessage="No items found"
        />
      )}

      {/* Add modal */}
      <InventoryFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleCreate}
        isPending={createItem.isPending}
      />

      {/* Edit modal */}
      <InventoryFormModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleUpdate}
        isPending={updateItem.isPending}
        editItem={editItem}
      />

      {/* Adjust stock modal */}
      <StockAdjustmentModal
        open={!!adjustItem}
        onClose={() => setAdjustItem(null)}
        item={adjustItem}
        onSubmit={handleAdjust}
        isPending={adjustStock.isPending}
      />
    </div>
  );
}
