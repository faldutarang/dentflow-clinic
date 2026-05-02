import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import TT "../types/treatment";
import Common "../types/common";

module {
  public type TreatmentState = Map.Map<Common.EntityId, TT.Treatment>;
  public type ChartState     = Map.Map<Common.EntityId, TT.ToothChart>;

  // ─── Treatment CRUD ──────────────────────────────────────────────────────────
  public func createTreatment(
    state     : TreatmentState,
    clinic_id : Common.ClinicId,
    input     : TT.TreatmentInput,
    next_id   : Nat,
  ) : TT.Treatment {
    let now = Time.now();
    let treatment : TT.Treatment = {
      id             = next_id;
      clinic_id      = clinic_id;
      patient_id     = input.patient_id;
      title          = input.title;
      procedures     = input.procedures;
      status         = #active;
      estimated_cost = input.estimated_cost;
      dentist_id     = input.dentist_id;
      notes          = input.notes;
      created_at     = now;
      updated_at     = now;
    };
    state.add(next_id, treatment);
    treatment;
  };

  public func getTreatment(
    state     : TreatmentState,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : ?TT.Treatment {
    switch (state.get(id)) {
      case (?t) { if (t.clinic_id == clinic_id) ?t else null };
      case null { null };
    };
  };

  public func listTreatments(
    state      : TreatmentState,
    clinic_id  : Common.ClinicId,
    patient_id : ?Common.EntityId,
  ) : [TT.Treatment] {
    let result = List.empty<TT.Treatment>();
    for ((_, t) in state.entries()) {
      if (t.clinic_id == clinic_id) {
        let matchesPatient = switch (patient_id) {
          case (?pid) { t.patient_id == pid };
          case null   { true };
        };
        if (matchesPatient) {
          result.add(t);
        };
      };
    };
    result.toArray();
  };

  public func updateTreatment(
    state     : TreatmentState,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
    input     : TT.TreatmentInput,
  ) : ?TT.Treatment {
    switch (state.get(id)) {
      case (?existing) {
        if (existing.clinic_id != clinic_id) return null;
        let updated : TT.Treatment = {
          existing with
          patient_id     = input.patient_id;
          title          = input.title;
          procedures     = input.procedures;
          estimated_cost = input.estimated_cost;
          dentist_id     = input.dentist_id;
          notes          = input.notes;
          updated_at     = Time.now();
        };
        state.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteTreatment(
    state     : TreatmentState,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : Bool {
    switch (state.get(id)) {
      case (?t) {
        if (t.clinic_id != clinic_id) return false;
        state.remove(id);
        true;
      };
      case null { false };
    };
  };

  // ─── Tooth chart upsert / get ────────────────────────────────────────────────
  // One chart per patient per clinic — use patient_id as the map key.
  public func upsertChart(
    state        : ChartState,
    clinic_id    : Common.ClinicId,
    patient_id   : Common.EntityId,
    treatment_id : ?Common.EntityId,
    teeth        : [TT.ToothEntry],
    next_id      : Nat,
  ) : TT.ToothChart {
    let now = Time.now();
    // Derive a stable key from clinic + patient so we update in place.
    let key = clinic_id * 1_000_000 + patient_id;
    let chart : TT.ToothChart = switch (state.get(key)) {
      case (?existing) {
        { existing with
          treatment_id = treatment_id;
          teeth        = teeth;
        };
      };
      case null {
        {
          id           = next_id;
          clinic_id    = clinic_id;
          patient_id   = patient_id;
          treatment_id = treatment_id;
          teeth        = teeth;
          created_at   = now;
        };
      };
    };
    state.add(key, chart);
    chart;
  };

  public func getChart(
    state      : ChartState,
    patient_id : Common.EntityId,
    clinic_id  : Common.ClinicId,
  ) : ?TT.ToothChart {
    let key = clinic_id * 1_000_000 + patient_id;
    switch (state.get(key)) {
      case (?c) { if (c.clinic_id == clinic_id) ?c else null };
      case null { null };
    };
  };
};
