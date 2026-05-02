import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Migration "migration";
import Common "types/common";

import PatientLib "lib/patient";
import TreatmentLib "lib/treatment";
import BillingLib "lib/billing";
import InventoryLib "lib/inventory";
import StaffLib "lib/staff";
import PrescriptionLib "lib/prescription";
import LabLib "lib/lab";
import DocumentLib "lib/document";
import SettingsLib "lib/settings";

import PatientApi "mixins/patient-api";
import TreatmentApi "mixins/treatment-api";
import BillingApi "mixins/billing-api";
import InventoryApi "mixins/inventory-api";
import StaffApi "mixins/staff-api";
import PrescriptionApi "mixins/prescription-api";
import LabApi "mixins/lab-api";
import DocumentApi "mixins/document-api";
import SettingsApi "mixins/settings-api";

(with migration = Migration.run)
actor {
  // ─── Auth ────────────────────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ─── Object storage ──────────────────────────────────────────────────────────
  include MixinObjectStorage();

  // ─── Multi-clinic: single canister per clinic  ────────────────────────────────
  // clinic_id is a compile-time constant per deployment; 1 as default.
  let clinic_id : Nat = 1;

  // ─── Shared counter for all entity IDs ───────────────────────────────────────
  let idCounter : Common.Counter = { var value = 1 };

  // ─── Domain state ────────────────────────────────────────────────────────────
  let patients      : PatientLib.State           = Map.empty();
  let treatments    : TreatmentLib.TreatmentState = Map.empty();
  let charts        : TreatmentLib.ChartState     = Map.empty();
  let invoices      : BillingLib.State            = Map.empty();
  let inventory     : InventoryLib.State          = Map.empty();
  let staffMembers  : StaffLib.StaffState         = Map.empty();
  let attendance    : StaffLib.AttendanceState    = Map.empty();
  let prescriptions : PrescriptionLib.State       = Map.empty();
  let labOrders     : LabLib.State                = Map.empty();
  let documents     : DocumentLib.State           = Map.empty();
  let clinicSettings : SettingsLib.State          = Map.empty();

  // ─── API mixins ──────────────────────────────────────────────────────────────
  include PatientApi(accessControlState, patients, clinic_id, idCounter);
  include TreatmentApi(accessControlState, treatments, charts, clinic_id, idCounter);
  include BillingApi(accessControlState, invoices, clinic_id, idCounter);
  include InventoryApi(accessControlState, inventory, clinic_id, idCounter);
  include StaffApi(accessControlState, staffMembers, attendance, clinic_id, idCounter);
  include PrescriptionApi(accessControlState, prescriptions, clinic_id, idCounter);
  include LabApi(accessControlState, labOrders, clinic_id, idCounter);
  include DocumentApi(accessControlState, documents, clinic_id, idCounter);
  include SettingsApi(accessControlState, clinicSettings, clinic_id);
};
