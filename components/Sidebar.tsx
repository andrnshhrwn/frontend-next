'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Droplet,
  Users,
  ClipboardList,
  BadgeCheck,
  Receipt,
  Wrench,
  UserCog,
  PanelLeftClose,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuth, type Permission } from '@/components/providers/AuthProvider';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  /** Permission yang harus dimiliki agar menu ini terlihat */
  requiredPermission: Permission;
}

interface MenuGroup {
  groupLabel: string;
  items: MenuItem[];
}

/**
 * Sidebar Navigasi dengan menu yang difilter berdasarkan role user.
 *
 * Menu visibility rules (sesuai PRD RBAC):
 * - Admin Pusat:  Semua menu terlihat
 * - Admin Cabang: Dashboard, Water Meter, Pelanggan, Penugasan, Validasi + Data Tarif & Merk (read-only), Data User (read-only)
 * - Teknisi:      Dashboard + Penugasan saja
 */
export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  closeMobileSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission, user } = useAuth();

  // Pengelompokan Menu sesuai desain — difilter oleh RBAC
  const menuGroups: MenuGroup[] = [
    {
      groupLabel: 'MENU UTAMA',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid, requiredPermission: 'dashboard:view' },
      ],
    },
    {
      groupLabel: 'KELOLA DATA',
      items: [
        { name: 'Water Meter', href: '/water-meter', icon: Droplet, requiredPermission: 'water-meter:view' },
        { name: 'Pelanggan', href: '/pelanggan', icon: Users, requiredPermission: 'pelanggan:view' },
        { name: 'Penugasan', href: '/penugasan', icon: ClipboardList, requiredPermission: 'penugasan:view' },
        { name: 'Validasi', href: '/validasi', icon: BadgeCheck, requiredPermission: 'validasi:view' },
      ],
    },
    {
      groupLabel: 'MASTER DATA',
      items: [
        { name: 'Data Tarif', href: '/data-tarif', icon: Receipt, requiredPermission: 'data-tarif:view' },
        { name: 'Data Merk WM', href: '/data-merk-wm', icon: Wrench, requiredPermission: 'data-merk-wm:view' },
        { name: 'Data User', href: '/data-user', icon: UserCog, requiredPermission: 'data-user:view' },
      ],
    },
  ];

  // Filter menu berdasarkan permission user
  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(item.requiredPermission)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-full transition-all duration-300 z-30 overflow-x-hidden ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="w-full">
        {/* Header Sidebar (Logo PDAM Tirta) */}
        <div className={`h-16 px-4 flex items-center border-b border-slate-200/90 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-pdam-primary flex items-center justify-center text-white shadow-sm shadow-pdam-primary/25 shrink-0">
              <Droplet className="w-5 h-5 fill-current" />
            </div>

            {!isCollapsed && (
              <div className="whitespace-nowrap transition-opacity duration-200">
                <h1 className="font-bold text-sm leading-tight text-pdam-navy">PAM Tirta Kamuning</h1>
                <p className="text-[11px] text-slate-400 font-medium">Sistem Pergantian WM</p>
              </div>
            )}
          </div>

          {/* Tombol Close khusus Mobile */}
          <button
            onClick={closeMobileSidebar}
            className="btn btn-ghost btn-sm btn-square lg:hidden text-slate-500 hover:text-pdam-navy hover:bg-pdam-bg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tombol Collapse Desktop */}
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm btn-square hidden lg:inline-flex shrink-0 text-slate-500 hover:text-pdam-navy hover:bg-pdam-bg"
              title="Tutup Sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Indikator Role aktif */}
        {!isCollapsed && user && (
          <div className="px-4 py-2.5 border-b border-slate-100">
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold ${
              user.role === 'admin_pusat'
                ? 'bg-pdam-primary/10 text-pdam-primary'
                : user.role === 'admin_cabang'
                ? 'bg-pdam-navy/10 text-pdam-navy'
                : 'bg-amber-50 text-amber-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                user.role === 'admin_pusat'
                  ? 'bg-pdam-primary'
                  : user.role === 'admin_cabang'
                  ? 'bg-pdam-navy'
                  : 'bg-amber-500'
              }`} />
              {user.role === 'admin_pusat' && 'Akses: Seluruh Unit'}
              {user.role === 'admin_cabang' && `Akses: ${user.unit_kerja?.nama_unit || 'Unit Cabang'}`}
              {user.role === 'teknisi' && 'Akses: Penugasan Saya'}
            </div>
          </div>
        )}

        {/* Daftar Navigasi Berkelompok — Filtered by RBAC */}
        <div className="p-3 w-full space-y-4">
          {visibleGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="w-full">
              {/* Label Grup (Tersembunyi bila Sidebar Collapsed) */}
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold text-pdam-navy/50 uppercase tracking-wider mb-2">
                  {group.groupLabel}
                </p>
              )}

              <nav className="flex flex-col gap-1 w-full">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMobileSidebar}
                      title={isCollapsed ? item.name : ''}
                      className={`flex items-center rounded-xl font-semibold transition-all duration-200 ${
                        isCollapsed
                          ? 'w-12 h-12 mx-auto justify-center p-0'
                          : 'w-full px-3.5 py-2.5 gap-3'
                      } ${
                        isActive
                          ? 'bg-pdam-primary text-white shadow-sm shadow-pdam-primary/25'
                          : 'text-slate-600 hover:bg-pdam-bg hover:text-pdam-navy'
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