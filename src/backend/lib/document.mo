import Map "mo:core/Map";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import Common "../types/common";

module {
  public type State = Map.Map<Common.EntityId, Common.Document>;

  public func storeDocument(
    state      : State,
    clinic_id  : Common.ClinicId,
    owner_id   : Common.EntityId,
    owner_type : Text,
    filename   : Text,
    mime_type  : Text,
    blob       : Storage.ExternalBlob,
    uploader   : Principal,
    next_id    : Nat,
  ) : Common.Document {
    let doc : Common.Document = {
      id          = next_id;
      clinic_id   = clinic_id;
      owner_id    = owner_id;
      owner_type  = owner_type;
      filename    = filename;
      mime_type   = mime_type;
      blob        = blob;
      uploaded_at = Time.now();
      uploaded_by = uploader;
    };
    state.add(next_id, doc);
    doc;
  };

  public func getDocument(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : ?Common.Document {
    switch (state.get(id)) {
      case (?d) { if (d.clinic_id == clinic_id) ?d else null };
      case null { null };
    };
  };

  public func listDocuments(
    state      : State,
    clinic_id  : Common.ClinicId,
    owner_id   : Common.EntityId,
    owner_type : Text,
  ) : [Common.Document] {
    state.values().filter(func(d) {
      d.clinic_id == clinic_id and d.owner_id == owner_id and d.owner_type == owner_type
    }).toArray();
  };

  public func deleteDocument(
    state     : State,
    id        : Common.EntityId,
    clinic_id : Common.ClinicId,
  ) : Bool {
    switch (state.get(id)) {
      case (?d) {
        if (d.clinic_id != clinic_id) return false;
        state.remove(id);
        true;
      };
      case null { false };
    };
  };
};
