import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import TT "../types/treatment";
import Common "../types/common";
import TreatmentLib "../lib/treatment";

mixin (
  accessControlState : AccessControl.AccessControlState,
  treatments         : TreatmentLib.TreatmentState,
  charts             : TreatmentLib.ChartState,
  clinic_id          : Common.ClinicId,
  idCounter          : Common.Counter,
) {
  // ─── Create treatment (doctor or admin only) ──────────────────────────────────
  public shared ({ caller }) func createTreatment(input : TT.TreatmentInput) : async TT.Treatment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to create a treatment");
    };
    let treatment = TreatmentLib.createTreatment(treatments, clinic_id, input, idCounter.value);
    idCounter.value += 1;
    treatment;
  };

  // ─── Read treatment ───────────────────────────────────────────────────────────
  public query ({ caller }) func getTreatment(id : Common.EntityId) : async ?TT.Treatment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to view a treatment");
    };
    TreatmentLib.getTreatment(treatments, id, clinic_id);
  };

  // ─── List treatments (optionally by patient) ─────────────────────────────────
  public query ({ caller }) func listTreatments(patient_id : ?Common.EntityId) : async [TT.Treatment] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to list treatments");
    };
    TreatmentLib.listTreatments(treatments, clinic_id, patient_id);
  };

  // ─── Update treatment (doctor or admin only) ──────────────────────────────────
  public shared ({ caller }) func updateTreatment(id : Common.EntityId, input : TT.TreatmentInput) : async ?TT.Treatment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to update a treatment");
    };
    TreatmentLib.updateTreatment(treatments, id, clinic_id, input);
  };

  // ─── Delete treatment (admin only) ───────────────────────────────────────────
  public shared ({ caller }) func deleteTreatment(id : Common.EntityId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can delete treatments");
    };
    TreatmentLib.deleteTreatment(treatments, id, clinic_id);
  };

  // ─── Upsert tooth chart (doctor or admin only) ────────────────────────────────
  public shared ({ caller }) func upsertToothChart(
    patient_id   : Common.EntityId,
    treatment_id : ?Common.EntityId,
    teeth        : [TT.ToothEntry],
  ) : async TT.ToothChart {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to update a tooth chart");
    };
    let chart = TreatmentLib.upsertChart(charts, clinic_id, patient_id, treatment_id, teeth, idCounter.value);
    idCounter.value += 1;
    chart;
  };

  // ─── Get tooth chart ──────────────────────────────────────────────────────────
  public query ({ caller }) func getToothChart(patient_id : Common.EntityId) : async ?TT.ToothChart {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to view a tooth chart");
    };
    TreatmentLib.getChart(charts, patient_id, clinic_id);
  };
};
