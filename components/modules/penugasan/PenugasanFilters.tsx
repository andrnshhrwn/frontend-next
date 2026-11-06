"use client";

import { RotateCcw, Search } from "lucide-react";

import type { StatusFilter, StatusFilterOption } from "@/types/penugasan.types";

interface PenugasanFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  cabangFilter: string;
  onCabangFilterChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  tabs: StatusFilterOption[];
  units: string[];
  isAdminPusat: boolean;
  isAdminCabang: boolean;
  unitName: string;
  onReset: () => void;
}

export default function PenugasanFilters({
  search,
  onSearchChange,
  cabangFilter,
  onCabangFilterChange,
  statusFilter,
  onStatusFilterChange,
  tabs,
  units,
  isAdminPusat,
  isAdminCabang,
  unitName,
  onReset,
}: PenugasanFiltersProps) {
  return (
    <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari ID Penugasan, Pelanggan, ID Pelanggan, Unit..."
            className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
          />
        </div>

        <select
          value={cabangFilter}
          onChange={(event) => onCabangFilterChange(event.target.value)}
          disabled={isAdminCabang}
          className="select select-bordered select-sm w-full text-xs font-semibold border-slate-200 bg-white text-slate-700"
        >
          <option value="">{isAdminPusat ? "Semua Unit" : unitName}</option>

          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onStatusFilterChange(tab.value)}
              className={`btn btn-sm font-medium normal-case ${
                statusFilter === tab.value
                  ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0 shadow-xs"
                  : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <button
          onClick={onReset}
          className="btn btn-sm btn-ghost text-xs text-slate-400 hover:text-pdam-navy gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
