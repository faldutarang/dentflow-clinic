import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  // ─── Shared primitive aliases ───────────────────────────────────────────────
  public type Timestamp = Time.Time;
  public type ClinicId  = Nat;
  public type EntityId  = Nat;

  // ─── Mutable counter (ref cell for entity IDs) ───────────────────────────────
  public type Counter = { var value : Nat };

  // ─── Staff / auth roles ──────────────────────────────────────────────────────
  public type StaffRole = { #admin; #doctor; #receptionist };

  // ─── Gender ──────────────────────────────────────────────────────────────────
  public type Gender = { #male; #female; #other };

  // ─── Blood group ─────────────────────────────────────────────────────────────
  public type BloodGroup = { #aPos; #aNeg; #bPos; #bNeg; #abPos; #abNeg; #oPos; #oNeg; #unknown };

  // ─── Document reference (X-ray, report, receipt, etc.) ───────────────────────
  public type Document = {
    id          : EntityId;
    clinic_id   : ClinicId;
    owner_id    : EntityId;   // patient_id or any entity id
    owner_type  : Text;       // "patient" | "prescription" | ...
    filename    : Text;
    mime_type   : Text;
    blob        : Storage.ExternalBlob;
    uploaded_at : Timestamp;
    uploaded_by : Principal;
  };

  // ─── Clinic settings ─────────────────────────────────────────────────────────
  public type WorkingHours = {
    open_time  : Text;        // "HH:MM"
    close_time : Text;        // "HH:MM"
    days_open  : [Text];      // ["Mon","Tue",...]
  };

  public type ClinicSettings = {
    clinic_id    : ClinicId;
    name         : Text;
    address      : Text;
    gst_number   : Text;
    phone        : Text;
    email        : Text;
    working_hours : WorkingHours;
  };

  // ─── Attendance ──────────────────────────────────────────────────────────────
  public type AttendanceStatus = { #present; #absent; #halfDay };

  public type Attendance = {
    id         : EntityId;
    clinic_id  : ClinicId;
    staff_id   : EntityId;
    date       : Text;        // "YYYY-MM-DD"
    check_in   : ?Timestamp;
    check_out  : ?Timestamp;
    status     : AttendanceStatus;
  };
};
