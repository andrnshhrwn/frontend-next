'use client';

import { MapPin, User, PanelLeft, Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  openMobileSidebar: () => void;
  isCollapsed: boolean;
}

export default function Header({ 
  toggleSidebar, 
  openMobileSidebar, 
  isCollapsed 
}: HeaderProps) {
  return (
    <header className="h-16 bg-base-100 border-b border-base-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        {/* Tombol Mobile Drawer */}
        <button 
          onClick={openMobileSidebar}
          className="btn btn-ghost btn-sm btn-square lg:hidden"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Tombol Collapse Desktop saat posisi tersembunyi */}
        {isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="btn btn-ghost btn-sm btn-square hidden lg:inline-flex"
            title="Buka Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-sm md:text-base font-bold leading-tight">
            Dashboard Manajemen Meter
          </h1>
          <p className="text-[11px] md:text-xs text-base-content/60 truncate max-w-[180px] sm:max-w-none">
            <span className="font-semibold text-primary">PDAM Tirta</span> / Unit Penggantian / Ringkasan Wilayah
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="badge badge-primary badge-outline gap-1 py-3 px-3 font-semibold text-[11px] sm:text-xs">
          <MapPin className="w-3.5 h-3.5 fill-current" />
          <span>Pusat</span>
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-base-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight">Hendra Prasetya</p>
            <p className="text-[10px] text-base-content/50">Admin Pusat</p>
          </div>
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-8 sm:w-9 flex items-center justify-center font-bold">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}