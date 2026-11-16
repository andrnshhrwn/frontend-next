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
import { PageHeader } from "@/components/ui";

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
    <div className="flex-1 items-start justify-between gap-3">
      <PageHeader
        title="Monitoring Pergantian Water Meter"
        subtitle="Rekapitulasi SPK, penggantian WM, pengiriman, dan inventori."
        badge=""
        badgeVariant="primary"
      >
        <div className="relative flex flex-wrap items-center gap-2 justify-end">
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
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
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
            className="btn btn-sm rounded-md border-none bg-pdam-primary text-white hover:bg-pdam-navy disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Rekap / Cetak
          </button>
        </div>
      </PageHeader>
    </div>
  );
}
