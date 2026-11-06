"use client";

import {
  MapPin,
  User,
  LogOut,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
} from "lucide-react";

import type { UserProfile } from "@/services/authService";

interface HeaderUserInfoProps {
  user: UserProfile | null;
  loadingUser: boolean;
  onLogout: () => void;
}

export default function HeaderUserInfo({
  user,
  loadingUser,
  onLogout,
}: HeaderUserInfoProps) {
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
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {/* Informasi Unit */}
      <div className="hidden items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 md:flex sm:text-xs">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-pdam-primary" />

        <span className="max-w-37.5 truncate">
          {loadingUser ? "Memuat unit..." : displayUnit}
        </span>
      </div>

      {/* Profil Pengguna */}
      <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-35 truncate text-xs font-bold leading-tight text-pdam-navy md:max-w-none">
            {loadingUser ? "Memuat profil..." : displayName}
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-slate-500">
            {loadingUser ? "Memeriksa sesi" : displayRole}
          </p>
        </div>

        {/* Avatar */}
        <div className="avatar placeholder">
          <div className="flex w-8 items-center justify-center rounded-full bg-pdam-navy font-bold text-white sm:w-9">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Status Sesi */}
        <div
          className={`hidden items-center justify-center sm:flex ${
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
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : isLoggedIn ? (
            <CircleCheck className="h-4 w-4" />
          ) : (
            <CircleAlert className="h-4 w-4" />
          )}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          disabled={loadingUser || !isLoggedIn}
          className="btn btn-ghost btn-sm ml-1 rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          title="Keluar dari Sistem"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
