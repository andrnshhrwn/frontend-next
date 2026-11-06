"use client";

import { Search } from "lucide-react";

import type { StatusFilter } from "@/types/validasi.types";

interface ValidasiFiltersProps {
  statusFilter: StatusFilter;
  search: string;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (value: string) => void;
}

const filters: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: "Semua Status", value: "Semua" },
  { label: "Menunggu", value: "menunggu" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Ditolak", value: "ditolak" },
];

export default function ValidasiFilters({
  statusFilter,
  search,
  onStatusChange,
  onSearchChange,
}: ValidasiFiltersProps) {
  return (
    <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onStatusChange(filter.value)}
            className={`btn btn-sm font-medium normal-case ${
              statusFilter === filter.value
                ? "bg-pdam-primary text-white border-0 shadow-xs"
                : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari SPK, pelanggan, teknisi, atau nomor seri WM..."
          className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
        />
      </div>
    </div>
  );
}
