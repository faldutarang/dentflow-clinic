import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import PT "../types/patient";
import Common "../types/common";
import PatientLib "../lib/patient";

mixin (
  accessControlState : AccessControl.AccessControlState,
  patients           : PatientLib.State,
  clinic_id          : Common.ClinicId,
  idCounter          : Common.Counter,
) {
  // ─── Create ───────────────────────────────────────────────────────────────────
  // Admins and receptionists may create patients.
  public shared ({ caller }) func createPatient(input : PT.PatientInput) : async PT.Patient {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to create a patient");
    };
    let patient = PatientLib.create(patients, clinic_id, input, idCounter.value);
    idCounter.value += 1;
    patient;
  };

  // ─── Read ─────────────────────────────────────────────────────────────────────
  public query ({ caller }) func getPatient(id : Common.EntityId) : async ?PT.Patient {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to view a patient");
    };
    PatientLib.get(patients, id, clinic_id);
  };

  public query ({ caller }) func listPatients() : async [PT.Patient] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to list patients");
    };
    PatientLib.list(patients, clinic_id);
  };

  // ─── Update ───────────────────────────────────────────────────────────────────
  public shared ({ caller }) func updatePatient(id : Common.EntityId, input : PT.PatientInput) : async ?PT.Patient {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to update a patient");
    };
    PatientLib.update(patients, id, clinic_id, input);
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────
  // Only admins may delete patient records.
  public shared ({ caller }) func deletePatient(id : Common.EntityId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can delete patients");
    };
    PatientLib.delete(patients, id, clinic_id);
  };

  // ─── Search ───────────────────────────────────────────────────────────────────
  public query ({ caller }) func searchPatients(q : Text) : async [PT.Patient] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to search patients");
    };
    PatientLib.search(patients, clinic_id, q);
  };
};
