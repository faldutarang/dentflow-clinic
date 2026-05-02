import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AttendanceStatus } from "../../types";
import type { StaffMember } from "../../types";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";

interface AttendanceModalProps {
  open: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onSubmit: (params: {
    date: string;
    checkIn: bigint | null;
    checkOut: bigint | null;
    status: AttendanceStatus;
  }) => Promise<void>;
  isPending: boolean;
}

const STATUS_OPTIONS = [
  {
    value: AttendanceStatus.present,
    label: "Present",
    Icon: CheckCircle2,
    bg: "bg-[oklch(0.65_0.17_155/0.12)]",
    border: "border-[oklch(0.65_0.17_155/0.5)]",
    text: "text-[oklch(0.65_0.17_155)]",
  },
  {
    value: AttendanceStatus.absent,
    label: "Absent",
    Icon: XCircle,
    bg: "bg-destructive/10",
    border: "border-destructive/50",
    text: "text-destructive",
  },
  {
    value: AttendanceStatus.halfDay,
    label: "Half Day",
    Icon: Clock,
    bg: "bg-[oklch(0.74_0.16_78/0.12)]",
    border: "border-[oklch(0.74_0.16_78/0.5)]",
    text: "text-[oklch(0.74_0.16_78)]",
  },
];

function timeStringToTimestamp(
  dateStr: string,
  timeStr: string,
): bigint | null {
  if (!timeStr) return null;
  const [hoursStr, minutesStr] = timeStr.split(":");
  const dt = new Date(dateStr);
  dt.setHours(Number(hoursStr), Number(minutesStr), 0, 0);
  return BigInt(dt.getTime()) * 1_000_000n;
}

export function AttendanceModal({
  open,
  onClose,
  staff,
  onSubmit,
  isPending,
}: AttendanceModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [checkIn, setCheckIn] = useState("09:00");
  const [checkOut, setCheckOut] = useState("18:00");
  const [status, setStatus] = useState<AttendanceStatus>(
    AttendanceStatus.present,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(today);
    setCheckIn("09:00");
    setCheckOut("18:00");
    setStatus(AttendanceStatus.present);
    setError("");
  }, [open, today]);

  if (!staff) return null;

  const isAbsent = status === AttendanceStatus.absent;

  const handleSubmit = async () => {
    if (!date) {
      setError("Date is required");
      return;
    }
    if (!isAbsent && checkIn && checkOut) {
      const inMs = new Date(`${date}T${checkIn}`).getTime();
      const outMs = new Date(`${date}T${checkOut}`).getTime();
      if (outMs <= inMs) {
        setError("Check-out time must be after check-in time");
        return;
      }
    }
    setError("");
    await onSubmit({
      date,
      checkIn: isAbsent ? null : timeStringToTimestamp(date, checkIn),
      checkOut: isAbsent ? null : timeStringToTimestamp(date, checkOut),
      status,
    });
  };

  const roleColorClass =
    staff.role === "admin"
      ? "text-[oklch(0.74_0.16_78)]"
      : staff.role === "doctor"
        ? "text-[oklch(0.62_0.18_200)]"
        : "text-[oklch(0.65_0.17_155)]";

  const durationLabel = (() => {
    if (isAbsent || !checkIn || !checkOut) return null;
    const mins =
      (new Date(`${date}T${checkOut}`).getTime() -
        new Date(`${date}T${checkIn}`).getTime()) /
      60000;
    if (mins <= 0) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h${m > 0 ? ` ${m}m` : ""}`;
  })();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Attendance"
      description="Log attendance for a staff member"
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="attendance.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isPending}
            data-ocid="attendance.submit_button"
          >
            Record Attendance
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Staff info */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 px-4 py-3">
          <div className="h-9 w-9 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
            <span className={`text-sm font-bold ${roleColorClass}`}>
              {staff.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {staff.name}
            </p>
            <p className={`text-xs capitalize font-medium ${roleColorClass}`}>
              {staff.role}
            </p>
          </div>
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setError("");
          }}
          data-ocid="attendance.date.input"
        />

        {/* Status toggle */}
        <fieldset>
          <legend className="text-sm font-medium text-foreground mb-2 block">
            Attendance Status
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {STATUS_OPTIONS.map(({ value, label, Icon, bg, border, text }) => {
              const isSelected = status === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setStatus(value);
                    setError("");
                  }}
                  data-ocid={`attendance.status.${value}.toggle`}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-semibold transition-all ${
                    isSelected
                      ? `${bg} ${border} ${text}`
                      : "border-border text-muted-foreground hover:bg-muted/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Time fields */}
        {!isAbsent && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Check-in Time"
              type="time"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setError("");
              }}
              data-ocid="attendance.check_in.input"
            />
            <Input
              label="Check-out Time"
              type="time"
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setError("");
              }}
              data-ocid="attendance.check_out.input"
            />
          </div>
        )}

        {/* Duration preview */}
        {durationLabel && (
          <div className="flex items-center justify-between rounded-lg bg-muted/10 border border-border px-4 py-2.5">
            <span className="text-xs text-muted-foreground">Duration</span>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {durationLabel}
            </span>
          </div>
        )}

        {error && (
          <p
            className="text-xs text-destructive"
            data-ocid="attendance.error_state"
          >
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
