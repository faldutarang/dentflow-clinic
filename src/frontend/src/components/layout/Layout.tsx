import { Toaster } from "@/components/ui/sonner";
import type React from "react";
import type { StaffMember, StaffRole } from "../../types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface LayoutProps {
  children: React.ReactNode;
  staff: StaffMember | null;
  role: StaffRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export function Layout({
  children,
  staff,
  role,
  currentPath,
  onNavigate,
  onLogout,
}: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} currentPath={currentPath} onNavigate={onNavigate} />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar staff={staff} onLogout={onLogout} />

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>

        <footer className="shrink-0 border-t border-border px-6 py-2 bg-muted/40">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}
