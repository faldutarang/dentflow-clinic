import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Grid3X3,
  LayoutDashboard,
  Package,
  Pill,
  Receipt,
  Settings,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { StaffRole } from "../../types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: StaffRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.doctor, StaffRole.receptionist],
  },
  {
    label: "Patients",
    href: "/patients",
    icon: <Users className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.doctor, StaffRole.receptionist],
  },
  {
    label: "Treatments",
    href: "/treatments",
    icon: <Stethoscope className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.doctor],
  },
  {
    label: "Dental Chart",
    href: "/dental-chart",
    icon: <Grid3X3 className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.doctor],
  },
  {
    label: "Prescriptions",
    href: "/prescriptions",
    icon: <Pill className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.doctor],
  },
  {
    label: "Lab Orders",
    href: "/lab-orders",
    icon: <FlaskConical className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.doctor],
  },
  {
    label: "Billing",
    href: "/billing",
    icon: <Receipt className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.receptionist],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: <Package className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.receptionist],
  },
  {
    label: "Staff",
    href: "/staff",
    icon: <UserCheck className="h-4 w-4" />,
    roles: [StaffRole.admin, StaffRole.receptionist],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <BarChart3 className="h-4 w-4" />,
    roles: [StaffRole.admin],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-4 w-4" />,
    roles: [StaffRole.admin],
  },
];

const ROLE_ACCENT: Record<StaffRole, string> = {
  [StaffRole.admin]: "oklch(0.74 0.16 78)",
  [StaffRole.doctor]: "oklch(0.62 0.18 200)",
  [StaffRole.receptionist]: "oklch(0.65 0.17 155)",
};

interface SidebarProps {
  role: StaffRole;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ role, currentPath, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const filteredItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const accentColor = ROLE_ACCENT[role];

  return (
    <aside
      className={cn(
        "flex flex-col bg-[oklch(0.15_0.02_265)] border-r border-border transition-all duration-300 shrink-0",
        collapsed ? "w-14" : "w-56",
      )}
      style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 border-b border-border px-3 gap-2.5 shrink-0">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-[oklch(0.13_0.018_265)] font-bold text-xs"
          style={{ backgroundColor: accentColor }}
        >
          DC
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-foreground truncate">
              DentaCare
            </p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {filteredItems.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/" && currentPath.startsWith(item.href));
          return (
            <button
              key={item.href}
              type="button"
              data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
              onClick={() => onNavigate(item.href)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 text-left",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                collapsed && "justify-center px-2",
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `color-mix(in oklch, ${accentColor} 15%, transparent)`,
                      color: accentColor,
                    }
                  : {}
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          data-ocid="sidebar.collapse_button"
          className={cn(
            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors",
            collapsed && "justify-center",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
