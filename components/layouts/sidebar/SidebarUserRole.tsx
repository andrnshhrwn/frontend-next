"use client";

import type { UserRole } from "@/services/authService";

interface SidebarUserRoleProps {
  user: {
    role: UserRole;
  } | null;
  isCollapsed: boolean;
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "admin_pusat":
      return "Akses: Seluruh Unit";

    case "admin_cabang":
      return "Akses: Unit Cabang";

    case "teknisi":
      return "Akses: Penugasan Saya";

    default:
      return "Akses Pengguna";
  }
}

function getRoleStyle(role: UserRole): string {
  switch (role) {
    case "admin_pusat":
      return "bg-pdam-primary/10 text-pdam-primary";

    case "admin_cabang":
      return "bg-pdam-navy/10 text-pdam-navy";

    case "teknisi":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getRoleIndicatorStyle(role: UserRole): string {
  switch (role) {
    case "admin_pusat":
      return "bg-pdam-primary";

    case "admin_cabang":
      return "bg-pdam-navy";

    case "teknisi":
      return "bg-amber-500";

    default:
      return "bg-slate-400";
  }
}

export default function SidebarUserRole({
  user,
  isCollapsed,
}: SidebarUserRoleProps) {
  if (isCollapsed || !user) {
    return null;
  }

  return (
    <div className="border-b border-slate-100 px-4 py-3">
      <div
        className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-semibold
          ${getRoleStyle(user.role)}`}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full
            ${getRoleIndicatorStyle(user.role)}`}
        />

        <span className="truncate">{getRoleLabel(user.role)}</span>
      </div>
    </div>
  );
}
