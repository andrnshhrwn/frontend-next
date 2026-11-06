"use client";

import { ClipboardList, FileCheck } from "lucide-react";

import type { DashboardStatusSectionProps } from "@/types/dashboard.types";

import {
  calculateDashboardPercentage,
  formatDashboardNumber,
  formatDashboardPeriod,
} from "@/utils/dashboard.utils";

const SPK_STATUS_STYLES = [
  {
    label: "Pending",
    description: "Menunggu disposisi teknisi cabang",
    key: "pending",
    color: "bg-slate-400",
    badge: "bg-slate-100 text-slate-700",
  },
  {
    label: "Proses",
    description: "Sedang dikerjakan teknisi",
    key: "proses",
    color: "bg-pdam-primary",
    badge: "bg-pdam-primary/10 text-pdam-primary",
  },
  {
    label: "Selesai",
    description: "Penugasan telah diselesaikan",
    key: "selesai",
    color: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Dibatalkan",
    description: "Penugasan dibatalkan",
    key: "dibatalkan",
    color: "bg-red-500",
    badge: "bg-red-50 text-red-700",
  },
] as const;

const BAP_STATUS_STYLES = [
  {
    label: "Menunggu",
    key: "menunggu",
    badge: "bg-amber-50 text-amber-700",
  },
  {
    label: "Disetujui",
    key: "disetujui",
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Ditolak",
    key: "ditolak",
    badge: "bg-red-50 text-red-700",
  },
] as const;

export default function DashboardStatusSection({
  spk,
  bap,
  selectedPeriod,
}: DashboardStatusSectionProps) {
  const totalSpk = spk.total;

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {/* Status SPK */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-pdam-navy">
              <ClipboardList className="h-4 w-4 text-pdam-primary" />
              Status Penugasan (SPK)
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Rekap berdasarkan tanggal penugasan
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500">
            {formatDashboardPeriod(selectedPeriod)}
          </span>
        </div>

        <div className="space-y-4">
          {SPK_STATUS_STYLES.map((status) => {
            const count = spk[status.key];
            const percentage = calculateDashboardPercentage(count, totalSpk);

            return (
              <div key={status.key}>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${status.color}`}
                      />
                      {status.label}
                    </p>

                    <p className="ml-4.5 mt-0.5 text-[11px] text-slate-400">
                      {status.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-bold tabular-nums text-pdam-navy">
                      {formatDashboardNumber(count)}
                    </span>

                    <span
                      className={`min-w-10 rounded-sm px-1.5 py-1 text-center text-[10px] font-semibold ${status.badge}`}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-sm bg-slate-100">
                  <div
                    className={`h-full transition-all duration-500 ${status.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          Total SPK:{" "}
          <strong className="font-bold text-pdam-navy">
            {formatDashboardNumber(totalSpk)}
          </strong>
        </div>
      </div>

      {/* Status BAP */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-pdam-navy">
              <FileCheck className="h-4 w-4 text-pdam-primary" />
              Status Validasi Penggantian WM
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Rekap berdasarkan tanggal penggantian
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500">BAP</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {BAP_STATUS_STYLES.map((status) => {
            const count = bap[status.key];

            return (
              <div
                key={status.key}
                className="rounded-md border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-[11px] font-medium text-slate-500">
                  {status.label}
                </p>

                <p className="mt-2 text-2xl font-bold tabular-nums text-pdam-navy">
                  {formatDashboardNumber(count)}
                </p>

                <span
                  className={`mt-2 inline-block rounded-sm px-1.5 py-1 text-[10px] font-semibold ${status.badge}`}
                >
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">Total penggantian WM</span>

            <strong className="font-bold text-pdam-navy">
              {formatDashboardNumber(bap.total)}
            </strong>
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            Realisasi resmi dihitung dari BAP yang disetujui.
          </p>
        </div>
      </div>
    </section>
  );
}
