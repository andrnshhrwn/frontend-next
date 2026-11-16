"use client";

import { useCallback, useMemo } from "react";
import type { PengirimanWm } from "@/services/pengirimanService";
import type { StokWmItem, StokWmSummary } from "@/services/stokWmService";

const EMPTY_SUMMARY: StokWmSummary = {
  total_dikirim: 0,
  total_terpasang: 0,
  stok_tersedia: 0,
};

export function usePengirimanWmStats(
  pengirimanList: PengirimanWm[],
  stokWmList: StokWmItem[],
  stokSummary: StokWmSummary | null,
) {
  const summary = stokSummary ?? EMPTY_SUMMARY;

  const totalPengirimanWM = summary.total_dikirim;
  const totalWmTerpasang = summary.total_terpasang;
  const totalStokTersedia = summary.stok_tersedia;

  const unitPenerimaCount = useMemo(() => {
    return new Set(stokWmList.map((item) => item.id_unit)).size;
  }, [stokWmList]);

  const getUnitPengiriman = useCallback(
    (idUnit: string) => {
      return pengirimanList.filter((item) => item.id_unit_tujuan === idUnit);
    },
    [pengirimanList],
  );

  const getUnitWmTerpasang = useCallback(
    (idUnit: string) => {
      return stokWmList
        .filter((item) => item.id_unit === idUnit)
        .reduce((total, item) => total + item.total_terpasang, 0);
    },
    [stokWmList],
  );

  const getUnitTotalDikirim = useCallback(
    (idUnit: string) => {
      return stokWmList
        .filter((item) => item.id_unit === idUnit)
        .reduce((total, item) => total + item.total_dikirim, 0);
    },
    [stokWmList],
  );

  const getUnitStok = useCallback(
    (idUnit: string) => {
      return stokWmList
        .filter((item) => item.id_unit === idUnit)
        .reduce((total, item) => total + item.stok_tersedia, 0);
    },
    [stokWmList],
  );

  return {
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
