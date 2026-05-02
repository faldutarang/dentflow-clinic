import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import LT "../types/lab";
import Common "../types/common";
import LabLib "../lib/lab";

mixin (
  accessControlState : AccessControl.AccessControlState,
  labOrders          : LabLib.State,
  clinic_id          : Common.ClinicId,
  idCounter          : Common.Counter,
) {
  public shared ({ caller }) func createLabOrder(input : LT.LabOrderInput) : async LT.LabOrder {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required to create lab orders");
    };
    let order = LabLib.createOrder(labOrders, clinic_id, input, idCounter.value);
    idCounter.value += 1;
    order;
  };

  public query ({ caller }) func getLabOrder(id : Common.EntityId) : async ?LT.LabOrder {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    LabLib.getOrder(labOrders, id, clinic_id);
  };

  public query ({ caller }) func listLabOrders(patient_id : ?Common.EntityId) : async [LT.LabOrder] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    LabLib.listOrders(labOrders, clinic_id, patient_id);
  };

  public shared ({ caller }) func updateLabOrderStatus(
    id             : Common.EntityId,
    status         : LT.LabOrderStatus,
    completed_date : ?Text,
  ) : async ?LT.LabOrder {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    LabLib.updateOrderStatus(labOrders, id, clinic_id, status, completed_date);
  };

  public shared ({ caller }) func deleteLabOrder(id : Common.EntityId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    LabLib.deleteOrder(labOrders, id, clinic_id);
  };
};
