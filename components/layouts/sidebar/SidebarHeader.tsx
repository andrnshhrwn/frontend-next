"use client";

import { Droplet, PanelLeftClose, X } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

export default function SidebarHeader({
  isCollapsed,
  toggleSidebar,
  closeMobileSidebar,
}: SidebarHeaderProps) {
  return (
    <div
      className={`flex h-16 items-center border-b border-slate-200/90 px-3
        ${isCollapsed ? "justify-center" : "justify-between gap-3"}`}
    >
      <div
        className={`flex min-w-0 items-center gap-3
          ${isCollapsed ? "justify-center" : "flex-1"}`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-pdam-primary text-white shadow-sm shadow-pdam-primary/25">
          <Droplet className="h-5 w-5 fill-current" />
        </div>

        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[13px] font-bold leading-tight text-pdam-navy">
              PAM Tirta Kamuning
            </h1>

            <p className="truncate text-[10px] font-medium text-slate-400">
              Sistem Pergantian WM
            </p>
          </div>
        )}
      </div>

      {/* Mobile close button */}
      <button
        type="button"
        onClick={closeMobileSidebar}
        className="btn btn-ghost btn-sm btn-square hidden shrink-0 text-slate-500 hover:bg-pdam-bg hover:text-pdam-navy lg:hidden"
        aria-label="Tutup sidebar"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Desktop collapse button */}
      {!isCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="btn btn-ghost btn-sm btn-square hidden shrink-0 text-slate-500 hover:bg-pdam-bg hover:text-pdam-navy lg:inline-flex"
          title="Ciutkan sidebar"
          aria-label="Ciutkan sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
