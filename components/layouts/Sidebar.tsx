"use client";

import { usePathname } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarUserRole from "./sidebar/SidebarUserRole";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  closeMobileSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  const { hasRole, user } = useAuth();

  return (
    <aside
      className={`z-30 flex h-full shrink-0 flex-col justify-between overflow-x-hidden border-r border-slate-200/90 bg-white transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="w-full">
        <SidebarHeader
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          closeMobileSidebar={closeMobileSidebar}
        />

        <SidebarUserRole user={user} isCollapsed={isCollapsed} />

        <SidebarNavigation
          pathname={pathname}
          isCollapsed={isCollapsed}
          hasRole={hasRole}
          closeMobileSidebar={closeMobileSidebar}
        />
      </div>

      {isCollapsed && (
        <div className="hidden justify-center border-t border-slate-100 p-4 lg:flex">
          <button
            type="button"
            onClick={toggleSidebar}
            className="btn btn-ghost btn-sm btn-square text-slate-500 hover:bg-pdam-bg hover:text-pdam-navy"
            title="Perluas sidebar"
            aria-label="Perluas sidebar"
          >
            <span className="sr-only">Perluas sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
              <path d="m14 9 3 3-3 3" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
