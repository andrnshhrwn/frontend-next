"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Droplet,
  Users,
  ClipboardList,
  BadgeCheck,
  Receipt,
  BuildingComplex,
  Wrench,
  UserCog,
  PanelLeftClose,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import type { UserRole } from "@/services/authService";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
}

interface MenuGroup {
  groupLabel: string;
  items: MenuItem[];
}

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  closeMobileSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  const { hasRole, user } = useAuth();

  const menuGroups: MenuGroup[] = [
    {
      groupLabel: "MENU UTAMA",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutGrid,
          allowedRoles: ["admin_pusat", "admin_cabang"],
        },
      ],
    },
    {
      groupLabel: "KELOLA DATA",
      items: [
        {
          name: "Water Meter",
          href: "/distribusi-water-meter",
          icon: Droplet,
          allowedRoles: ["admin_pusat"],
        },
        {
          name: "Pelanggan",
          href: "/pelanggan",
          icon: Users,
          allowedRoles: ["admin_pusat"],
        },
        {
          name: "Penugasan",
          href: "/penugasan",
          icon: ClipboardList,
          allowedRoles: ["admin_pusat", "admin_cabang"],
        },
        {
          name: "Validasi",
          href: "/validasi",
          icon: BadgeCheck,
          allowedRoles: ["admin_pusat", "admin_cabang"],
        },
      ],
    },
    {
      groupLabel: "MASTER DATA",
      items: [
        {
          name: "Unit",
          href: "/master-data/unit",
          icon: BuildingComplex,
          allowedRoles: ["admin_pusat"],
        },
        {
          name: "Merk WM",
          href: "/master-data/merk-wm",
          icon: Wrench,
          allowedRoles: ["admin_pusat"],
        },
        {
          name: "Tarif",
          href: "/master-data/tarif",
          icon: Receipt,
          allowedRoles: ["admin_pusat"],
        },
        {
          name: "Data User",
          href: "/master-data/users",
          icon: UserCog,
          allowedRoles: ["admin_pusat"],
        },
      ],
    },
  ];

  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasRole(...item.allowedRoles)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-full transition-all duration-300 z-30 overflow-x-hidden ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="w-full">
        <div
          className={`h-16 px-4 flex items-center border-b gap-3 border-slate-200/90 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-pdam-primary flex items-center justify-center text-white shadow-sm shadow-pdam-primary/25 shrink-0">
              <Droplet className="w-5 h-5 fill-current" />
            </div>

            {!isCollapsed && (
              <div className="whitespace-nowrap transition-opacity duration-200">
                <h1 className="font-bold text-sm leading-tight text-pdam-navy">
                  PAM Tirta Kamuning
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">
                  Sistem Pergantian WM
                </p>
              </div>
            )}
          </div>

          <button
            onClick={closeMobileSidebar}
            className="btn btn-ghost btn-sm btn-square lg:hidden text-slate-500 hover:text-pdam-navy hover:bg-pdam-bg"
            aria-label="Tutup sidebar"
          >
            <X className="w-5 h-5" />
          </button>

          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm btn-square hidden lg:inline-flex shrink-0 text-slate-500 hover:text-pdam-navy hover:bg-pdam-bg"
              title="Tutup Sidebar"
              aria-label="Ciutkan sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {!isCollapsed && user && (
          <div className="px-4 py-2.5 border-b border-slate-100">
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold ${
                user.role === "admin_pusat"
                  ? "bg-pdam-primary/10 text-pdam-primary"
                  : user.role === "admin_cabang"
                    ? "bg-pdam-navy/10 text-pdam-navy"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  user.role === "admin_pusat"
                    ? "bg-pdam-primary"
                    : user.role === "admin_cabang"
                      ? "bg-pdam-navy"
                      : "bg-amber-500"
                }`}
              />

              {user.role === "admin_pusat" && "Akses: Seluruh Unit"}
              {user.role === "admin_cabang" && "Akses: Unit Cabang"}
              {user.role === "teknisi" && "Akses: Penugasan Saya"}
            </div>
          </div>
        )}

        <div className="p-3 w-full space-y-4">
          {visibleGroups.map((group) => (
            <div key={group.groupLabel} className="w-full">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold text-pdam-navy/50 uppercase tracking-wider mb-2">
                  {group.groupLabel}
                </p>
              )}

              <nav className="flex flex-col gap-1 w-full">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMobileSidebar}
                      title={isCollapsed ? item.name : undefined}
                      className={`flex items-center rounded-xl font-semibold transition-all duration-200 ${
                        isCollapsed
                          ? "w-12 h-12 mx-auto justify-center p-0"
                          : "w-full px-3.5 py-2.5 gap-3"
                      } ${
                        isActive
                          ? "bg-pdam-primary text-white shadow-sm shadow-pdam-primary/25"
                          : "text-slate-600 hover:bg-pdam-bg hover:text-pdam-navy"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />

                      {!isCollapsed && (
                        <span className="whitespace-nowrap text-sm truncate">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
