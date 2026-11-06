import { useCallback, useEffect, useState } from "react";

import { pelangganService } from "@/services/pelangganService";
import { unitService } from "@/services/unitService";
import { tipeTarifService } from "@/services/tipeTarifService";

import type { Unit } from "@/services/unitService";
import type { TarifWithJumlahPelanggan } from "@/services/tipeTarifService";

import type { Pelanggan } from "@/types/pelanggan.types";
import { mapPelanggan } from "@/utils/pelanggan.utils";

export function usePelangganData() {
  const [customers, setCustomers] = useState<Pelanggan[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [tariffs, setTariffs] = useState<TarifWithJumlahPelanggan[]>([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError(null);

    try {
      const [pelangganData, unitData, tarifData] = await Promise.all([
        pelangganService.findAll(),
        unitService.findAll(),
        tipeTarifService.findAll(),
      ]);

      setCustomers(pelangganData.map(mapPelanggan));
      setUnits(unitData);
      setTariffs(tarifData);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data pelanggan.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    customers,
    units,
    tariffs,
    loading,
    pageError,
    loadData,
  };
}
