'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const openMobileSidebar = () => setIsMobileOpen(true);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <div className="drawer lg:drawer-open h-screen w-screen overflow-hidden bg-pdam-bg font-sans">
      <input 
        id="dashboard-drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isMobileOpen}
        onChange={(e) => setIsMobileOpen(e.target.checked)}
      />
      
      {/* Drawer Content Area */}
      <div className="drawer-content flex flex-col h-full min-w-0 overflow-hidden bg-pdam-bg">
        <Header 
          toggleSidebar={toggleSidebar} 
          openMobileSidebar={openMobileSidebar} 
          isCollapsed={isCollapsed} 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-pdam-bg">
          <div className="max-w-350 w-full mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Drawer Side (Sidebar) */}
      <div className="drawer-side z-40">
        <label 
          htmlFor="dashboard-drawer" 
          aria-label="close sidebar" 
          className="drawer-overlay"
          onClick={closeMobileSidebar}
        ></label>
        <Sidebar 
          isCollapsed={isCollapsed} 
          toggleSidebar={toggleSidebar}
          closeMobileSidebar={closeMobileSidebar}
        />
      </div>
    </div>
  );
}