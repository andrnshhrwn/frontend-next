"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  User,
  PanelLeft,
  Menu,
  LogOut,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { authService, type UserProfile } from "@/services/authService";
import { BaseModal } from "@/components/ui";

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

  // Membuka modal konfirmasi logout
  const handleLogout = () => {
    if (loadingUser || !user) return;

    setShowLogoutModal(true);
  };

  // Membatalkan logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Melanjutkan proses logout
  const handleConfirmLogout = () => {
    if (!user) return;

    // Tutup modal terlebih dahulu
    setShowLogoutModal(false);

    // Hapus sesi login
    authService.clearSession();

    // Arahkan ke halaman login
    router.replace("/login");
  };

  const displayName = user?.fullname || user?.username || "Pengguna";

  const displayRole =
    user?.role === "admin_pusat"
      ? "Admin Pusat (Global)"
      : user?.role === "admin_cabang"
        ? "Admin Cabang"
        : user?.role === "teknisi"
          ? "Teknisi"
          : "Pengguna";

  const displayUnit =
    user?.role === "admin_pusat"
      ? "Kantor Pusat"
      : (user?.nama_unit ?? "Unit belum tersedia");

  const isLoggedIn = user !== null;

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Tombol Mobile Drawer */}
          <button
            type="button"
            onClick={openMobileSidebar}
            className="btn btn-ghost btn-sm btn-square lg:hidden text-slate-600 hover:text-pdam-navy hover:bg-pdam-bg"
            title="Buka Menu"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Tombol Collapse Desktop */}
          {isCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm btn-square hidden lg:inline-flex text-slate-600 hover:text-pdam-navy hover:bg-pdam-bg"
              title="Buka Sidebar"
              aria-label="Buka sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}

          {/* Identitas Sistem */}
          <div>
            <h1 className="text-sm md:text-base font-bold leading-tight text-pdam-navy">
              Sistem Manajemen &amp; Pergantian Water Meter
            </h1>

            <p className="text-[11px] md:text-xs text-slate-500 truncate max-w-[180px] sm:max-w-none">
              <span className="font-semibold text-pdam-primary">
                PAM Tirta Kamuning
              </span>{" "}
              / Monitoring Terpusat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Informasi Unit */}
          <div className="hidden md:flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-pdam-primary/30 text-pdam-primary bg-pdam-primary/10 font-bold text-[11px] sm:text-xs">
            <MapPin className="w-3.5 h-3.5 fill-current" />

            <span>{loadingUser ? "Memuat unit..." : displayUnit}</span>
          </div>

          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
            {/* Informasi Pengguna */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold leading-tight text-pdam-navy truncate max-w-[140px] md:max-w-none">
                {loadingUser ? "Memuat profil..." : displayName}
              </p>

              <p className="text-[10px] text-slate-400 font-medium">
                {loadingUser ? "Memeriksa sesi" : displayRole}
              </p>
            </div>

            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="bg-pdam-navy text-white rounded-full w-8 sm:w-9 flex items-center justify-center font-bold shadow-sm ring-2 ring-pdam-primary/20">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            {/* Status Sesi Login */}
            <div
              className={`hidden sm:flex items-center justify-center ${
                loadingUser
                  ? "text-slate-400"
                  : isLoggedIn
                    ? "text-emerald-600"
                    : "text-rose-500"
              }`}
              title={
                loadingUser
                  ? "Memeriksa sesi login"
                  : isLoggedIn
                    ? "Profil login tersedia"
                    : "Profil login tidak tersedia"
              }
            >
              {loadingUser ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : isLoggedIn ? (
                <CircleCheck className="w-4 h-4" />
              ) : (
                <CircleAlert className="w-4 h-4" />
              )}
            </div>

            {/* Tombol Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loadingUser || !isLoggedIn}
              className="btn btn-sm btn-ghost text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition ml-1 disabled:opacity-50"
              title="Keluar dari Sistem (Logout)"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Modal Konfirmasi Logout */}
      <BaseModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        title="Konfirmasi Logout"
        maxWidth="sm"
      >
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-rose-500" />
          </div>

          <h3 className="text-sm font-bold text-slate-800 mb-2">
            Apakah Anda yakin ingin keluar?
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Anda akan mengakhiri sesi login sebagai{" "}
            <span className="font-semibold text-slate-700">{displayName}</span>.
            Untuk mengakses sistem kembali, Anda harus login ulang.
          </p>
        </div>

        <div className="-mx-6 -mb-6 mt-6 px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancelLogout}
            className="btn btn-sm bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 rounded-lg px-4"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleConfirmLogout}
            className="btn btn-sm bg-rose-600 border border-rose-600 text-white hover:bg-rose-700 hover:border-rose-700 rounded-lg px-4"
          >
            <LogOut className="w-4 h-4" />
            Ya, Keluar
          </button>
        </div>
      </BaseModal>
    </>
  );
}
