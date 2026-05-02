import Map "mo:core/Map";
import Time "mo:core/Time";
import BT "../types/billing";
import Common "../types/common";

module {
  public type State = Map.Map<Common.EntityId, BT.Invoice>;

  // ─── Computed totals ─────────────────────────────────────────────────────────
  func computeTotals(items : [BT.InvoiceItem]) : (Float, Float, Float) {
    var subtotal : Float = 0.0;
    var gst_total : Float = 0.0;
    for (item in items.vals()) {
      subtotal   += item.amount;
      gst_total  += item.amount * item.gst_rate;
    };
    (subtotal, gst_total, subtotal + gst_total)
  };

  // ─── Resolve payment status ───────────────────────────────────────────────────
  func resolveStatus(total : Float, payments : [BT.Payment]) : BT.InvoiceStatus {
    var paid : Float = 0.0;
    for (p in payments.vals()) { paid += p.amount };
    if (paid <= 0.0)         { #draft }
    else if (paid >= total)  { #paid  }
    else                     { #partiallyPaid }
  };

  // ─── CRUD ────────────────────────────────────────────────────────────────────
  public func createInvoice(
    state     : State,
    clinic_id : Common.ClinicId,
    input     : BT.InvoiceInput,
    next_id   : Nat,
  ) : BT.Invoice {
    let (subtotal, gst_total, total) = computeTotals(input.items);
    let invoice : BT.Invoice = {
      id              = next_id;
      clinic_id;
      patient_id      = input.patient_id;
      items           = input.items;
      subtotal;
      gst_total;
      total;
      status          = #draft;
      payment_history = [];
      created_at      = Time.now();
    };
    state.add(next_id, invoice);
    invoice
  };

  public func getInvoice(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : ?BT.Invoice {
    switch (state.get(id)) {
      case (?inv) { if (inv.clinic_id == clinic_id) ?inv else null };
      case null   { null };
    }
  };

  public func listInvoices(
    state      : State,
    clinic_id  : Common.ClinicId,
    patient_id : ?Common.EntityId,
  ) : [BT.Invoice] {
    state.values().filter(func(inv : BT.Invoice) : Bool {
      inv.clinic_id == clinic_id and (
        switch (patient_id) {
          case (?pid) inv.patient_id == pid;
          case null   true;
        }
      )
    }).toArray()
  };

  public func recordPayment(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
    payment   : BT.Payment,
  ) : ?BT.Invoice {
    switch (state.get(id)) {
      case (?inv) {
        if (inv.clinic_id != clinic_id) return null;
        if (inv.status == #cancelled)   return null;
        let newPayments = inv.payment_history.concat([payment]);
        let newStatus   = resolveStatus(inv.total, newPayments);
        let updated     = { inv with payment_history = newPayments; status = newStatus };
        state.add(id, updated);
        ?updated
      };
      case null { null };
    }
  };

  public func cancelInvoice(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : Bool {
    switch (state.get(id)) {
      case (?inv) {
        if (inv.clinic_id != clinic_id) return false;
        state.add(id, { inv with status = #cancelled });
        true
      };
      case null { false };
    }
  };

  public func updateInvoice(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
    input     : BT.InvoiceInput,
  ) : ?BT.Invoice {
    switch (state.get(id)) {
      case (?inv) {
        if (inv.clinic_id != clinic_id) return null;
        if (inv.status == #cancelled)   return null;
        let (subtotal, gst_total, total) = computeTotals(input.items);
        let newStatus = resolveStatus(total, inv.payment_history);
        let updated   = {
          inv with
          patient_id = input.patient_id;
          items      = input.items;
          subtotal;
          gst_total;
          total;
          status     = newStatus;
        };
        state.add(id, updated);
        ?updated
      };
      case null { null };
    }
  };
};
