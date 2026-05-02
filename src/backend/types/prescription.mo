import Common "common";

module {
  public type PatientId      = Common.EntityId;
  public type DentistId      = Common.EntityId;
  public type TreatmentId    = Common.EntityId;
  public type PrescriptionId = Common.EntityId;
  public type ClinicId       = Common.ClinicId;
  public type Timestamp      = Common.Timestamp;

  // ─── Single medication entry ──────────────────────────────────────────────────
  public type Medication = {
    name      : Text;
    dosage    : Text;
    frequency : Text;
    duration  : Text;
    notes     : Text;
  };

  // ─── Prescription ─────────────────────────────────────────────────────────────
  public type Prescription = {
    id           : PrescriptionId;
    clinic_id    : ClinicId;
    patient_id   : PatientId;
    treatment_id : ?TreatmentId;
    medications  : [Medication];
    dentist_id   : DentistId;
    is_active    : Bool;
    created_at   : Timestamp;
  };

  public type PrescriptionInput = {
    patient_id   : PatientId;
    treatment_id : ?TreatmentId;
    medications  : [Medication];
    dentist_id   : DentistId;
  };
};
