"use client";

import { Import, UserPlus } from "lucide-react";

import type { PelangganHeaderProps } from "@/types/pelanggan.types";
import { PageHeader } from "@/components/ui";

export function PelangganHeader({
  isLoading,
  canCreate,
  onImport,
  onCreate,
}: PelangganHeaderProps) {
  return (
    <div className="flex-1">
      <PageHeader
        title="Manajemen Data Pelanggan"
        subtitle="Pengelolaan data pelanggan."
        badge=""
        badgeVariant="primary"
      >
        <div className="flex flex-wrap items-end gap-2">
          <button
            type="button"
            onClick={onImport}
            disabled={isLoading}
            className="btn btn-sm btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-navy hover:border-pdam-navy hover:text-white normal-case font-semibold"
          >
            <Import className="w-4 h-4" />
            Import Excel
          </button>

          <button
            type="button"
            onClick={onCreate}
            disabled={isLoading || !canCreate}
            className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pelanggan Baru</span>
          </button>
        </div>
      </PageHeader>
    </div>
  );
}
