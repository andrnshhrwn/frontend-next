"use client";

import { Download, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui";

interface UserHeaderProps {
  onExport: () => void;
  onCreate: () => void;
  exportDisabled: boolean;
  isAdminPusat: boolean;
  isAdminCabang: boolean;
}

export default function UserHeader({
  onExport,
  onCreate,
  exportDisabled,
  isAdminPusat,
  isAdminCabang,
}: UserHeaderProps) {
  const canManageUsers = isAdminPusat || isAdminCabang;
  const createLabel = isAdminCabang ? "Tambah Teknisi" : "Tambah Pengguna";

  return (
    <PageHeader
      title="Pengaturan Pengguna & Hak Akses"
      subtitle={
        isAdminCabang
          ? "Kelola data teknisi yang terdaftar pada unit cabang Anda."
          : "Kelola akun Admin Pusat, Admin Cabang, dan Teknisi berdasarkan pembagian hak akses sistem."
      }
      badge=""
      badgeVariant="primary"
    >
      {canManageUsers && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            disabled={exportDisabled}
            className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs justify-center"
          >
            <Download className="w-4 h-4 text-pdam-primary" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onCreate}
            className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs justify-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>{createLabel}</span>
          </button>
        </div>
      )}
    </PageHeader>
  );
}
