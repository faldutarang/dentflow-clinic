import { Bell, LogOut, Search } from "lucide-react";
import type { StaffMember } from "../../types";
import type { StaffRole } from "../../types";

const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin",
  doctor: "Doctor",
  receptionist: "Receptionist",
};

const ROLE_BADGE_CLASS: Record<StaffRole, string> = {
  admin: "bg-role-admin text-[oklch(0.74_0.16_78)] border-role-admin",
  doctor: "bg-role-doctor text-[oklch(0.62_0.18_200)] border-role-doctor",
  receptionist:
    "bg-role-receptionist text-[oklch(0.65_0.17_155)] border-role-receptionist",
};

interface TopBarProps {
  staff: StaffMember | null;
  onLogout: () => void;
  clinicName?: string;
  onSearch?: (query: string) => void;
}

export function TopBar({
  staff,
  onLogout,
  clinicName = "DentaCare Pro",
  onSearch,
}: TopBarProps) {
  const role = staff?.role ?? "receptionist";

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 shrink-0 z-30">
      {/* Clinic name */}
      <div className="hidden md:block">
        <span className="font-display font-bold text-sm text-foreground">
          {clinicName}
        </span>
      </div>

      {/* Search */}
      {onSearch && (
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Quick search..."
              onChange={(e) => onSearch(e.target.value)}
              data-ocid="topbar.search_input"
              className="w-full h-8 bg-muted/40 border border-border rounded-lg pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-background"
            />
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          type="button"
          data-ocid="topbar.notifications.button"
          className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-2 px-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
            {staff?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-medium text-foreground leading-none">
              {staff?.name ?? "Loading..."}
            </p>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border mt-0.5 ${ROLE_BADGE_CLASS[role]}`}
            >
              {ROLE_LABELS[role]}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          data-ocid="topbar.logout.button"
          className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
