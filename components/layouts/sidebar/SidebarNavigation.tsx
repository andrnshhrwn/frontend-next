"use client";

import Link from "next/link";
import {
  LayoutGrid,
  Droplet,
  Users,
  ClipboardList,
  BadgeCheck,
  Receipt,
  Building2,
  Wrench,
  UserCog,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/services/authService";

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

interface SidebarNavigationProps {
  pathname: string;
  isCollapsed: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
  closeMobileSidebar: () => void;
}

const MENU_GROUPS: MenuGroup[] = [
  {
    groupLabel: "Menu Utama",
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
    groupLabel: "Kelola Data",
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
        allowedRoles: ["admin_pusat"],
      },
    ],
  },
  {
    groupLabel: "Master Data",
    items: [
      {
        name: "Unit",
        href: "/master-data/unit",
        icon: Building2,
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

export default function SidebarNavigation({
  pathname,
  isCollapsed,
  hasRole,
  closeMobileSidebar,
}: SidebarNavigationProps) {
  const visibleGroups = MENU_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasRole(...item.allowedRoles)),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="w-full space-y-5 p-3">
      {visibleGroups.map((group) => (
        <div key={group.groupLabel} className="w-full">
          {!isCollapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-pdam-navy/50">
              {group.groupLabel}
            </p>
          )}

          <nav className="flex w-full flex-col gap-1">
            {group.items.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  title={isCollapsed ? item.name : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center rounded-sm font-semibold transition-all duration-200
                    ${
                      isCollapsed
                        ? "mx-auto h-10 w-10 justify-center p-0"
                        : "w-full gap-3 px-3.5 py-2.5"
                    }
                    ${
                      isActive
                        ? "bg-pdam-primary text-white shadow-sm shadow-pdam-primary/25"
                        : "text-slate-600 hover:bg-pdam-bg hover:text-pdam-navy"
                    }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  {!isCollapsed && (
                    <span className="truncate whitespace-nowrap text-sm">
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
  );
}
