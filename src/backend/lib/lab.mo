import Map "mo:core/Map";
import Time "mo:core/Time";
import LT "../types/lab";
import Common "../types/common";

module {
  public type State = Map.Map<Common.EntityId, LT.LabOrder>;

  public func createOrder(
    state     : State,
    clinic_id : Common.ClinicId,
    input     : LT.LabOrderInput,
    next_id   : Nat,
  ) : LT.LabOrder {
    let order : LT.LabOrder = {
      id             = next_id;
      clinic_id      = clinic_id;
      patient_id     = input.patient_id;
      treatment_id   = input.treatment_id;
      lab_name       = input.lab_name;
      procedure_type = input.procedure_type;
      specifications = input.specifications;
      cost           = input.cost;
      status         = #pending;
      due_date       = input.due_date;
      completed_date = null;
      notes          = input.notes;
      created_at     = Time.now();
    };
    state.add(next_id, order);
    order;
  };

  public func getOrder(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : ?LT.LabOrder {
    switch (state.get(id)) {
      case (?o) { if (o.clinic_id == clinic_id) ?o else null };
      case null { null };
    };
  };

  public func listOrders(
    state      : State,
    clinic_id  : Common.ClinicId,
    patient_id : ?Common.EntityId,
  ) : [LT.LabOrder] {
    state.values().filter(func(o) {
      if (o.clinic_id != clinic_id) return false;
      switch (patient_id) {
        case (?pid) { o.patient_id == pid };
        case null   { true };
      };
    }).toArray();
  };

  public func updateOrderStatus(
    state          : State,
    id             : Common.EntityId,
    clinic_id      : Common.ClinicId,
    status         : LT.LabOrderStatus,
    completed_date : ?Text,
  ) : ?LT.LabOrder {
    switch (state.get(id)) {
      case (?o) {
        if (o.clinic_id != clinic_id) return null;
        let updated : LT.LabOrder = { o with status; completed_date };
        state.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteOrder(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : Bool {
    switch (state.get(id)) {
      case (?o) {
        if (o.clinic_id != clinic_id) return false;
        state.remove(id);
        true;
      };
      case null { false };
    };
  };
};
