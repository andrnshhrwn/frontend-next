"use client";

import { useState } from "react";
import {
  Calendar,
  SlidersHorizontal,
  Download,
  BarChart3,
  Check,
} from "lucide-react";

import type { DashboardHeaderProps } from "@/types/dashboard.types";
import { formatDashboardPeriod } from "@/utils/dashboard.utils";

export default function DashboardHeader({
  selectedPeriod,
  selectedBranch,
  currentBranchName,
  availableBranches,
  onPeriodChange,
  onBranchChange,
}: DashboardHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <section className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-pdam-primary/10 text-pdam-primary">
          <BarChart3 className="h-5 w-5" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-pdam-navy">
              Monitoring Pergantian Water Meter
            </h2>

            <span className="rounded-sm bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Data Backend
            </span>
          </div>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Rekapitulasi SPK, penggantian WM, pengiriman, dan inventori untuk
            periode{" "}
            <strong className="font-semibold text-pdam-navy">
              {formatDashboardPeriod(selectedPeriod)}
            </strong>
          </p>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-2">
        {/* Filter periode */}
        <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-slate-700 transition hover:bg-slate-50">
          <Calendar className="h-4 w-4 text-slate-500" />

          <input
            type="month"
            value={selectedPeriod}
            onChange={(event) => {
              if (event.target.value) {
                onPeriodChange(event.target.value);
              }
            }}
            className="w-31.25 bg-transparent text-xs font-semibold text-pdam-navy outline-none"
            aria-label="Pilih bulan dan tahun dashboard"
          />
        </label>

        {/* Filter unit */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen((current) => !current)}
            aria-expanded={isFilterOpen}
            className={`flex h-9 max-w-55 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition ${
              selectedBranch !== "all"
                ? "border-pdam-primary bg-pdam-primary text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />

            <span className="truncate">{currentBranchName}</span>
          </button>

          {isFilterOpen && (
            <>
              <button
                type="button"
                aria-label="Tutup filter unit"
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => setIsFilterOpen(false)}
              />

              <div className="absolute right-0 z-30 mt-2 w-64 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
                <div className="px-2 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Pilih Unit Cabang ({availableBranches.length})
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onBranchChange("all");
                    setIsFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition ${
                    selectedBranch === "all"
                      ? "bg-pdam-primary/10 font-semibold text-pdam-primary"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>Semua Unit Cabang ({availableBranches.length})</span>

                  {selectedBranch === "all" && (
                    <Check className="h-3.5 w-3.5 shrink-0" />
                  )}
                </button>

                <div className="my-1 border-t border-slate-100" />

                <div className="max-h-56 space-y-0.5 overflow-y-auto">
                  {availableBranches.map((branch) => (
                    <button
                      type="button"
                      key={branch.id_unit}
                      onClick={() => {
                        onBranchChange(branch.id_unit);
                        setIsFilterOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-xs transition ${
                        selectedBranch === branch.id_unit
                          ? "bg-pdam-primary/10 font-semibold text-pdam-primary"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate">
                          {branch.nama_unit}
                        </span>

                        <span className="mt-0.5 block text-[10px] font-normal text-slate-400">
                          ID Unit: {branch.id_unit}
                        </span>
                      </span>

                      {selectedBranch === branch.id_unit && (
                        <Check className="h-3.5 w-3.5 shrink-0" />
                      )}
                    </button>
                  ))}

                  {availableBranches.length === 0 && (
                    <p className="px-3 py-3 text-xs text-slate-400">
                      Tidak ada unit tersedia.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cetak */}
        <button
          type="button"
          onClick={() => window.print()}
          className="flex h-9 items-center gap-2 rounded-md border border-pdam-primary bg-pdam-primary px-3 text-xs font-semibold text-white transition hover:border-pdam-navy hover:bg-pdam-navy"
        >
          <Download className="h-3.5 w-3.5" />
          Rekap / Cetak
        </button>
      </div>
    </section>
  );
}
