import { Building2, CheckCircle2, PackageCheck, Truck } from "lucide-react";

import { StatCard } from "@/components/ui";
import { formatNumber } from "@/utils/pengirimanWm.utils";
import type { PengirimanWmStats as PengirimanWmStatsType } from "@/types/pengirimanWm.types";

interface PengirimanWmStatsProps extends PengirimanWmStatsType {}

export default function PengirimanWmStats({
  totalPengirimanWM,
  totalWmTerpasang,
  totalStokTersedia,
  unitPenerimaCount,
}: PengirimanWmStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total WM Dikirim Pusat"
        value={formatNumber(totalPengirimanWM)}
        subtext="Akumulasi seluruh pengiriman"
        icon={<Truck className="h-5 w-5" />}
        variant="navy"
      />

      <StatCard
        title="Tersedia di Unit (Sisa Stok)"
        value={formatNumber(totalStokTersedia)}
        subtext="Total dikirim dikurangi WM aktif terpasang"
        icon={<PackageCheck className="h-5 w-5" />}
        variant="red"
      />

      <StatCard
        title="Terpasang di Pelanggan"
        value={formatNumber(totalWmTerpasang)}
        subtext="Pelanggan dengan nomor seri WM aktif"
        icon={<CheckCircle2 className="h-5 w-5" />}
        variant="primary"
      />

      <StatCard
        title="Unit Cabang Penerima"
        value={`${unitPenerimaCount} Cabang`}
        subtext="Unit yang memiliki riwayat pengiriman"
        icon={<Building2 className="h-5 w-5" />}
        variant="emerald"
      />
    </div>
  );
}
