import Common "common";

module {
  public type PatientId  = Common.EntityId;
  public type ClinicId   = Common.ClinicId;
  public type Timestamp  = Common.Timestamp;
  public type InvoiceId  = Common.EntityId;

  // ─── Line item ───────────────────────────────────────────────────────────────
  public type InvoiceItem = {
    description : Text;
    amount      : Float;
    gst_rate    : Float;     // e.g. 0.18 for 18 %
  };

  // ─── Payment ─────────────────────────────────────────────────────────────────
  public type PaymentMethod = { #cash; #card; #upi; #netBanking; #cheque; #other };

  public type Payment = {
    amount    : Float;
    method    : PaymentMethod;
    date      : Timestamp;
    reference : Text;
  };

  // ─── Invoice ─────────────────────────────────────────────────────────────────
  public type InvoiceStatus = { #draft; #issued; #partiallyPaid; #paid; #cancelled };

  public type Invoice = {
    id              : InvoiceId;
    clinic_id       : ClinicId;
    patient_id      : PatientId;
    items           : [InvoiceItem];
    subtotal        : Float;
    gst_total       : Float;
    total           : Float;
    status          : InvoiceStatus;
    payment_history : [Payment];
    created_at      : Timestamp;
  };

  public type InvoiceInput = {
    patient_id : PatientId;
    items      : [InvoiceItem];
  };
};
