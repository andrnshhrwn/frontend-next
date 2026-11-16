import { RefreshCw, Shield, Users } from "lucide-react";
import type { UserTab } from "@/types/user.types";

interface UserTabsProps {
  activeTab: UserTab;
  totalUsers: number;
  refreshing: boolean;
  isAdminPusat: boolean;
  onTabChange: (tab: UserTab) => void;
  onRefresh: () => void;
}

export default function UserTabs({
  activeTab,
  totalUsers,
  refreshing,
  isAdminPusat,
  onTabChange,
  onRefresh,
}: UserTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-pdam-primary/5 border border-pdam-primary/15">
        <button
          type="button"
          onClick={() => onTabChange("user")}
          className={`btn btn-sm normal-case font-semibold border-0 gap-2 ${
            activeTab === "user"
              ? "bg-white text-pdam-primary shadow-xs"
              : "bg-transparent text-slate-600 hover:bg-white/60"
          }`}
        >
          <Users className="w-4 h-4" />
          Manajemen Pengguna
          <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">
            {totalUsers}
          </span>
        </button>

        {isAdminPusat && (
          <button
            type="button"
            onClick={() => onTabChange("role")}
            className={`btn btn-sm normal-case font-semibold border-0 gap-2 ${
              activeTab === "role"
                ? "bg-white text-pdam-primary shadow-xs"
                : "bg-transparent text-slate-600 hover:bg-white/60"
            }`}
          >
            <Shield className="w-4 h-4" />
            Role & Permissions
            <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">
              3 Peran
            </span>
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="btn btn-sm btn-ghost text-xs normal-case text-slate-500"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
        />
        {refreshing ? "Memuat..." : "Refresh data"}
      </button>
    </div>
  );
}
