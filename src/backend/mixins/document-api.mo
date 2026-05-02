import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Storage "mo:caffeineai-object-storage/Storage";
import Common "../types/common";
import DocumentLib "../lib/document";

mixin (
  accessControlState : AccessControl.AccessControlState,
  documents          : DocumentLib.State,
  clinic_id          : Common.ClinicId,
  idCounter          : Common.Counter,
) {
  public shared ({ caller }) func uploadDocument(
    owner_id   : Common.EntityId,
    owner_type : Text,
    filename   : Text,
    mime_type  : Text,
    blob       : Storage.ExternalBlob,
  ) : async Common.Document {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required to upload documents");
    };
    let doc = DocumentLib.storeDocument(
      documents, clinic_id, owner_id, owner_type,
      filename, mime_type, blob, caller, idCounter.value,
    );
    idCounter.value += 1;
    doc;
  };

  public query ({ caller }) func getDocument(id : Common.EntityId) : async ?Common.Document {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    DocumentLib.getDocument(documents, id, clinic_id);
  };

  public query ({ caller }) func listDocuments(owner_id : Common.EntityId, owner_type : Text) : async [Common.Document] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    DocumentLib.listDocuments(documents, clinic_id, owner_id, owner_type);
  };

  public shared ({ caller }) func deleteDocument(id : Common.EntityId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    DocumentLib.deleteDocument(documents, id, clinic_id);
  };
};
