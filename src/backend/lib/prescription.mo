import Map "mo:core/Map";
import Time "mo:core/Time";
import RX "../types/prescription";
import Common "../types/common";

module {
  public type State = Map.Map<Common.EntityId, RX.Prescription>;

  public func createPrescription(
    state     : State,
    clinic_id : Common.ClinicId,
    input     : RX.PrescriptionInput,
    next_id   : Nat,
  ) : RX.Prescription {
    let rx : RX.Prescription = {
      id           = next_id;
      clinic_id    = clinic_id;
      patient_id   = input.patient_id;
      treatment_id = input.treatment_id;
      medications  = input.medications;
      dentist_id   = input.dentist_id;
      is_active    = true;
      created_at   = Time.now();
    };
    state.add(next_id, rx);
    rx;
  };

  public func getPrescription(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : ?RX.Prescription {
    switch (state.get(id)) {
      case (?rx) { if (rx.clinic_id == clinic_id) ?rx else null };
      case null  { null };
    };
  };

  public func listPrescriptions(
    state      : State,
    clinic_id  : Common.ClinicId,
    patient_id : ?Common.EntityId,
  ) : [RX.Prescription] {
    state.values().filter(func(rx) {
      if (rx.clinic_id != clinic_id) return false;
      switch (patient_id) {
        case (?pid) { rx.patient_id == pid };
        case null   { true };
      };
    }).toArray();
  };

  public func deactivatePrescription(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : Bool {
    switch (state.get(id)) {
      case (?rx) {
        if (rx.clinic_id != clinic_id) return false;
        state.add(id, { rx with is_active = false });
        true;
      };
      case null { false };
    };
  };
};
