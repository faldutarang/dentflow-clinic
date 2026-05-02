import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import ST "../types/staff";
import Common "../types/common";

module {
  public type StaffState      = Map.Map<Common.EntityId, ST.StaffMember>;
  public type AttendanceState = Map.Map<Common.EntityId, Common.Attendance>;

  // ─── Staff CRUD ──────────────────────────────────────────────────────────────
  public func createStaff(
    state     : StaffState,
    clinic_id : Common.ClinicId,
    input     : ST.StaffInput,
    next_id   : Nat,
  ) : ST.StaffMember {
    let member : ST.StaffMember = {
      id             = next_id;
      clinic_id;
      principal      = input.principal;
      name           = input.name;
      role           = input.role;
      email          = input.email;
      phone          = input.phone;
      hire_date      = input.hire_date;
      is_active      = true;
      qualification  = input.qualification;
      license_number = input.license_number;
    };
    state.add(next_id, member);
    member
  };

  public func getStaff(
    state     : StaffState,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : ?ST.StaffMember {
    switch (state.get(id)) {
      case (?m) { if (m.clinic_id == clinic_id) ?m else null };
      case null { null };
    }
  };

  public func getStaffByPrincipal(
    state     : StaffState,
    principal : Principal,
    clinic_id : Common.ClinicId,
  ) : ?ST.StaffMember {
    state.values().find(func(m : ST.StaffMember) : Bool {
      m.clinic_id == clinic_id and Principal.equal(m.principal, principal)
    })
  };

  public func listStaff(
    state     : StaffState,
    clinic_id : Common.ClinicId,
  ) : [ST.StaffMember] {
    state.values().filter(func(m : ST.StaffMember) : Bool {
      m.clinic_id == clinic_id
    }).toArray()
  };

  public func updateStaff(
    state     : StaffState,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
    input     : ST.StaffInput,
  ) : ?ST.StaffMember {
    switch (state.get(id)) {
      case (?m) {
        if (m.clinic_id != clinic_id) return null;
        let updated : ST.StaffMember = {
          m with
          principal      = input.principal;
          name           = input.name;
          role           = input.role;
          email          = input.email;
          phone          = input.phone;
          hire_date      = input.hire_date;
          qualification  = input.qualification;
          license_number = input.license_number;
        };
        state.add(id, updated);
        ?updated
      };
      case null { null };
    }
  };

  public func deactivateStaff(
    state     : StaffState,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : Bool {
    switch (state.get(id)) {
      case (?m) {
        if (m.clinic_id != clinic_id) return false;
        state.add(id, { m with is_active = false });
        true
      };
      case null { false };
    }
  };

  // ─── Attendance ──────────────────────────────────────────────────────────────
  public func recordAttendance(
    state          : AttendanceState,
    clinic_id      : Common.ClinicId,
    staff_id       : Common.EntityId,
    date           : Text,
    check_in_time  : ?Common.Timestamp,
    check_out_time : ?Common.Timestamp,
    status         : Common.AttendanceStatus,
    next_id        : Nat,
  ) : Common.Attendance {
    let record : Common.Attendance = {
      id        = next_id;
      clinic_id;
      staff_id;
      date;
      check_in  = check_in_time;
      check_out = check_out_time;
      status;
    };
    state.add(next_id, record);
    record
  };

  public func getAttendance(
    state     : AttendanceState,
    staff_id  : Common.EntityId,
    clinic_id : Common.ClinicId,
    date      : Text,
  ) : ?Common.Attendance {
    state.values().find(func(a : Common.Attendance) : Bool {
      a.clinic_id == clinic_id and a.staff_id == staff_id and a.date == date
    })
  };

  public func listAttendance(
    state     : AttendanceState,
    clinic_id : Common.ClinicId,
    staff_id  : ?Common.EntityId,
    from_date : ?Text,
    to_date   : ?Text,
  ) : [Common.Attendance] {
    state.values().filter(func(a : Common.Attendance) : Bool {
      if (a.clinic_id != clinic_id) return false;
      let staffMatch = switch (staff_id) {
        case (?sid) a.staff_id == sid;
        case null   true;
      };
      let fromMatch  = switch (from_date) {
        case (?fd) a.date >= fd;
        case null  true;
      };
      let toMatch    = switch (to_date) {
        case (?td) a.date <= td;
        case null  true;
      };
      staffMatch and fromMatch and toMatch
    }).toArray()
  };
};
