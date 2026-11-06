"use client";

import { AlertCircle, Gauge, Users } from "lucide-react";

import { StatCard } from "@/components/ui";

import type { PelangganStatsProps } from "@/types/pelanggan.types";

export function PelangganStats({
  isLoading,
  totalPelanggan,
  totalWmTercatat,
  totalWmBelumTercatat,
}: PelangganStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total Pelanggan"
        value={isLoading ? "..." : totalPelanggan}
        subtext="Seluruh data pelanggan terdaftar"
        icon={<Users className="w-5 h-5" />}
        variant="navy"
      />

      <StatCard
        title="Nomor Seri Tercatat"
        value={isLoading ? "..." : totalWmTercatat}
        subtext="Pelanggan dengan nomor seri WM aktif"
        icon={<Gauge className="w-5 h-5" />}
        variant="emerald"
      />

      <StatCard
        title="Nomor Seri Belum Tercatat"
        value={isLoading ? "..." : totalWmBelumTercatat}
        subtext="Nomor seri WM belum tersimpan di sistem"
        icon={<AlertCircle className="w-5 h-5" />}
        variant="amber"
      />
    </div>
  );
}
