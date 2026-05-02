import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import RX "../types/prescription";
import Common "../types/common";
import PrescriptionLib "../lib/prescription";

mixin (
  accessControlState : AccessControl.AccessControlState,
  prescriptions      : PrescriptionLib.State,
  clinic_id          : Common.ClinicId,
  idCounter          : Common.Counter,
) {
  public shared ({ caller }) func createPrescription(input : RX.PrescriptionInput) : async RX.Prescription {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required to create prescriptions");
    };
    // Doctor or admin can create prescriptions
    let rx = PrescriptionLib.createPrescription(prescriptions, clinic_id, input, idCounter.value);
    idCounter.value += 1;
    rx;
  };

  public query ({ caller }) func getPrescription(id : Common.EntityId) : async ?RX.Prescription {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    PrescriptionLib.getPrescription(prescriptions, id, clinic_id);
  };

  public query ({ caller }) func listPrescriptions(patient_id : ?Common.EntityId) : async [RX.Prescription] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    PrescriptionLib.listPrescriptions(prescriptions, clinic_id, patient_id);
  };

  public shared ({ caller }) func deactivatePrescription(id : Common.EntityId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    PrescriptionLib.deactivatePrescription(prescriptions, id, clinic_id);
  };

  public shared ({ caller }) func deletePrescription(id : Common.EntityId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    PrescriptionLib.deactivatePrescription(prescriptions, id, clinic_id);
  };
};
