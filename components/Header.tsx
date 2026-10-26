'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, User, PanelLeft, Menu, LogOut } from 'lucide-react';
import { authService, type UserProfile } from '@/services/authService';

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem PAM Tirta Kamuning?')) {
      setLoggingOut(true);
      await authService.logout();
    }
  };

  const displayName = user?.nama_lengkap || 'Ahmad Fadillah, S.T.';
  const displayRole = user?.role === 'admin_pusat' 
    ? 'Admin Pusat (Global)' 
    : user?.role === 'admin_cabang' 
    ? 'Admin Cabang' 
    : user?.role === 'teknisi' 
    ? 'Teknisi Lapangan' 
    : 'Admin Pusat (Global)';
  const displayUnit = user?.unit_kerja?.nama_unit || 'Kantor Pusat Kuningan';

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
            Sistem Manajemen &amp; Pergantian Water Meter
          </h1>
          <p className="text-[11px] md:text-xs text-slate-500 truncate max-w-[180px] sm:max-w-none">
            <span className="font-semibold text-pdam-primary">PAM Tirta Kamuning</span> / Monitoring Terpusat 9 Unit Cabang
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-pdam-primary/30 text-pdam-primary bg-pdam-primary/10 font-bold text-[11px] sm:text-xs">
          <MapPin className="w-3.5 h-3.5 fill-current" />
          <span>{displayUnit}</span>
        </div>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight text-pdam-navy truncate max-w-[140px] md:max-w-none">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">{displayRole}</p>
          </div>

          <div className="avatar placeholder">
            <div className="bg-pdam-navy text-white rounded-full w-8 sm:w-9 flex items-center justify-center font-bold shadow-sm ring-2 ring-pdam-primary/20">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Tombol Logout Header */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn btn-sm btn-ghost text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition ml-1"
            title="Keluar dari Sistem (Logout)"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}