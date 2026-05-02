import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import IT "../types/inventory";
import Common "../types/common";
import InventoryLib "../lib/inventory";

mixin (
  accessControlState : AccessControl.AccessControlState,
  inventory          : InventoryLib.State,
  clinic_id          : Common.ClinicId,
  idCounter          : Common.Counter,
) {
  public shared ({ caller }) func createInventoryItem(input : IT.InventoryItemInput) : async IT.InventoryItem {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    let id = idCounter.value;
    idCounter.value += 1;
    InventoryLib.createItem(inventory, clinic_id, input, id)
  };

  public query ({ caller }) func getInventoryItem(id : Common.EntityId) : async ?IT.InventoryItem {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    InventoryLib.getItem(inventory, id, clinic_id)
  };

  public query ({ caller }) func listInventoryItems() : async [IT.InventoryItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    InventoryLib.listItems(inventory, clinic_id)
  };

  public shared ({ caller }) func updateInventoryItem(id : Common.EntityId, input : IT.InventoryItemInput) : async ?IT.InventoryItem {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    InventoryLib.updateItem(inventory, id, clinic_id, input)
  };

  public shared ({ caller }) func adjustInventoryStock(id : Common.EntityId, delta : Float) : async ?IT.InventoryItem {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    InventoryLib.adjustStock(inventory, id, clinic_id, delta)
  };

  public shared ({ caller }) func deleteInventoryItem(id : Common.EntityId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    InventoryLib.deleteItem(inventory, id, clinic_id)
  };

  public query ({ caller }) func getLowStockAlerts() : async [IT.InventoryItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    InventoryLib.lowStockAlerts(inventory, clinic_id)
  };

  public query ({ caller }) func getExpiryAlerts(days_ahead : Nat) : async [IT.InventoryItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    InventoryLib.expiryAlerts(inventory, clinic_id, days_ahead)
  };
};
