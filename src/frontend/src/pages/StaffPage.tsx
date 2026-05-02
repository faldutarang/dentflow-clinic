import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { CalendarCheck2, Edit2, Plus, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../components/layout/PageHeader";
import { Badge } from "../components/shared/Badge";
import { Button } from "../components/shared/Button";
import { EmptyState } from "../components/shared/EmptyState";
import { PageLoader } from "../components/shared/LoadingSpinner";
import { Select } from "../components/shared/Select";
import { StatusBadge } from "../components/shared/StatusBadge";
import { Table } from "../components/shared/Table";
import { AttendanceModal } from "../components/staff/AttendanceModal";
import { StaffFormModal } from "../components/staff/StaffFormModal";
import {
  useCreateStaff,
  useDeactivateStaff,
  useRecordAttendance,
  useStaffMembers,
  useUpdateStaff,
} from "../hooks/useStaff";
import type { StaffInput, StaffMember } from "../types";
import { AttendanceStatus, StaffRole } from "../types";

const ROLE_FILTER_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: StaffRole.admin, label: "Admin" },
  { value: StaffRole.doctor, label: "Doctor" },
  { value: StaffRole.receptionist, label: "Receptionist" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const ROLE_BADGE_VARIANT: Record<
  StaffRole,
  "admin" | "doctor" | "receptionist"
> = {
  [StaffRole.admin]: "admin",
  [StaffRole.doctor]: "doctor",
  [StaffRole.receptionist]: "receptionist",
};

export default function StaffPage() {
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<StaffMember | null>(null);
  const [attendanceMember, setAttendanceMember] = useState<StaffMember | null>(
    null,
  );

  const { data: staff, isLoading } = useStaffMembers();
  const { identity } = useInternetIdentity();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deactivateStaff = useDeactivateStaff();
  const recordAttendance = useRecordAttendance();

  if (isLoading) return <PageLoader />;

  const filtered = (staff ?? []).filter((s) => {
    if (roleFilter && s.role !== roleFilter) return false;
    if (statusFilter === "active" && !s.is_active) return false;
    if (statusFilter === "inactive" && s.is_active) return false;
    return true;
  });

  const handleCreate = async (input: Omit<StaffInput, "principal">) => {
    if (!identity) return;
    try {
      await createStaff.mutateAsync({
        ...input,
        principal: identity.getPrincipal(),
      });
      setShowAdd(false);
      toast.success(`${input.name} added to staff`);
    } catch {
      toast.error("Failed to add staff member");
    }
  };

  const handleUpdate = async (input: Omit<StaffInput, "principal">) => {
    if (!editMember) return;
    try {
      await updateStaff.mutateAsync({
        id: editMember.id,
        input: { ...input, principal: editMember.principal },
      });
      setEditMember(null);
      toast.success("Staff member updated");
    } catch {
      toast.error("Failed to update staff member");
    }
  };

  const handleDeactivate = async (s: StaffMember) => {
    if (!confirm(`Deactivate ${s.name}? They will lose system access.`)) return;
    try {
      await deactivateStaff.mutateAsync(s.id);
      toast.success(`${s.name} deactivated`);
    } catch {
      toast.error("Failed to deactivate staff member");
    }
  };

  const handleRecordAttendance = async (params: {
    date: string;
    checkIn: bigint | null;
    checkOut: bigint | null;
    status: AttendanceStatus;
  }) => {
    if (!attendanceMember) return;
    try {
      await recordAttendance.mutateAsync({
        staffId: attendanceMember.id,
        ...params,
      });
      setAttendanceMember(null);
      const statusLabel =
        params.status === AttendanceStatus.present
          ? "Present"
          : params.status === AttendanceStatus.absent
            ? "Absent"
            : "Half Day";
      toast.success(`Attendance recorded: ${statusLabel}`);
    } catch {
      toast.error("Failed to record attendance");
    }
  };

  const activeCount = (staff ?? []).filter((s) => s.is_active).length;
  const totalCount = (staff ?? []).length;

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (s: StaffMember, i: number) => (
        <div className="min-w-0" data-ocid={`staff.item.${i + 1}`}>
          <p className="font-semibold text-sm text-foreground truncate">
            {s.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{s.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (s: StaffMember) => (
        <Badge variant={ROLE_BADGE_VARIANT[s.role]}>
          {s.role.charAt(0).toUpperCase() + s.role.slice(1)}
        </Badge>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (s: StaffMember) => (
        <span className="text-sm text-foreground">{s.phone || "—"}</span>
      ),
    },
    {
      key: "qualification",
      header: "Qualification",
      render: (s: StaffMember) => (
        <span className="text-sm text-muted-foreground">
          {s.qualification || "—"}
        </span>
      ),
    },
    {
      key: "hire_date",
      header: "Hired",
      render: (s: StaffMember) => (
        <span className="text-xs text-muted-foreground">{s.hire_date}</span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (s: StaffMember) => (
        <StatusBadge status={s.is_active ? "active" : "cancelled"} />
      ),
    },
    {
      key: "actions",
      header: "",
      render: (s: StaffMember, i: number) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAttendanceMember(s)}
            data-ocid={`staff.attendance_button.${i + 1}`}
            title="Record attendance"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Record attendance"
          >
            <CalendarCheck2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditMember(s)}
            data-ocid={`staff.edit_button.${i + 1}`}
            title="Edit staff member"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Edit staff member"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          {s.is_active && (
            <button
              type="button"
              onClick={() => handleDeactivate(s)}
              data-ocid={`staff.deactivate_button.${i + 1}`}
              title="Deactivate"
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Deactivate staff member"
            >
              <UserX className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div data-ocid="staff.page">
      <PageHeader
        title="Staff Management"
        description="Manage clinic staff, roles, and attendance records"
        breadcrumbs={[{ label: "Clinic" }, { label: "Staff" }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAdd(true)}
            data-ocid="staff.add_button"
          >
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        }
      />

      {/* Summary stats */}
      {totalCount > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              label: "Total Staff",
              value: totalCount,
              color: "text-foreground",
            },
            {
              label: "Active",
              value: activeCount,
              color: "text-[oklch(0.65_0.17_155)]",
            },
            {
              label: "Inactive",
              value: totalCount - activeCount,
              color: "text-muted-foreground",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-lg px-4 py-3"
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-2xl font-display font-bold ${color}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="w-44" data-ocid="staff.role.select">
          <Select
            value={roleFilter}
            options={ROLE_FILTER_OPTIONS}
            onChange={setRoleFilter}
          />
        </div>
        <div className="w-40" data-ocid="staff.status.select">
          <Select
            value={statusFilter}
            options={STATUS_FILTER_OPTIONS}
            onChange={setStatusFilter}
          />
        </div>
        {(roleFilter || statusFilter) && (
          <button
            type="button"
            onClick={() => {
              setRoleFilter("");
              setStatusFilter("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} member{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<UserCheck className="h-7 w-7" />}
          title={
            roleFilter || statusFilter
              ? "No staff match your filters"
              : "No staff members yet"
          }
          description={
            roleFilter || statusFilter
              ? "Try adjusting your filters."
              : "Add your first staff member to get started."
          }
          data-ocid="staff.empty_state"
        />
      ) : (
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s.id.toString()}
          stickyHeader
          emptyMessage="No staff found"
        />
      )}

      {/* Add modal */}
      <StaffFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleCreate}
        isPending={createStaff.isPending}
      />

      {/* Edit modal */}
      <StaffFormModal
        open={!!editMember}
        onClose={() => setEditMember(null)}
        onSubmit={handleUpdate}
        isPending={updateStaff.isPending}
        editMember={editMember}
      />

      {/* Attendance modal */}
      <AttendanceModal
        open={!!attendanceMember}
        onClose={() => setAttendanceMember(null)}
        staff={attendanceMember}
        onSubmit={handleRecordAttendance}
        isPending={recordAttendance.isPending}
      />
    </div>
  );
}
