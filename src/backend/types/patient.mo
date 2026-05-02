import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type PatientId  = Common.EntityId;
  public type ClinicId   = Common.ClinicId;
  public type Timestamp  = Common.Timestamp;

  // ─── Patient ─────────────────────────────────────────────────────────────────
  public type Patient = {
    id              : PatientId;
    clinic_id       : ClinicId;
    first_name      : Text;
    last_name       : Text;
    email           : Text;
    phone           : Text;
    date_of_birth   : Text;         // "YYYY-MM-DD"
    gender          : Common.Gender;
    address         : Text;
    medical_history : Text;
    allergies       : [Text];
    blood_group     : Common.BloodGroup;
    created_at      : Timestamp;
    updated_at      : Timestamp;
  };

  // ─── Input type (no server-generated fields) ─────────────────────────────────
  public type PatientInput = {
    first_name      : Text;
    last_name       : Text;
    email           : Text;
    phone           : Text;
    date_of_birth   : Text;
    gender          : Common.Gender;
    address         : Text;
    medical_history : Text;
    allergies       : [Text];
    blood_group     : Common.BloodGroup;
  };
};
