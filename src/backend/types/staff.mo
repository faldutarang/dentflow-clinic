import Common "common";
import Principal "mo:core/Principal";

module {
  public type ClinicId  = Common.ClinicId;
  public type StaffId   = Common.EntityId;
  public type Timestamp = Common.Timestamp;

  // ─── Staff member ────────────────────────────────────────────────────────────
  public type StaffMember = {
    id             : StaffId;
    clinic_id      : ClinicId;
    principal      : Principal;
    name           : Text;
    role           : Common.StaffRole;
    email          : Text;
    phone          : Text;
    hire_date      : Text;         // "YYYY-MM-DD"
    is_active      : Bool;
    qualification  : Text;
    license_number : Text;
  };

  public type StaffInput = {
    principal      : Principal;
    name           : Text;
    role           : Common.StaffRole;
    email          : Text;
    phone          : Text;
    hire_date      : Text;
    qualification  : Text;
    license_number : Text;
  };
};
