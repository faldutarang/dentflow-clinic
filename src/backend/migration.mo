// Migration from the old Hostel Gate Pass system to the Dental Clinic SaaS.
// The old `gatePasses` Map is intentionally discarded (different domain).
// nextId is forwarded into the new idCounter.
import Map "mo:core/Map";

module {
  // ── Old types (copied inline from .old/src/backend) ─────────────────────────
  type OldGatePassStatus = { #approved; #pending; #rejected };
  type OldTime = Int;
  type OldGatePass = {
    adminRemarks      : ?Text;
    contactNumber     : Text;
    departureDateTime : Text;
    destination       : Text;
    hasUnreadNotification : Bool;
    id                : Nat;
    reason            : Text;
    returnDateTime    : Text;
    roomNumber        : Text;
    status            : OldGatePassStatus;
    studentName       : Text;
    studentPrincipal  : Principal;
    submittedAt       : OldTime;
    updatedAt         : OldTime;
  };
  type OldUserRole = { #admin; #guest; #user };
  type OldAccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, OldUserRole>;
  };

  type OldActor = {
    accessControlState : OldAccessControlState;
    gatePasses         : Map.Map<Nat, OldGatePass>; // consumed and discarded
    var nextId         : Nat;
  };

  type NewActor = {
    accessControlState : OldAccessControlState;
    idCounter          : { var value : Nat };
  };

  public func run(old : OldActor) : NewActor {
    // gatePasses is intentionally not forwarded — it belongs to the old domain.
    {
      accessControlState = old.accessControlState;
      idCounter          = { var value = old.nextId };
    };
  };
};
