import { createActor } from "@/backend";
import { Toaster } from "@/components/ui/sonner";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { Suspense, lazy, useEffect, useState } from "react";
import type React from "react";
import { toast } from "sonner";
import { Layout } from "./components/layout/Layout";
import { LoadingSpinner } from "./components/shared/LoadingSpinner";
import { StaffRole, UserRole } from "./types";
import type { StaffMember } from "./types";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PatientsPage = lazy(() => import("./pages/PatientsPage"));
const PatientDetailPage = lazy(() => import("./pages/PatientDetailPage"));
const TreatmentsPage = lazy(() => import("./pages/TreatmentsPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const InvoiceDetailPage = lazy(() => import("./pages/InvoiceDetailPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const PrescriptionsPage = lazy(() => import("./pages/PrescriptionsPage"));
const LabOrdersPage = lazy(() => import("./pages/LabOrdersPage"));
const DentalChartPage = lazy(() => import("./pages/DentalChartPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

// Staff registration form
function StaffRegistrationPage({
  onRegistered,
}: {
  onRegistered: (staff: StaffMember) => void;
}) {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>(StaffRole.receptionist);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !identity) return;
    setLoading(true);
    try {
      const principal = identity.getPrincipal();
      const staff = await actor.createStaffMember({
        name,
        email,
        phone,
        role,
        principal,
        license_number: "",
        hire_date: new Date().toISOString().split("T")[0],
        qualification: "",
      });
      // Assign user role in authorization layer
      await actor.assignCallerUserRole(principal, UserRole.admin);
      toast.success("Profile created successfully!");
      onRegistered(staff);
    } catch {
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 mb-4">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Complete Your Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your staff profile to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="reg-name"
            >
              Full Name
            </label>
            <input
              id="reg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Dr. Sarah Johnson"
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="reg-email"
            >
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="sarah@dentaclinic.com"
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="reg-phone"
            >
              Phone
            </label>
            <input
              id="reg-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="reg-role"
            >
              Your Role
            </label>
            <select
              id="reg-role"
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={StaffRole.admin}>Admin</option>
              <option value={StaffRole.doctor}>Doctor</option>
              <option value={StaffRole.receptionist}>Receptionist</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !name || !email}
            data-ocid="registration.submit_button"
            className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating profile..." : "Get Started"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Route renderer
function AppRouter({
  path,
  role,
  staff,
  onNavigate,
  onLogout,
}: {
  path: string;
  role: StaffRole;
  staff: StaffMember | null;
  onNavigate: (p: string) => void;
  onLogout: () => void;
}) {
  const renderPage = () => {
    if (path === "/" || path === "")
      return (
        <DashboardPage role={role} staff={staff} onNavigate={onNavigate} />
      );
    if (path.match(/^\/patients\/(\d+)$/)) {
      const idStr = path.match(/^\/patients\/(\d+)$/)?.[1];
      return (
        <PatientDetailPage
          patientId={idStr ? BigInt(idStr) : undefined}
          onNavigate={onNavigate}
        />
      );
    }
    if (path.startsWith("/patients"))
      return <PatientsPage onNavigate={onNavigate} />;
    if (path.startsWith("/treatments")) return <TreatmentsPage />;
    if (path.match(/^\/billing\/(\d+)$/)) {
      const idStr = path.match(/^\/billing\/(\d+)$/)?.[1];
      return idStr ? (
        <InvoiceDetailPage
          invoiceId={BigInt(idStr)}
          onBack={() => onNavigate("/billing")}
        />
      ) : (
        <BillingPage />
      );
    }
    if (path.startsWith("/billing"))
      return <BillingPage onNavigate={onNavigate} />;
    if (path.startsWith("/inventory")) return <InventoryPage />;
    if (path.startsWith("/staff")) return <StaffPage />;
    if (path.startsWith("/prescriptions")) return <PrescriptionsPage />;
    if (path.startsWith("/lab-orders")) return <LabOrdersPage />;
    if (path.startsWith("/dental-chart")) return <DentalChartPage />;
    if (path.startsWith("/reports")) return <ReportsPage />;
    if (path.startsWith("/settings")) return <SettingsPage />;
    return <DashboardPage role={role} staff={staff} onNavigate={onNavigate} />;
  };

  return (
    <Layout
      staff={staff}
      role={role}
      currentPath={path}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        {renderPage()}
      </Suspense>
    </Layout>
  );
}

export default function App() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);
  const [path, setPath] = useState("/");
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);

  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  // Detect staff member by listing staff and matching principal
  const { data: staffList, isLoading: staffLoading } = useQuery<StaffMember[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStaffMembers();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  useEffect(() => {
    if (!staffList || !identity) return;
    const principal = identity.getPrincipal().toString();
    const found = staffList.find((s) => s.principal.toString() === principal);
    setCurrentStaff(found ?? null);
  }, [staffList, identity]);

  const handleNavigate = (newPath: string) => setPath(newPath);

  // Loading screen
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // Not logged in — show landing
  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
          {/* Ambient gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.74 0.16 78), transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.62 0.18 200), transparent 70%)",
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-sm text-center relative"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 mb-6">
              <Stethoscope className="h-10 w-10 text-primary" />
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight mb-2 text-foreground">
              DentaCare Pro
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
              Professional dental clinic management system. Manage patients,
              treatments, billing, and your entire practice in one place.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8 text-left">
              {[
                {
                  label: "Admin Panel",
                  sub: "Full control",
                  color: "oklch(0.74 0.16 78)",
                },
                {
                  label: "Doctor Portal",
                  sub: "Clinical tools",
                  color: "oklch(0.62 0.18 200)",
                },
                {
                  label: "Reception Desk",
                  sub: "Patient flow",
                  color: "oklch(0.65 0.17 155)",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-card border border-border rounded-xl p-3"
                  style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
                >
                  <p className="text-xs font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="login.primary_button"
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Connecting...
                </>
              ) : (
                "Sign In with Internet Identity"
              )}
            </button>

            <p className="mt-4 text-xs text-muted-foreground">
              Secure, privacy-preserving authentication on the Internet
              Computer.
            </p>
          </motion.div>
        </div>
        <Toaster />
      </>
    );
  }

  // Loading staff data
  if (staffLoading || isFetching) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="app.loading_state"
      >
        <LoadingSpinner size="lg" label="Loading your profile..." />
      </div>
    );
  }

  // No staff profile — registration
  if (!currentStaff) {
    return (
      <>
        <StaffRegistrationPage
          onRegistered={(staff) => setCurrentStaff(staff)}
        />
        <Toaster />
      </>
    );
  }

  // Main app
  return (
    <AppRouter
      path={path}
      role={currentStaff.role}
      staff={currentStaff}
      onNavigate={handleNavigate}
      onLogout={clear}
    />
  );
}
