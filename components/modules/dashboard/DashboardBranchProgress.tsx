"use client";

import { Building2, Info } from "lucide-react";

import type { DashboardBranchProgressProps } from "@/types/dashboard.types";

import {
  calculateDashboardPercentage,
  formatDashboardNumber,
  formatDashboardPeriod,
} from "@/utils/dashboard.utils";

export default function DashboardBranchProgress({
  branches,
  totalRealisasi,
  selectedPeriod,
}: DashboardBranchProgressProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-pdam-navy">
            <Building2 className="h-4 w-4 text-pdam-primary" />
            Progres Penggantian Unit
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Berdasarkan BAP yang disetujui pada{" "}
            {formatDashboardPeriod(selectedPeriod)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold tabular-nums text-pdam-navy">
            {formatDashboardNumber(totalRealisasi)}
          </p>

          <p className="text-[10px] text-slate-500">Total realisasi</p>
        </div>
      </div>

      <div className="space-y-4">
        {branches.map((branch) => {
          const share = calculateDashboardPercentage(
            branch.realisasi,
            totalRealisasi,
          );

          return (
            <div
              key={branch.id_unit}
              className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-pdam-navy">
                  {branch.nama_unit}
                </span>

                <span className="text-xs font-bold tabular-nums text-slate-700">
                  {formatDashboardNumber(branch.realisasi)}
                  <span className="ml-1 font-normal text-slate-400">
                    BAP disetujui
                  </span>
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-sm bg-slate-100">
                <div
                  className="h-full bg-pdam-primary transition-all duration-500"
                  style={{ width: `${Math.min(share, 100)}%` }}
                />
              </div>

              <p className="mt-1.5 text-[11px] text-slate-400">
                {totalRealisasi > 0
                  ? `${share}% dari total realisasi pada hasil filter`
                  : "Belum ada BAP disetujui pada periode ini"}
              </p>
            </div>
          );
        })}

        {branches.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">
            Tidak ada unit yang tersedia.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Info className="h-4 w-4 shrink-0 text-slate-400" />

          <span>
            Total realisasi tervalidasi:{" "}
            <strong className="text-pdam-navy">
              {formatDashboardNumber(totalRealisasi)} BAP
            </strong>
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Periode:{" "}
          <strong className="font-semibold text-pdam-navy">
            {formatDashboardPeriod(selectedPeriod)}
          </strong>
        </p>
      </div>
    </section>
  );
}
