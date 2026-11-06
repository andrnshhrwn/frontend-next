"use client";

import { useEffect, useMemo, useState } from "react";

import type { PengirimanWm } from "@/services/pengirimanService";
import type { Unit } from "@/services/unitService";

import { ITEMS_PER_PAGE } from "@/utils/pengirimanWm.utils";

export function usePengirimanWmFilter(
  pengirimanList: PengirimanWm[],
  unitList: Unit[],
) {
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPengiriman = useMemo(() => {
    const keyword = search.toLowerCase();

    return pengirimanList.filter((item) => {
      const namaUnit = item.unit_tujuan?.nama_unit ?? "";
      const catatan = item.catatan ?? "";

      const matchSearch =
        item.no_pengiriman.toLowerCase().includes(keyword) ||
        namaUnit.toLowerCase().includes(keyword) ||
        catatan.toLowerCase().includes(keyword);

      const matchCabang = cabangFilter === "Semua" || namaUnit === cabangFilter;

      return matchSearch && matchCabang;
    });
  }, [pengirimanList, search, cabangFilter]);

  const filteredUnit = useMemo(() => {
    const keyword = search.toLowerCase();

    return unitList.filter((unit) => {
      const matchSearch = unit.nama_unit.toLowerCase().includes(keyword);

      const matchCabang =
        cabangFilter === "Semua" || unit.nama_unit === cabangFilter;

      return matchSearch && matchCabang;
    });
  }, [unitList, search, cabangFilter]);

  const totalPages = Math.ceil(filteredPengiriman.length / ITEMS_PER_PAGE);

  const paginatedPengiriman = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredPengiriman.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPengiriman, currentPage]);

  const startIndex =
    filteredPengiriman.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredPengiriman.length,
  );

  const unitFilterOptions = useMemo(() => {
    return [
      "Semua",
      ...Array.from(new Set(unitList.map((unit) => unit.nama_unit))),
    ];
  }, [unitList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, cabangFilter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    search,
    setSearch,
    cabangFilter,
    setCabangFilter,
    currentPage,
    setCurrentPage,
    filteredPengiriman,
    filteredUnit,
    paginatedPengiriman,
    totalPages,
    totalItems: filteredPengiriman.length,
    startIndex,
    endIndex,
    unitFilterOptions,
  };
}
