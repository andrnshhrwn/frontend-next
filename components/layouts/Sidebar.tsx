"use client";

import { usePathname } from "next/navigation";

import { useAuthStore, useRoleChecker } from "@/lib/auth/auth-store";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarUserRole from "./sidebar/SidebarUserRole";
import SidebarNavigation from "./sidebar/SidebarNavigation";

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
  const user = useAuthStore((s) => s.user);
  const hasRole = useRoleChecker();

  return (
    <aside
      className={`flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-200/90 bg-white shadow-xl transition-[width] duration-200 ease-out lg:shadow-none ${
        isCollapsed ? "lg:w-19" : "lg:w-64"
      }`}
    >
      <SidebarHeader
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        closeMobileSidebar={closeMobileSidebar}
      />

      <SidebarUserRole user={user} isCollapsed={isCollapsed} />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <SidebarNavigation
          pathname={pathname}
          isCollapsed={isCollapsed}
          hasRole={hasRole}
          closeMobileSidebar={closeMobileSidebar}
        />
      </div>
    </aside>
  );
}
