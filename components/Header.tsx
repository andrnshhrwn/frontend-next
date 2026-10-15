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
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        {/* Tombol Mobile Drawer */}
        <button 
          onClick={openMobileSidebar}
          className="btn btn-ghost btn-sm btn-square lg:hidden text-slate-600 hover:text-pdam-navy hover:bg-pdam-bg"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Tombol Collapse Desktop saat posisi tersembunyi */}
        {isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="btn btn-ghost btn-sm btn-square hidden lg:inline-flex text-slate-600 hover:text-pdam-navy hover:bg-pdam-bg"
            title="Buka Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-sm md:text-base font-bold leading-tight text-pdam-navy">
            Dashboard Manajemen Meter
          </h1>
          <p className="text-[11px] md:text-xs text-slate-500 truncate max-w-[180px] sm:max-w-none">
            <span className="font-semibold text-pdam-primary">PDAM Tirta</span> / Unit Penggantian / Ringkasan Wilayah
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-pdam-primary/30 text-pdam-primary bg-pdam-primary/10 font-bold text-[11px] sm:text-xs">
          <MapPin className="w-3.5 h-3.5 fill-current" />
          <span>Pusat</span>
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight text-pdam-navy">Hendra Prasetya</p>
            <p className="text-[10px] text-slate-400 font-medium">Admin Pusat</p>
          </div>
          <div className="avatar placeholder">
            <div className="bg-pdam-navy text-white rounded-full w-8 sm:w-9 flex items-center justify-center font-bold shadow-sm ring-2 ring-pdam-primary/20">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}