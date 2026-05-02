import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import BT "../types/billing";
import Common "../types/common";
import BillingLib "../lib/billing";

mixin (
  accessControlState : AccessControl.AccessControlState,
  invoices           : BillingLib.State,
  clinic_id          : Common.ClinicId,
  idCounter          : Common.Counter,
) {
  public shared ({ caller }) func createInvoice(input : BT.InvoiceInput) : async BT.Invoice {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    let id = idCounter.value;
    idCounter.value += 1;
    BillingLib.createInvoice(invoices, clinic_id, input, id)
  };

  public query ({ caller }) func getInvoice(id : Common.EntityId) : async ?BT.Invoice {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    BillingLib.getInvoice(invoices, id, clinic_id)
  };

  public query ({ caller }) func listInvoices(patient_id : ?Common.EntityId) : async [BT.Invoice] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    BillingLib.listInvoices(invoices, clinic_id, patient_id)
  };

  public shared ({ caller }) func recordPayment(id : Common.EntityId, payment : BT.Payment) : async ?BT.Invoice {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    BillingLib.recordPayment(invoices, id, clinic_id, payment)
  };

  public shared ({ caller }) func cancelInvoice(id : Common.EntityId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    BillingLib.cancelInvoice(invoices, id, clinic_id)
  };

  public shared ({ caller }) func updateInvoice(id : Common.EntityId, input : BT.InvoiceInput) : async ?BT.Invoice {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: login required");
    };
    BillingLib.updateInvoice(invoices, id, clinic_id, input)
  };
};
