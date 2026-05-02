import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Table } from "@/components/shared/Table";
import { format, isPast, parseISO } from "date-fns";
import { AlertTriangle, Edit2, FlaskConical, Plus } from "lucide-react";
import { useState } from "react";
import { LabOrderFormModal } from "../components/lab/LabOrderFormModal";
import { LabStatusModal } from "../components/lab/LabStatusModal";
import { useLabOrders } from "../hooks/useLabOrders";
import { usePatients } from "../hooks/usePatients";
import type { LabOrder } from "../types";
import { LabOrderStatus } from "../types";

type Filter = "all" | LabOrderStatus;

const LAB_STATUS_CONFIG: Record<
  LabOrderStatus,
  { label: string; className: string }
> = {
  [LabOrderStatus.pending]: {
    label: "Pending",
    className: "badge-pending",
  },
  [LabOrderStatus.inProgress]: {
    label: "In Progress",
    className: "badge-in-progress",
  },
  [LabOrderStatus.completed]: {
    label: "Completed",
    className: "badge-completed",
  },
  [LabOrderStatus.cancelled]: {
    label: "Cancelled",
    className: "badge-rejected",
  },
};

function LabStatusBadge({ status }: { status: LabOrderStatus }) {
  const config =
    LAB_STATUS_CONFIG[status] ?? LAB_STATUS_CONFIG[LabOrderStatus.pending];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

const FILTER_LABELS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: LabOrderStatus.pending, label: "Pending" },
  { value: LabOrderStatus.inProgress, label: "In Progress" },
  { value: LabOrderStatus.completed, label: "Completed" },
  { value: LabOrderStatus.cancelled, label: "Cancelled" },
];

export default function LabOrdersPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<LabOrder | null>(null);

  const { data: labOrders = [], isLoading } = useLabOrders();
  const { data: patients = [] } = usePatients();

  const patientMap = new Map(patients.map((p) => [p.id.toString(), p]));

  const getPatientName = (id: bigint) => {
    const p = patientMap.get(id.toString());
    return p ? `${p.first_name} ${p.last_name}` : `#${id}`;
  };

  const isOverdue = (order: LabOrder) =>
    order.status !== LabOrderStatus.completed &&
    order.status !== LabOrderStatus.cancelled &&
    !!order.due_date &&
    isPast(parseISO(order.due_date));

  const filtered =
    filter === "all" ? labOrders : labOrders.filter((o) => o.status === filter);

  const overdueCount = labOrders.filter(isOverdue).length;

  const columns = [
    {
      key: "patient",
      header: "Patient",
      render: (o: LabOrder) => (
        <span className="font-medium text-foreground">
          {getPatientName(o.patient_id)}
        </span>
      ),
    },
    {
      key: "lab_name",
      header: "Lab",
      render: (o: LabOrder) => (
        <span className="text-foreground">{o.lab_name}</span>
      ),
    },
    {
      key: "procedure_type",
      header: "Procedure",
      render: (o: LabOrder) => (
        <span className="capitalize text-muted-foreground">
          {o.procedure_type}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (o: LabOrder) => <LabStatusBadge status={o.status} />,
    },
    {
      key: "due_date",
      header: "Due Date",
      render: (o: LabOrder) => {
        const overdue = isOverdue(o);
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`tabular-nums text-sm ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
            >
              {o.due_date ? format(parseISO(o.due_date), "dd MMM yyyy") : "—"}
            </span>
            {overdue && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-destructive/15 text-destructive border border-destructive/25">
                <AlertTriangle className="h-2.5 w-2.5" />
                Overdue
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "right" as const,
      render: (o: LabOrder, i: number) => (
        <button
          type="button"
          data-ocid={`lab-orders.edit_button.${i + 1}`}
          onClick={() => setUpdateTarget(o)}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Edit2 className="h-3 w-3" />
          Update Status
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6" data-ocid="lab-orders.page">
      <PageHeader
        title="Lab Orders"
        description="Track dental lab work and manage order status"
        actions={
          <Button
            onClick={() => setShowCreate(true)}
            data-ocid="lab-orders.add_button"
          >
            <Plus className="h-4 w-4" />
            New Lab Order
          </Button>
        }
      />

      {/* Overdue alert */}
      {overdueCount > 0 && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-sm text-destructive"
          data-ocid="lab-orders.overdue_alert"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>{overdueCount}</strong> lab order
            {overdueCount > 1 ? "s are" : " is"} past due date.
          </span>
        </div>
      )}

      {/* Filters */}
      <div
        className="flex items-center gap-2 flex-wrap"
        data-ocid="lab-orders.filter.tab"
      >
        {FILTER_LABELS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`h-8 px-3 rounded-lg text-sm font-medium transition-colors ${
              filter === value
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-20"
          data-ocid="lab-orders.loading_state"
        >
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FlaskConical className="h-7 w-7" />}
          title="No lab orders found"
          description={
            filter === "all"
              ? "Create a lab order to send work to a dental laboratory."
              : `No ${filter} orders.`
          }
          action={
            filter === "all" ? (
              <Button
                onClick={() => setShowCreate(true)}
                data-ocid="lab-orders.empty_state_add_button"
              >
                <Plus className="h-4 w-4" />
                New Lab Order
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div data-ocid="lab-orders.table">
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(o) => o.id.toString()}
            stickyHeader
          />
        </div>
      )}

      <LabOrderFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {updateTarget && (
        <LabStatusModal
          order={updateTarget}
          open={!!updateTarget}
          onClose={() => setUpdateTarget(null)}
        />
      )}
    </div>
  );
}
