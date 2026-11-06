"use client";

import { Search } from "lucide-react";

import type { PelangganFiltersProps } from "@/types/pelanggan.types";
import { selectCls } from "@/utils/pelanggan.utils";

export function PelangganFilters({
  tab,
  onTabChange,
  search,
  onSearchChange,
  cabangFilter,
  onCabangFilterChange,
  tarifFilter,
  onTarifFilterChange,
  units,
  tariffs,
}: PelangganFiltersProps) {
  const tabs = [
    { v: "semua", label: "Semua Pelanggan" },
    { v: "tercatat", label: "Nomor Seri Tercatat" },
    {
      v: "belum_tercatat",
      label: "Nomor Seri Belum Tercatat",
    },
  ] as const;

  return (
    <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
        {tabs.map((item) => (
          <button
            type="button"
            key={item.v}
            onClick={() => onTabChange(item.v)}
            className={`btn btn-sm font-medium normal-case ${
              tab === item.v
                ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0 shadow-xs"
                : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari ID Pelanggan, Nama, Alamat, atau No. Seri WM..."
          className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          className={selectCls}
          value={cabangFilter}
          onChange={(e) => onCabangFilterChange(e.target.value)}
        >
          <option value="">Semua Unit Cabang</option>

          {units.map((unit) => (
            <option key={unit.id_unit} value={unit.id_unit}>
              {unit.nama_unit}
            </option>
          ))}
        </select>

        <select
          className={selectCls}
          value={tarifFilter}
          onChange={(e) => onTarifFilterChange(e.target.value)}
        >
          <option value="">Semua Golongan Tarif</option>

          {tariffs.map((tarif) => (
            <option key={tarif.id_tarif} value={tarif.id_tarif}>
              {tarif.nama_tarif}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
