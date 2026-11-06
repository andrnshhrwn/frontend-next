"use client";

import { useState, useEffect } from "react";
import { PanelLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { authService, type UserProfile } from "@/services/authService";
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
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    setUser(currentUser);
    setLoadingUser(false);
  }, []);

  const handleLogout = () => {
    if (loadingUser || !user) return;

    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    if (!user) return;

    setShowLogoutModal(false);
    authService.clearSession();
    router.replace("/login");
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

            <p className="mt-0.5 truncate text-[11px] text-slate-500 md:text-xs">
              <span className="font-semibold text-pdam-primary">
                PAM Tirta Kamuning
              </span>
              {" / "}Monitoring Terpusat
            </p>
          </div>
        </div>

        {/* Informasi Pengguna */}
        <HeaderUserInfo
          user={user}
          loadingUser={loadingUser}
          onLogout={handleLogout}
        />
      </header>

      {/* Modal Konfirmasi Logout */}
      <HeaderLogoutModal
        isOpen={showLogoutModal}
        displayName={user?.fullname || user?.username || "Pengguna"}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
