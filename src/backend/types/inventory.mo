import Common "common";

module {
  public type ClinicId   = Common.ClinicId;
  public type Timestamp  = Common.Timestamp;
  public type ItemId     = Common.EntityId;

  // ─── Inventory item ──────────────────────────────────────────────────────────
  public type InventoryItem = {
    id            : ItemId;
    clinic_id     : ClinicId;
    name          : Text;
    category      : Text;
    stock         : Float;
    unit          : Text;
    cost_price    : Float;
    expiry_date   : ?Text;     // "YYYY-MM-DD"
    reorder_level : Float;
    supplier      : Text;
    updated_at    : Timestamp;
  };

  public type InventoryItemInput = {
    name          : Text;
    category      : Text;
    stock         : Float;
    unit          : Text;
    cost_price    : Float;
    expiry_date   : ?Text;
    reorder_level : Float;
    supplier      : Text;
  };
};
