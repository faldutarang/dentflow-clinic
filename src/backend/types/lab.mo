import Common "common";

module {
  public type PatientId   = Common.EntityId;
  public type TreatmentId = Common.EntityId;
  public type LabOrderId  = Common.EntityId;
  public type ClinicId    = Common.ClinicId;
  public type Timestamp   = Common.Timestamp;

  // ─── Lab order status ─────────────────────────────────────────────────────────
  public type LabOrderStatus = { #pending; #inProgress; #completed; #cancelled };

  // ─── Lab order ────────────────────────────────────────────────────────────────
  public type LabOrder = {
    id             : LabOrderId;
    clinic_id      : ClinicId;
    patient_id     : PatientId;
    treatment_id   : ?TreatmentId;
    lab_name       : Text;
    procedure_type : Text;
    specifications : Text;
    cost           : Float;
    status         : LabOrderStatus;
    due_date       : Text;           // "YYYY-MM-DD"
    completed_date : ?Text;
    notes          : Text;
    created_at     : Timestamp;
  };

  public type LabOrderInput = {
    patient_id     : PatientId;
    treatment_id   : ?TreatmentId;
    lab_name       : Text;
    procedure_type : Text;
    specifications : Text;
    cost           : Float;
    due_date       : Text;
    notes          : Text;
  };
};
