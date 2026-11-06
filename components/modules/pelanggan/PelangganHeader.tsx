"use client";

import { RefreshCw, UserPlus } from "lucide-react";

import type { PelangganHeaderProps } from "@/types/pelanggan.types";

export function PelangganHeader({
  isLoading,
  canCreate,
  onImport,
  onCreate,
}: PelangganHeaderProps) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">
        <span className="font-semibold text-pdam-primary">
          PAM Tirta Kamuning
        </span>{" "}
        / Master Data /{" "}
        <span className="text-pdam-primary font-semibold">Data Pelanggan</span>
      </p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Manajemen Data Pelanggan
            </h1>

            <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
              Master Data Pusat
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan master data pelanggan terpusat. Data nomor seri WM aktif
            akan diperbarui melalui proses validasi BAP penggantian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onImport}
            disabled={isLoading}
            className="btn btn-sm btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-primary hover:text-white normal-case font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
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
      </div>
    </div>
  );
}
