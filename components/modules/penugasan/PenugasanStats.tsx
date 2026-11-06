"use client";

import { Activity, CheckCircle2, ClipboardList, Clock } from "lucide-react";

import { StatCard } from "@/components/ui";

import type { PenugasanStats as PenugasanStatsType } from "@/types/penugasan.types";

interface PenugasanStatsProps {
  stats: PenugasanStatsType;
}

export default function PenugasanStats({ stats }: PenugasanStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Penugasan"
        value={stats.total}
        subtext="Data yang berhasil dimuat"
        icon={<ClipboardList className="w-5 h-5" />}
        variant="navy"
      />

      <StatCard
        title="Pending"
        value={stats.pending}
        subtext="Menunggu proses berikutnya"
        icon={<Clock className="w-5 h-5" />}
        variant="red"
      />

      <StatCard
        title="Sedang Dikerjakan"
        value={stats.proses}
        subtext="Penugasan dalam proses"
        icon={<Activity className="w-5 h-5" />}
        variant="primary"
      />

      <StatCard
        title="Selesai"
        value={stats.selesai}
        subtext="Penugasan selesai"
        icon={<CheckCircle2 className="w-5 h-5" />}
        variant="emerald"
      />
    </div>
  );
}
