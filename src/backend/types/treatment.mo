import Common "common";
import Patient "patient";

module {
  public type PatientId   = Common.EntityId;
  public type DentistId   = Common.EntityId;
  public type TreatmentId = Common.EntityId;
  public type ClinicId    = Common.ClinicId;
  public type Timestamp   = Common.Timestamp;

  // ─── Individual tooth procedure ──────────────────────────────────────────────
  public type ProcedureStatus = { #planned; #inProgress; #completed; #cancelled };

  public type ToothProcedure = {
    tooth_number   : Nat;         // 1-32 (FDI/universal notation)
    procedure_type : Text;
    status         : ProcedureStatus;
    notes          : Text;
    dentist_id     : DentistId;
    completed_at   : ?Timestamp;
  };

  // ─── Treatment plan ──────────────────────────────────────────────────────────
  public type TreatmentStatus = { #active; #completed; #cancelled };

  public type Treatment = {
    id             : TreatmentId;
    clinic_id      : ClinicId;
    patient_id     : PatientId;
    title          : Text;
    procedures     : [ToothProcedure];
    status         : TreatmentStatus;
    estimated_cost : Float;
    dentist_id     : DentistId;
    notes          : Text;
    created_at     : Timestamp;
    updated_at     : Timestamp;
  };

  public type TreatmentInput = {
    patient_id     : PatientId;
    title          : Text;
    procedures     : [ToothProcedure];
    estimated_cost : Float;
    dentist_id     : DentistId;
    notes          : Text;
  };

  // ─── Dental chart tooth entry ─────────────────────────────────────────────────
  public type ToothStatus = { #healthy; #decayed; #missing; #filled; #crowned; #implant; #extracted; #other };

  public type ToothEntry = {
    tooth_number   : Nat;
    status         : ToothStatus;
    procedure_type : ?Text;
    last_updated   : Timestamp;
    dentist_id     : DentistId;
  };

  // ─── Dental chart ─────────────────────────────────────────────────────────────
  public type ToothChart = {
    id           : Common.EntityId;
    clinic_id    : ClinicId;
    patient_id   : PatientId;
    treatment_id : ?TreatmentId;
    teeth        : [ToothEntry];
    created_at   : Timestamp;
  };
};
