import Map "mo:core/Map";
import Time "mo:core/Time";
import IT "../types/inventory";
import Common "../types/common";

module {
  public type State = Map.Map<Common.EntityId, IT.InventoryItem>;

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  // Simple date comparison: "YYYY-MM-DD" strings compare lexicographically.
  // A cutoff date string is computed by adding days to today's YYYY-MM-DD.
  // We use nanosecond-based arithmetic: 1 day = 86_400_000_000_000 ns.
  func daysAheadDate(days : Nat) : Text {
    let nowNs  = Time.now();
    let dayNs  : Int = 86_400_000_000_000;
    let cutNs  = nowNs + dayNs * days.toInt();
    // Convert ns → seconds, then compute YYYY-MM-DD
    let secs   = cutNs / 1_000_000_000;
    let days_total = secs / 86_400 + 719_468; // offset to proleptic Gregorian epoch
    let era    = (if (days_total >= 0) days_total else days_total - 146_096) / 146_097;
    let doe    = days_total - era * 146_097;
    let yoe    = (doe - doe / 1460 + doe / 36524 - doe / 146_096) / 365;
    let y      = yoe + era * 400;
    let doy    = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp     = (5 * doy + 2) / 153;
    let d      = doy - (153 * mp + 2) / 5 + 1;
    let m      = if (mp < 10) mp + 3 else mp - 9;
    let yr     = if (m <= 2) y + 1 else y;
    padInt(yr, 4) # "-" # padInt(m, 2) # "-" # padInt(d, 2)
  };

  func padInt(n : Int, width : Nat) : Text {
    let s = n.toText();
    let len = s.size();
    if (len >= width) s
    else {
      var pad = "";
      var i = 0;
      while (i < width - len) { pad #= "0"; i += 1 };
      pad # s
    }
  };

  func todayString() : Text { daysAheadDate(0) };

  // ─── CRUD ────────────────────────────────────────────────────────────────────
  public func createItem(
    state     : State,
    clinic_id : Common.ClinicId,
    input     : IT.InventoryItemInput,
    next_id   : Nat,
  ) : IT.InventoryItem {
    let item : IT.InventoryItem = {
      id            = next_id;
      clinic_id;
      name          = input.name;
      category      = input.category;
      stock         = input.stock;
      unit          = input.unit;
      cost_price    = input.cost_price;
      expiry_date   = input.expiry_date;
      reorder_level = input.reorder_level;
      supplier      = input.supplier;
      updated_at    = Time.now();
    };
    state.add(next_id, item);
    item
  };

  public func getItem(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : ?IT.InventoryItem {
    switch (state.get(id)) {
      case (?item) { if (item.clinic_id == clinic_id) ?item else null };
      case null    { null };
    }
  };

  public func listItems(
    state     : State,
    clinic_id : Common.ClinicId,
  ) : [IT.InventoryItem] {
    state.values().filter(func(i : IT.InventoryItem) : Bool {
      i.clinic_id == clinic_id
    }).toArray()
  };

  public func updateItem(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
    input     : IT.InventoryItemInput,
  ) : ?IT.InventoryItem {
    switch (state.get(id)) {
      case (?item) {
        if (item.clinic_id != clinic_id) return null;
        let updated : IT.InventoryItem = {
          item with
          name          = input.name;
          category      = input.category;
          stock         = input.stock;
          unit          = input.unit;
          cost_price    = input.cost_price;
          expiry_date   = input.expiry_date;
          reorder_level = input.reorder_level;
          supplier      = input.supplier;
          updated_at    = Time.now();
        };
        state.add(id, updated);
        ?updated
      };
      case null { null };
    }
  };

  public func adjustStock(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
    delta     : Float,
  ) : ?IT.InventoryItem {
    switch (state.get(id)) {
      case (?item) {
        if (item.clinic_id != clinic_id) return null;
        let updated = { item with stock = item.stock + delta; updated_at = Time.now() };
        state.add(id, updated);
        ?updated
      };
      case null { null };
    }
  };

  public func deleteItem(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : Bool {
    switch (state.get(id)) {
      case (?item) {
        if (item.clinic_id != clinic_id) return false;
        state.remove(id);
        true
      };
      case null { false };
    }
  };

  public func lowStockAlerts(
    state     : State,
    clinic_id : Common.ClinicId,
  ) : [IT.InventoryItem] {
    state.values().filter(func(i : IT.InventoryItem) : Bool {
      i.clinic_id == clinic_id and i.stock <= i.reorder_level
    }).toArray()
  };

  public func expiryAlerts(
    state      : State,
    clinic_id  : Common.ClinicId,
    days_ahead : Nat,
  ) : [IT.InventoryItem] {
    let cutoff = daysAheadDate(days_ahead);
    let today  = todayString();
    state.values().filter(func(i : IT.InventoryItem) : Bool {
      if (i.clinic_id != clinic_id) return false;
      switch (i.expiry_date) {
        case (?exp) { exp >= today and exp <= cutoff };
        case null   { false };
      }
    }).toArray()
  };
};
