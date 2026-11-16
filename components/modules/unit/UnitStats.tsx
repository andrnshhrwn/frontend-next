import { Building2 } from "lucide-react";
import { StatCard } from "@/components/ui";

interface UnitStatsProps {
  loading: boolean;
  totalUnit: number;
}

export default function UnitStats({ loading, totalUnit }: UnitStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Unit Terdaftar"
        value={loading ? "..." : totalUnit}
        subtext="Jumlah unit pada master data"
        icon={<Building2 className="h-5 w-5" />}
        variant="primary"
      />
    </div>
  );
}
