"use client";

import { useCallback, useMemo } from "react";

import type { PengirimanWm } from "@/services/pengirimanService";
import type { Pelanggan } from "@/services/pelangganService";

export function usePengirimanWmStats(
  pengirimanList: PengirimanWm[],
  pelangganList: Pelanggan[],
) {
  const pelangganAktif = useMemo(
    () =>
      pelangganList.filter(
        (pelanggan) =>
          typeof pelanggan.wm_no_seri_aktif === "string" &&
          pelanggan.wm_no_seri_aktif.trim().length > 0,
      ),
    [pelangganList],
  );

  const totalPengirimanWM = useMemo(
    () => pengirimanList.reduce((total, item) => total + item.total_wm, 0),
    [pengirimanList],
  );

  const totalWmTerpasang = pelangganAktif.length;

  const totalStokTersedia = totalPengirimanWM - totalWmTerpasang;

  const unitPenerimaCount = useMemo(
    () => new Set(pengirimanList.map((item) => item.id_unit_tujuan)).size,
    [pengirimanList],
  );

  const getUnitPengiriman = useCallback(
    (idUnit: string) =>
      pengirimanList.filter((item) => item.id_unit_tujuan === idUnit),
    [pengirimanList],
  );

  const getUnitWmTerpasang = useCallback(
    (idUnit: string) =>
      pelangganAktif.filter((pelanggan) => pelanggan.id_unit === idUnit).length,
    [pelangganAktif],
  );

  const getUnitTotalDikirim = useCallback(
    (idUnit: string) =>
      getUnitPengiriman(idUnit).reduce(
        (total, item) => total + item.total_wm,
        0,
      ),
    [getUnitPengiriman],
  );

  const getUnitStok = useCallback(
    (idUnit: string) =>
      getUnitTotalDikirim(idUnit) - getUnitWmTerpasang(idUnit),
    [getUnitTotalDikirim, getUnitWmTerpasang],
  );

  return {
    pelangganAktif,
    totalPengirimanWM,
    totalWmTerpasang,
    totalStokTersedia,
    unitPenerimaCount,
    getUnitPengiriman,
    getUnitWmTerpasang,
    getUnitTotalDikirim,
    getUnitStok,
  };
}
