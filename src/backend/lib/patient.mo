import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import PT "../types/patient";
import Common "../types/common";

module {
  public type State = Map.Map<Common.EntityId, PT.Patient>;

  public func empty() : State { Map.empty() };

  public func create(
    state     : State,
    clinic_id : Common.ClinicId,
    input     : PT.PatientInput,
    next_id   : Nat,
  ) : PT.Patient {
    let now = Time.now();
    let patient : PT.Patient = {
      id              = next_id;
      clinic_id       = clinic_id;
      first_name      = input.first_name;
      last_name       = input.last_name;
      email           = input.email;
      phone           = input.phone;
      date_of_birth   = input.date_of_birth;
      gender          = input.gender;
      address         = input.address;
      medical_history = input.medical_history;
      allergies       = input.allergies;
      blood_group     = input.blood_group;
      created_at      = now;
      updated_at      = now;
    };
    state.add(next_id, patient);
    patient;
  };

  public func get(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : ?PT.Patient {
    switch (state.get(id)) {
      case (?p) { if (p.clinic_id == clinic_id) ?p else null };
      case null { null };
    };
  };

  public func list(
    state     : State,
    clinic_id : Common.ClinicId,
  ) : [PT.Patient] {
    let result = List.empty<PT.Patient>();
    for ((_, p) in state.entries()) {
      if (p.clinic_id == clinic_id) {
        result.add(p);
      };
    };
    result.toArray();
  };

  public func update(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
    input     : PT.PatientInput,
  ) : ?PT.Patient {
    switch (state.get(id)) {
      case (?existing) {
        if (existing.clinic_id != clinic_id) return null;
        let updated : PT.Patient = {
          existing with
          first_name      = input.first_name;
          last_name       = input.last_name;
          email           = input.email;
          phone           = input.phone;
          date_of_birth   = input.date_of_birth;
          gender          = input.gender;
          address         = input.address;
          medical_history = input.medical_history;
          allergies       = input.allergies;
          blood_group     = input.blood_group;
          updated_at      = Time.now();
        };
        state.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func delete(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : Bool {
    switch (state.get(id)) {
      case (?p) {
        if (p.clinic_id != clinic_id) return false;
        state.remove(id);
        true;
      };
      case null { false };
    };
  };

  public func search(
    state      : State,
    clinic_id  : Common.ClinicId,
    searchText : Text,
  ) : [PT.Patient] {
    let lower = searchText.toLower();
    let result = List.empty<PT.Patient>();
    for ((_, p) in state.entries()) {
      if (p.clinic_id == clinic_id) {
        let fullName = (p.first_name # " " # p.last_name).toLower();
        let emailLower = p.email.toLower();
        if (
          fullName.contains(#text lower) or
          emailLower.contains(#text lower) or
          p.phone.contains(#text lower)
        ) {
          result.add(p);
        };
      };
    };
    result.toArray();
  };
};
