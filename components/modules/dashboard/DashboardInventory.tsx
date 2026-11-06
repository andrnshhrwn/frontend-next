"use client";

import { Info, Package, Warehouse, Wrench, AlertTriangle } from "lucide-react";

import type { DashboardInventoryProps } from "@/types/dashboard.types";
import { StatCard } from "@/components/ui";

import {
  clampDashboardPercentage,
  formatDashboardNumber,
  formatDashboardPeriod,
} from "@/utils/dashboard.utils";

export default function DashboardInventory({
  inventory,
  selectedPeriod,
}: DashboardInventoryProps) {
  const totalDikirim = inventory?.total_wm_dikirim ?? 0;
  const totalTerpasang = inventory?.wm_terpasang_aktif ?? 0;
  const totalStok = inventory?.wm_stok ?? 0;
  const totalDicabut = inventory?.wm_dicabut ?? 0;

  const percentageTerpasang = inventory?.persentase_wm_terpasang ?? 0;
  const percentageStok = inventory?.persentase_wm_stok ?? 0;

  const stockIsNegative = totalStok < 0;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-pdam-navy">
            <Warehouse className="h-4 w-4 text-pdam-primary" />
            Ringkasan Inventori Water Meter
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Posisi pengiriman kumulatif dan pemasangan saat ini
          </p>
        </div>

        <span className="rounded-sm border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
          Estimasi stok
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total WM Dikirim"
          value={formatDashboardNumber(totalDikirim)}
          subtext="Akumulasi seluruh pengiriman"
          icon={<Package className="h-5 w-5" />}
          variant="navy"
          className="h-full"
        />

        <StatCard
          title="WM Terpasang"
          value={formatDashboardNumber(totalTerpasang)}
          subtext={`${percentageTerpasang}% dari total dikirim`}
          icon={<Wrench className="h-5 w-5" />}
          variant="emerald"
          className="h-full"
        />

        <StatCard
          title="Estimasi WM Stok"
          value={formatDashboardNumber(totalStok)}
          subtext={`${percentageStok}% dari total dikirim`}
          icon={<Warehouse className="h-5 w-5" />}
          variant={stockIsNegative ? "red" : "primary"}
          className="h-full"
        />

        <StatCard
          title="WM Dicabut"
          value={formatDashboardNumber(totalDicabut)}
          subtext={`Pencabutan fisik pada ${formatDashboardPeriod(selectedPeriod)}`}
          icon={<Package className="h-5 w-5" />}
          variant="amber"
          className="h-full"
        />
      </div>

      {/* Komposisi inventori */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-700">
            Komposisi WM dikirim
          </span>

          <span className="text-slate-500">
            {formatDashboardNumber(totalDikirim)} unit
          </span>
        </div>

        <div
          className="flex h-3 w-full overflow-hidden rounded-sm bg-slate-100"
          aria-label="Komposisi WM terpasang dan stok"
        >
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{
              width: `${clampDashboardPercentage(percentageTerpasang)}%`,
            }}
            title="WM terpasang"
          />

          <div
            className="h-full bg-pdam-primary transition-all"
            style={{
              width: `${clampDashboardPercentage(percentageStok)}%`,
            }}
            title="Estimasi WM stok"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-emerald-600" />
            Terpasang
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-pdam-primary" />
            Estimasi stok
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-amber-500" />
            Dicabut (indikator terpisah)
          </span>
        </div>
      </div>

      {stockIsNegative && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

          <p>
            Jumlah WM terpasang melebihi akumulasi WM dikirim. Periksa kembali
            data pengiriman atau pemasangan. Nilai stok negatif ditampilkan agar
            ketidaksesuaian data tidak tersembunyi.
          </p>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-blue-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />

        <p>
          Estimasi stok dihitung dari total WM yang pernah dikirim dikurangi WM
          yang saat ini terpasang. WM dicabut ditampilkan terpisah dan tidak
          mengurangi stok karena merupakan WM lama yang sebelumnya sudah
          terpasang. Estimasi ini mengasumsikan tidak ada kehilangan atau
          perpindahan WM yang belum tercatat.
        </p>
      </div>
    </section>
  );
}
