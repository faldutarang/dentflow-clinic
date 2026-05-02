import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Building2,
  Clock,
  Database,
  Globe,
  Hash,
  Mail,
  Phone,
  Save,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ClinicSettings } from "../backend";
import { PageHeader } from "../components/layout/PageHeader";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "../components/shared/Card";

// ─── Settings Form ────────────────────────────────────────────────────────────
function ClinicSettingsForm() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const { data: settings, isLoading } = useQuery<ClinicSettings | null>({
    queryKey: ["clinicSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getClinicSettings();
    },
    enabled: !!actor && !isFetching,
  });

  const updateMutation = useMutation({
    mutationFn: async (updated: ClinicSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateClinicSettings(updated);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinicSettings"] });
      toast.success("Clinic settings saved successfully.");
    },
    onError: () => {
      toast.error("Failed to save settings. Please try again.");
    },
  });

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("18:00");
  const [daysOpen, setDaysOpen] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);

  // Populate form when settings load
  useEffect(() => {
    if (!settings) return;
    setName(settings.name);
    setAddress(settings.address);
    setGstNumber(settings.gst_number);
    setPhone(settings.phone);
    setEmail(settings.email);
    setOpenTime(settings.working_hours.open_time);
    setCloseTime(settings.working_hours.close_time);
    setDaysOpen(settings.working_hours.days_open);
  }, [settings]);

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setDaysOpen((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    updateMutation.mutate({
      ...settings,
      name,
      address,
      gst_number: gstNumber,
      phone,
      email,
      working_hours: {
        open_time: openTime,
        close_time: closeTime,
        days_open: daysOpen,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {(["a", "b", "c", "d"] as const).map((k) => (
          <div key={k} className="h-12 rounded-lg bg-muted/30 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-5"
      data-ocid="settings.clinic_form"
    >
      {/* Clinic Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="settings-name"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          Clinic Name
        </label>
        <input
          id="settings-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="DentaCare Pro"
          required
          data-ocid="settings.clinic_name.input"
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label
          htmlFor="settings-address"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          Address
        </label>
        <textarea
          id="settings-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          placeholder="123 Medical Complex, Mumbai, Maharashtra 400001"
          data-ocid="settings.address.textarea"
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* GST Number */}
      <div className="space-y-1.5">
        <label
          htmlFor="settings-gst"
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          <Hash className="h-3.5 w-3.5 text-muted-foreground" />
          GST Number
        </label>
        <input
          id="settings-gst"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
          placeholder="27AABCU9603R1ZX"
          data-ocid="settings.gst_number.input"
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="settings-phone"
            className="flex items-center gap-1.5 text-sm font-medium text-foreground"
          >
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            Phone
          </label>
          <input
            id="settings-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            data-ocid="settings.phone.input"
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="settings-email"
            className="flex items-center gap-1.5 text-sm font-medium text-foreground"
          >
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Email
          </label>
          <input
            id="settings-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@dentaclinic.com"
            data-ocid="settings.email.input"
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Working Hours */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          Working Hours
        </p>
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="settings-open-time"
                className="text-xs text-muted-foreground"
              >
                Open Time
              </label>
              <input
                id="settings-open-time"
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                data-ocid="settings.open_time.input"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="settings-close-time"
                className="text-xs text-muted-foreground"
              >
                Close Time
              </label>
              <input
                id="settings-close-time"
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                data-ocid="settings.close_time.input"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-xs text-muted-foreground mb-2">
              Days Open
            </legend>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  data-ocid={`settings.day_${day.toLowerCase()}.toggle`}
                  aria-pressed={daysOpen.includes(day)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    daysOpen.includes(day)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={updateMutation.isPending || !settings}
          data-ocid="settings.save.submit_button"
          className="flex items-center gap-2 px-6 h-10 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

// ─── Info Cards ────────────────────────────────────────────────────────────────
const INFO_SECTIONS = [
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Security & Access",
    description: "Role-based access control and audit logs",
    items: [
      "Role-based access: Enabled (Admin · Doctor · Receptionist)",
      "Audit logging: Active on all mutations",
      "Session timeout: 30 minutes of inactivity",
    ],
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Data Management",
    description: "Backups, exports, and storage infrastructure",
    items: [
      "Data stored on Internet Computer (immutable ledger)",
      "Automatic state snapshots: On every upgrade",
      "Data encryption: AES-256 at rest",
    ],
  },
  {
    icon: <Bell className="h-5 w-5" />,
    title: "Notifications & Alerts",
    description: "Configure in-app alerts and reminders",
    items: [
      "Low stock alerts: Enabled (threshold: reorder level)",
      "Expiry alerts: 30 days ahead",
      "Lab order status: Real-time updates",
    ],
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Multi-Clinic Setup",
    description: "Manage multiple clinic locations",
    items: [
      "Primary clinic: Auto-assigned on first login",
      "Clinic ID: Immutable after creation",
      "Cross-clinic data: Fully isolated",
    ],
  },
];

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <div data-ocid="settings.page">
      <PageHeader
        title="Settings"
        description="Manage clinic preferences and system configuration"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main clinic settings form — spans 2 cols */}
        <div className="lg:col-span-2">
          <Card accent="admin" data-ocid="settings.clinic_settings.card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <CardTitle>Clinic Settings</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Update clinic name, address, GST number, contact info, and
                working hours.
              </p>
            </CardHeader>
            <CardBody>
              <ClinicSettingsForm />
            </CardBody>
          </Card>
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          {INFO_SECTIONS.map((section) => (
            <Card
              key={section.title}
              data-ocid={`settings.${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.card`}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    {section.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {section.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {section.description}
                </p>
              </CardHeader>
              <CardBody>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        DentaCare Pro is built on the Internet Computer — decentralized,
        privacy-first, and always available.
      </p>
    </div>
  );
}
