import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import SettingsLib "../lib/settings";

mixin (
  accessControlState : AccessControl.AccessControlState,
  clinicSettings     : SettingsLib.State,
  clinic_id          : Common.ClinicId,
) {
  public query ({ caller }) func getClinicSettings() : async ?Common.ClinicSettings {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    SettingsLib.getSettings(clinicSettings, clinic_id);
  };

  public shared ({ caller }) func updateClinicSettings(settings : Common.ClinicSettings) : async Common.ClinicSettings {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update clinic settings");
    };
    // Enforce clinic_id cannot be spoofed by client
    let enforced : Common.ClinicSettings = { settings with clinic_id };
    SettingsLib.updateSettings(clinicSettings, enforced);
  };
};
