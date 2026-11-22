"use client";

import { useState } from "react";
import { PanelLeft, Menu } from "lucide-react";

import { useAuthStore } from "@/lib/auth/auth-store";
import HeaderUserInfo from "./header/HeaderUserInfo";
import HeaderLogoutModal from "./header/HeaderLogoutModal";

interface HeaderProps {
  toggleSidebar: () => void;
  openMobileSidebar: () => void;
  isCollapsed: boolean;
}

export default function Header({
  toggleSidebar,
  openMobileSidebar,
  isCollapsed,
}: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    if (!user) return;

    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    if (loggingOut) return;

    setShowLogoutModal(false);
  };

  const handleConfirmLogout = async () => {
    if (!user || loggingOut) return;

    setLoggingOut(true);
    setShowLogoutModal(false);

    // Hapus cookie di server, kosongkan store, lalu redirect ke /login
    await logout();
  };

  return (
    <>
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
        {/* Identitas Sistem dan Navigasi */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={openMobileSidebar}
            className="btn btn-ghost btn-sm btn-square text-slate-600 hover:bg-pdam-bg hover:text-pdam-navy lg:hidden"
            title="Buka Menu"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {isCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm btn-square hidden text-slate-600 hover:bg-pdam-bg hover:text-pdam-navy lg:inline-flex"
              title="Buka Sidebar"
              aria-label="Buka sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold leading-tight text-pdam-navy md:text-base">
              Sistem Manajemen &amp; Pergantian Water Meter
            </h1>
          </div>
        </div>

        {/* Informasi Pengguna */}
        <HeaderUserInfo
          user={user}
          loadingUser={!user}
          onLogout={handleLogout}
        />
      </header>

      {/* Modal Konfirmasi Logout */}
      <HeaderLogoutModal
        isOpen={showLogoutModal}
        displayName={user?.fullname || user?.username || "Pengguna"}
        onClose={handleCancelLogout}
        onConfirm={() => void handleConfirmLogout()}
      />
    </>
  );
}
