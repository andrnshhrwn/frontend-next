import { Layers, Tags, Users } from "lucide-react";
import { StatCard } from "@/components/ui";

interface TarifStatsProps {
  loading: boolean;
  totalTarif: number;
  totalPelanggan: number;
  totalTarifDigunakan: number;
}

export default function TarifStats({
  loading,
  totalTarif,
  totalPelanggan,
  totalTarifDigunakan,
}: TarifStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        title="Total Golongan Tarif"
        value={loading ? "..." : totalTarif}
        subtext="Jumlah golongan terdaftar"
        icon={<Tags size={22} />}
        variant="primary"
      />

      <StatCard
        title="Total Pelanggan"
        value={loading ? "..." : totalPelanggan.toLocaleString("id-ID")}
        subtext="Jumlah pelanggan terdata"
        icon={<Users size={22} />}
        variant="primary"
      />

      <StatCard
        title="Golongan Digunakan"
        value={loading ? "..." : totalTarifDigunakan}
        subtext="Golongan yang memiliki pelanggan"
        icon={<Layers size={22} />}
        variant="primary"
      />
    </div>
  );
}
