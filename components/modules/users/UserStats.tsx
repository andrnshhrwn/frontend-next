import { Building2, ShieldCheck, UserCog, Users } from "lucide-react";
import { StatCard } from "@/components/ui";
import type { UserRoleCounts } from "@/types/user.types";

interface UserStatsProps {
  totalUsers: number;
  roleCounts: UserRoleCounts;
  isAdminPusat: boolean;
  isAdminCabang: boolean;
}

export default function UserStats({
  totalUsers,
  roleCounts,
  isAdminPusat,
  isAdminCabang,
}: UserStatsProps) {
  if (isAdminCabang) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Teknisi"
          value={roleCounts.teknisi}
          subtext="Teknisi pada unit Anda"
          icon={<UserCog className="w-5 h-5" />}
          variant="amber"
        />
      </div>
    );
  }

  if (!isAdminPusat) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Pengguna"
        value={totalUsers}
        subtext="Akun terdaftar"
        icon={<Users className="w-5 h-5" />}
        variant="primary"
      />

      <StatCard
        title="Admin Pusat"
        value={roleCounts.admin_pusat}
        subtext="Akses global"
        icon={<ShieldCheck className="w-5 h-5" />}
        variant="navy"
      />

      <StatCard
        title="Admin Cabang"
        value={roleCounts.admin_cabang}
        subtext="Akses unit masing-masing"
        icon={<Building2 className="w-5 h-5" />}
        variant="emerald"
      />

      <StatCard
        title="Teknisi"
        value={roleCounts.teknisi}
        subtext="Pengguna lapangan"
        icon={<UserCog className="w-5 h-5" />}
        variant="amber"
      />
    </div>
  );
}
