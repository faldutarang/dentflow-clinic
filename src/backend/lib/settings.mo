import Map "mo:core/Map";
import Common "../types/common";

module {
  public type State = Map.Map<Common.ClinicId, Common.ClinicSettings>;

  public func getSettings(
    state     : State,
    clinic_id : Common.ClinicId,
  ) : ?Common.ClinicSettings {
    state.get(clinic_id);
  };

  public func updateSettings(
    state    : State,
    settings : Common.ClinicSettings,
  ) : Common.ClinicSettings {
    state.add(settings.clinic_id, settings);
    settings;
  };
};
