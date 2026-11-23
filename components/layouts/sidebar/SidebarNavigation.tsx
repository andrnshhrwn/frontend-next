"use client";

import { useEffect, useState } from "react";
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
  Truck,
  FileText,
  FileCheck2,
  Database,
  FolderKanban,
  BarChart3,
  ChevronDown,
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
  /** Label singkat saat sidebar ciut (opsional, fallback ke groupLabel) */
  shortLabel?: string;
  icon: LucideIcon;
  /** Grup tanpa dropdown: tampil sebagai satu item langsung */
  single?: boolean;
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
    shortLabel: "Utama",
    icon: LayoutGrid,
    single: true,
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutGrid,
        allowedRoles: ["admin_pusat", "admin_cabang", "pimpinan"],
      },
    ],
  },
  {
    groupLabel: "Kelola Data",
    shortLabel: "Data",
    icon: FolderKanban,
    items: [
      {
        name: "Distribusi WM",
        href: "/pengiriman-wm",
        icon: Truck,
        allowedRoles: ["admin_pusat", "admin_cabang"],
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
        icon: FileText,
        allowedRoles: ["admin_pusat", "admin_cabang"],
      },
      {
        name: "Validasi BAP",
        href: "/validasi",
        icon: FileCheck2,
        allowedRoles: ["admin_pusat", "admin_cabang"],
      },
    ],
  },
  {
    groupLabel: "Laporan",
    shortLabel: "Laporan",
    icon: BarChart3,
    items: [
      {
        name: "Pengiriman WM",
        href: "/laporan/pengiriman-wm",
        icon: Truck,
        allowedRoles: ["admin_pusat", "admin_cabang", "pimpinan"],
      },
      {
        name: "Penugasan",
        href: "/laporan/penugasan",
        icon: FileText,
        allowedRoles: ["admin_pusat", "admin_cabang", "pimpinan"],
      },
      {
        name: "Penggantian WM",
        href: "/laporan/penggantian-wm",
        icon: FileCheck2,
        allowedRoles: ["admin_pusat", "admin_cabang", "pimpinan"],
      },
    ],
  },
  {
    groupLabel: "Master Data",
    shortLabel: "Master",
    icon: Database,
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
        allowedRoles: ["admin_pusat", "admin_cabang"],
      },
    ],
  },
];

const isItemActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const isGroupActive = (group: MenuGroup, pathname: string) =>
  group.items.some((item) => isItemActive(pathname, item.href));

const slug = (label: string) => label.toLowerCase().replace(/\s+/g, "-");

// ==================================================
// Style token (konsisten dengan tema PDAM)
// ==================================================
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdam-primary/50 focus-visible:ring-offset-1";

// Item aktif level atas (Dashboard) & mode ciut: solid
const solidActive = `bg-pdam-primary text-white shadow-sm shadow-pdam-primary/25 ${focusRing}`;

// Item aktif di dalam grup: lembut + penanda di garis pohon
const softActive = `bg-pdam-primary/10 text-pdam-primary font-semibold ${focusRing}`;

const idle = `text-slate-600 hover:bg-pdam-bg hover:text-pdam-navy ${focusRing}`;

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

  const activeGroupLabel = visibleGroups.find(
    (g) => !g.single && isGroupActive(g, pathname),
  )?.groupLabel;

  // Buka grup aktif saat pertama render; user tetap bisa buka/tutup manual
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    activeGroupLabel ? { [activeGroupLabel]: true } : {},
  );

  // Setelah navigasi ke halaman di grup lain, grup tersebut otomatis terbuka
  useEffect(() => {
    if (!activeGroupLabel) return;
    setOpenGroups((prev) =>
      prev[activeGroupLabel] ? prev : { ...prev, [activeGroupLabel]: true },
    );
  }, [activeGroupLabel, pathname]);

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  // ==================================================
  // MODE CIUT (desktop): ikon langsung, dipisah per grup
  // ==================================================
  if (isCollapsed) {
    return (
      <nav aria-label="Navigasi utama" className="w-full p-2.5">
        <div className="flex flex-col gap-2">
          {visibleGroups.map((group, groupIndex) => (
            <div key={group.groupLabel} className="flex flex-col gap-1">
              {groupIndex > 0 && (
                <div className="mx-2 mb-1 border-t border-slate-200" />
              )}

              {!group.single && (
                <span
                  title={group.groupLabel}
                  className="select-none truncate px-1 text-center text-[10px] font-bold uppercase tracking-wider text-pdam-navy/50"
                >
                  {group.shortLabel ?? group.groupLabel}
                </span>
              )}

              <ul className="flex flex-col items-center gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(pathname, item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch
                        onClick={closeMobileSidebar}
                        title={item.name}
                        aria-label={item.name}
                        aria-current={active ? "page" : undefined}
                        className={`flex h-10 w-10 items-center justify-center rounded-sm transition-all duration-150 ${
                          active ? solidActive : `${idle} hover:scale-105`
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    );
  }

  // ==================================================
  // MODE PENUH: accordion dengan animasi
  // ==================================================
  return (
    <nav aria-label="Navigasi utama" className="w-full p-3">
      <ul className="flex flex-col gap-1">
        {visibleGroups.map((group) => {
          const GroupIcon = group.icon;
          const groupActive = isGroupActive(group, pathname);

          // Item tunggal (Dashboard)
          if (group.single) {
            const item = group.items[0];
            const Icon = item.icon;

            return (
              <li key={group.groupLabel}>
                <Link
                  href={item.href}
                  prefetch
                  onClick={closeMobileSidebar}
                  aria-current={groupActive ? "page" : undefined}
                  className={`flex min-h-10 items-center gap-3 rounded-sm px-3 text-sm font-semibold transition-colors ${
                    groupActive ? solidActive : idle
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            );
          }

          const open = !!openGroups[group.groupLabel];
          const panelId = `nav-group-${slug(group.groupLabel)}`;

          return (
            <li key={group.groupLabel}>
              <button
                type="button"
                onClick={() => toggleGroup(group.groupLabel)}
                aria-expanded={open}
                aria-controls={panelId}
                className={`flex min-h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-sm font-semibold transition-colors ${focusRing} ${
                  groupActive
                    ? "text-pdam-primary hover:bg-pdam-bg"
                    : "text-slate-600 hover:bg-pdam-bg hover:text-pdam-navy"
                }`}
              >
                <GroupIcon className="h-5 w-5 shrink-0" />
                <span className="flex-1 truncate">{group.groupLabel}</span>

                {/* Penanda: grup berisi halaman aktif tetapi sedang ditutup */}
                {groupActive && !open && (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-pdam-primary"
                  />
                )}

                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Animasi buka/tutup tanpa perlu mengukur tinggi */}
              <div
                id={panelId}
                role="group"
                aria-label={group.groupLabel}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="ml-5.5 mt-1 flex flex-col gap-0.5 border-l border-slate-200 pb-1 pl-3">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isItemActive(pathname, item.href);

                      return (
                        <li key={item.href} className="relative">
                          {active && (
                            <span
                              aria-hidden="true"
                              className="absolute -left-3.25 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-pdam-primary"
                            />
                          )}
                          <Link
                            href={item.href}
                            prefetch
                            tabIndex={open ? 0 : -1}
                            onClick={closeMobileSidebar}
                            aria-current={active ? "page" : undefined}
                            className={`flex min-h-8 items-center gap-3 rounded-xs px-3 text-xs font-medium transition-colors ${
                              active ? softActive : idle
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
