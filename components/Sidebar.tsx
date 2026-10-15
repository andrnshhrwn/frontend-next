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
  PanelLeft,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

export default function Sidebar({ 
  isCollapsed, 
  toggleSidebar, 
  closeMobileSidebar 
}: SidebarProps) {
  const pathname = usePathname();

  // Pengelompokan Menu sesuai desain Figma
  const menuGroups = [
    {
      groupLabel: 'MENU UTAMA',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
      ],
    },
    {
      groupLabel: 'KELOLA DATA',
      items: [
        { name: 'Water Meter', href: '/water-meter', icon: Droplet },
        { name: 'Pelanggan', href: '/pelanggan', icon: Users },
        { name: 'Penugasan (Pusat)', href: '/penugasan', icon: ClipboardList },
        { name: 'Validasi', href: '/validasi', icon: BadgeCheck },
      ],
    },
    {
      groupLabel: 'MASTER DATA',
      items: [
        { name: 'Data Tarif', href: '/data-tarif', icon: Receipt },
        { name: 'Data Merk WM', href: '/data-merk-wm', icon: Wrench },
        { name: 'Data User', href: '/data-user', icon: UserCog },
      ],
    },
  ];

  return (
    <aside 
      className={`bg-base-100 border-r border-base-200 flex flex-col justify-between shrink-0 h-full transition-all duration-300 z-30 overflow-x-hidden ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="w-full">
        {/* Header Sidebar (Logo PDAM Tirta) */}
        <div className={`h-16 px-4 flex items-center border-b border-base-200 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-sm shrink-0">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            
            {!isCollapsed && (
              <div className="whitespace-nowrap transition-opacity duration-200">
                <h1 className="font-bold text-sm leading-tight text-base-content">PDAM Tirta</h1>
                <p className="text-[11px] text-base-content/60">Sistem Meter Air</p>
              </div>
            )}
          </div>

          {/* Tombol Close khusus Mobile */}
          <button 
            onClick={closeMobileSidebar}
            className="btn btn-ghost btn-sm btn-square lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tombol Collapse Desktop */}
          {!isCollapsed && (
            <button 
              onClick={toggleSidebar} 
              className="btn btn-ghost btn-sm btn-square hidden lg:inline-flex shrink-0"
              title="Tutup Sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Daftar Navigasi Berkelompok */}
        <div className="p-3 w-full space-y-4">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="w-full">
              {/* Label Grup (Tersembunyi bila Sidebar Collapsed) */}
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold text-base-content/40 uppercase tracking-wider mb-2">
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
                          ? 'bg-primary text-primary-content shadow-sm' 
                          : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
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