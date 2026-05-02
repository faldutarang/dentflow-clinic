import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import ST "../types/staff";
import Common "../types/common";
import StaffLib "../lib/staff";

mixin (
  accessControlState : AccessControl.AccessControlState,
  staffMembers       : StaffLib.StaffState,
  attendance         : StaffLib.AttendanceState,
  clinic_id          : Common.ClinicId,
  idCounter          : Common.Counter,
) {
  // ─── Admin-only guard ─────────────────────────────────────────────────────────
  func requireAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin role required");
    };
  };

  func requireUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
  };

  // ─── Staff management (admin-only) ───────────────────────────────────────────
  public shared ({ caller }) func createStaffMember(input : ST.StaffInput) : async ST.StaffMember {
    requireAdmin(caller);
    let id = idCounter.value;
    idCounter.value += 1;
    StaffLib.createStaff(staffMembers, clinic_id, input, id)
  };

  public query ({ caller }) func getStaffMember(id : Common.EntityId) : async ?ST.StaffMember {
    requireUser(caller);
    StaffLib.getStaff(staffMembers, id, clinic_id)
  };

  public query ({ caller }) func listStaffMembers() : async [ST.StaffMember] {
    requireUser(caller);
    StaffLib.listStaff(staffMembers, clinic_id)
  };

  public shared ({ caller }) func updateStaffMember(id : Common.EntityId, input : ST.StaffInput) : async ?ST.StaffMember {
    requireAdmin(caller);
    StaffLib.updateStaff(staffMembers, id, clinic_id, input)
  };

  public shared ({ caller }) func deactivateStaffMember(id : Common.EntityId) : async Bool {
    requireAdmin(caller);
    StaffLib.deactivateStaff(staffMembers, id, clinic_id)
  };

  public query ({ caller }) func getStaffByPrincipal(p : Principal) : async ?ST.StaffMember {
    requireUser(caller);
    StaffLib.getStaffByPrincipal(staffMembers, p, clinic_id)
  };

  // ─── Attendance ──────────────────────────────────────────────────────────────
  public shared ({ caller }) func recordAttendance(
    staff_id  : Common.EntityId,
    date      : Text,
    check_in  : ?Common.Timestamp,
    check_out : ?Common.Timestamp,
    status    : Common.AttendanceStatus,
  ) : async Common.Attendance {
    requireUser(caller);
    let id = idCounter.value;
    idCounter.value += 1;
    StaffLib.recordAttendance(attendance, clinic_id, staff_id, date, check_in, check_out, status, id)
  };

  public query ({ caller }) func getAttendanceByDate(staff_id : Common.EntityId, date : Text) : async ?Common.Attendance {
    requireUser(caller);
    StaffLib.getAttendance(attendance, staff_id, clinic_id, date)
  };

  public query ({ caller }) func listAttendance(
    staff_id  : ?Common.EntityId,
    from_date : ?Text,
    to_date   : ?Text,
  ) : async [Common.Attendance] {
    requireUser(caller);
    StaffLib.listAttendance(attendance, clinic_id, staff_id, from_date, to_date)
  };
};
