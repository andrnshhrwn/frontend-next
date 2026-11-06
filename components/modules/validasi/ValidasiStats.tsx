import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";

import { StatCard } from "@/components/ui";

interface ValidasiStatsProps {
  total: number;
  currentPage: number;
  totalPages: number;
  displayed: number;
  pageLimit: number;
}

export default function ValidasiStats({
  total,
  currentPage,
  totalPages,
  displayed,
  pageLimit,
}: ValidasiStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total BAP"
        value={total}
        subtext="Sesuai filter status aktif"
        icon={<ShieldCheck className="w-5 h-5" />}
        variant="primary"
      />

      <StatCard
        title="Halaman Aktif"
        value={currentPage}
        subtext={`Dari ${totalPages} halaman`}
        icon={<Clock className="w-5 h-5" />}
        variant="amber"
      />

      <StatCard
        title="Data Ditampilkan"
        value={displayed}
        subtext={`Maksimal ${pageLimit} data per halaman`}
        icon={<CheckCircle2 className="w-5 h-5" />}
        variant="emerald"
      />
    </div>
  );
}
