import { createActor } from "@/backend";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Modal } from "@/components/shared/Modal";
import { Select } from "@/components/shared/Select";
import type { LabOrder } from "@/types";
import { LabOrderStatus } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

interface LabStatusModalProps {
  order: LabOrder;
  open: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: LabOrderStatus.pending, label: "Pending" },
  { value: LabOrderStatus.inProgress, label: "In Progress" },
  { value: LabOrderStatus.completed, label: "Completed" },
  { value: LabOrderStatus.cancelled, label: "Cancelled" },
];

const STATUS_COLORS: Record<LabOrderStatus, string> = {
  [LabOrderStatus.pending]: "badge-pending",
  [LabOrderStatus.inProgress]:
    "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  [LabOrderStatus.completed]: "badge-completed",
  [LabOrderStatus.cancelled]: "badge-rejected",
};

const STATUS_LABELS: Record<LabOrderStatus, string> = {
  [LabOrderStatus.pending]: "Pending",
  [LabOrderStatus.inProgress]: "In Progress",
  [LabOrderStatus.completed]: "Completed",
  [LabOrderStatus.cancelled]: "Cancelled",
};

export function LabStatusModal({ order, open, onClose }: LabStatusModalProps) {
  const { actor } = useActor(createActor);
  const [newStatus, setNewStatus] = useState<LabOrderStatus>(order.status);
  const [completedDate, setCompletedDate] = useState(
    order.completed_date ?? format(new Date(), "yyyy-MM-dd"),
  );
  const [notes, setNotes] = useState("");

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const completed =
        newStatus === LabOrderStatus.completed ? completedDate : null;
      return actor.updateLabOrderStatus(order.id, newStatus, completed);
    },
    onSuccess: () => {
      toast.success("Lab order status updated");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const isCompleting = newStatus === LabOrderStatus.completed;
  const isSame = newStatus === order.status;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Lab Order Status"
      description={`Order for ${order.lab_name} · ${order.procedure_type}`}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="lab-status.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => updateMutation.mutate()}
            loading={updateMutation.isPending}
            disabled={isSame || updateMutation.isPending}
            data-ocid="lab-status.confirm_button"
          >
            Update Status
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Current status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
          <span className="text-sm text-muted-foreground">Current Status</span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
          >
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        {/* New status */}
        <Select
          label="New Status"
          value={newStatus}
          onChange={(v) => setNewStatus(v as LabOrderStatus)}
          options={STATUS_OPTIONS}
          data-ocid="lab-status.status_select"
        />

        {/* Completed date — only show when completing */}
        {isCompleting && (
          <Input
            label="Completed Date"
            type="date"
            value={completedDate}
            onChange={(e) => setCompletedDate(e.target.value)}
            data-ocid="lab-status.completed_date_input"
          />
        )}

        {/* Notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="lab-status-notes"
            className="text-sm font-medium text-foreground"
          >
            Notes
          </label>
          <textarea
            id="lab-status-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for status change or additional notes..."
            rows={3}
            data-ocid="lab-status.notes_textarea"
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none transition-colors"
          />
        </div>

        {/* Warning for cancellation */}
        {newStatus === LabOrderStatus.cancelled && (
          <p
            className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
            data-ocid="lab-status.error_state"
          >
            Cancelling this lab order cannot be undone. The lab will be
            notified.
          </p>
        )}
      </div>
    </Modal>
  );
}
