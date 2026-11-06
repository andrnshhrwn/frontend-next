"use client";

import { Users, ClipboardList, FileCheck, Package } from "lucide-react";

import type { DashboardSummaryCardsProps } from "@/types/dashboard.types";
import { StatCard } from "@/components/ui";

import {
  formatDashboardNumber,
  formatDashboardPeriod,
} from "@/utils/dashboard.utils";

export default function DashboardSummaryCards({
  summary,
  selectedPeriod,
}: DashboardSummaryCardsProps) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-pdam-navy">Ringkasan Utama</h3>

        <p className="mt-0.5 text-xs text-slate-500">
          Gambaran aktivitas berdasarkan periode dan unit terpilih.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Pelanggan"
          value={formatDashboardNumber(summary.total_pelanggan)}
          subtext="Pelanggan pada cakupan unit terpilih"
          icon={<Users className="h-5 w-5" />}
          variant="primary"
          className="h-full"
        />

        <StatCard
          title="Total SPK"
          value={formatDashboardNumber(summary.spk.total)}
          subtext={`SPK pada ${formatDashboardPeriod(selectedPeriod)}`}
          icon={<ClipboardList className="h-5 w-5" />}
          variant="amber"
          className="h-full"
        />

        <StatCard
          title="BAP Disetujui"
          value={formatDashboardNumber(summary.penggantian_wm.disetujui)}
          subtext="Realisasi tervalidasi"
          icon={<FileCheck className="h-5 w-5" />}
          variant="emerald"
          className="h-full"
        />

        <StatCard
          title="WM Dikirim"
          value={formatDashboardNumber(summary.pengiriman_wm.total_wm_dikirim)}
          subtext="Pengiriman pada periode terpilih"
          icon={<Package className="h-5 w-5" />}
          variant="navy"
          className="h-full"
        />
      </div>
    </section>
  );
}
