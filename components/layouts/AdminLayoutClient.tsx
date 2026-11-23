"use client";

import { Suspense, useEffect, useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import Header from "@/components/layouts/Header";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import PageSkeleton from "./PageSkeleton";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Mode ciut hanya berlaku di desktop. Di mobile drawer selalu penuh.
  const sidebarCollapsed = isCollapsed && isDesktop;

  // Layar membesar ke desktop: tutup state drawer mobile
  useEffect(() => {
    if (isDesktop) setIsMobileOpen(false);
  }, [isDesktop]);

  // Tutup drawer dengan tombol Escape
  useEffect(() => {
    if (!isMobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  const toggleSidebar = () => setIsCollapsed((v) => !v);
  const openMobileSidebar = () => setIsMobileOpen(true);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <div className="drawer lg:drawer-open h-dvh w-full overflow-hidden bg-pdam-bg">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isMobileOpen}
        onChange={(e) => setIsMobileOpen(e.target.checked)}
      />

      {/* Area konten */}
      <div className="drawer-content flex h-full min-w-0 flex-col overflow-hidden bg-pdam-bg">
        <Header
          toggleSidebar={toggleSidebar}
          openMobileSidebar={openMobileSidebar}
          isCollapsed={isCollapsed}
        />

        <main className="flex-1 overflow-y-auto overscroll-contain bg-pdam-bg p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-350">
            <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="Tutup sidebar"
          className="drawer-overlay"
        />

        <Suspense
          fallback={
            <aside className="h-full w-72 max-w-[85vw] border-r border-slate-200/90 bg-white lg:w-64" />
          }
        >
          <Sidebar
            isCollapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
            closeMobileSidebar={closeMobileSidebar}
          />
        </Suspense>
      </div>
    </div>
  );
}
