"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";

import type { PengirimanWm } from "@/services/pengirimanService";
import type { Unit } from "@/services/unitService";

import { ITEMS_PER_PAGE } from "@/utils/pengirimanWm.utils";

export function usePengirimanWmFilter(
  pengirimanList: PengirimanWm[],
  unitList: Unit[],
) {
  const { hasRole, userUnitId, loading: authLoading } = useAuth();

  const isAdminPusat = !authLoading && hasRole("admin_pusat");
  const isAdminCabang = !authLoading && hasRole("admin_cabang");

  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  // Batasi daftar unit berdasarkan hak akses pengguna.
  const accessibleUnitList = useMemo(() => {
    if (authLoading) return [];

    if (isAdminPusat) return unitList;

    if (isAdminCabang && userUnitId) {
      return unitList.filter((unit) => unit.id_unit === userUnitId);
    }

    return [];
  }, [authLoading, isAdminPusat, isAdminCabang, userUnitId, unitList]);

  // Batasi riwayat pengiriman berdasarkan unit yang boleh diakses.
  const accessiblePengirimanList = useMemo(() => {
    if (authLoading) return [];

    if (isAdminPusat) return pengirimanList;

    if (isAdminCabang && userUnitId) {
      return pengirimanList.filter(
        (item) => item.id_unit_tujuan === userUnitId,
      );
    }

    return [];
  }, [authLoading, isAdminPusat, isAdminCabang, userUnitId, pengirimanList]);

  const filteredPengiriman = useMemo(() => {
    const keyword = search.toLowerCase();

    return accessiblePengirimanList.filter((item) => {
      const namaUnit = item.unit_tujuan?.nama_unit ?? "";
      const catatan = item.catatan ?? "";

      const matchSearch =
        item.no_pengiriman.toLowerCase().includes(keyword) ||
        namaUnit.toLowerCase().includes(keyword) ||
        catatan.toLowerCase().includes(keyword);

      const matchCabang = cabangFilter === "Semua" || namaUnit === cabangFilter;

      return matchSearch && matchCabang;
    });
  }, [accessiblePengirimanList, search, cabangFilter]);

  const filteredUnit = useMemo(() => {
    const keyword = search.toLowerCase();

    return accessibleUnitList.filter((unit) => {
      const matchSearch = unit.nama_unit.toLowerCase().includes(keyword);

      const matchCabang =
        cabangFilter === "Semua" || unit.nama_unit === cabangFilter;

      return matchSearch && matchCabang;
    });
  }, [accessibleUnitList, search, cabangFilter]);

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
      ...Array.from(new Set(accessibleUnitList.map((unit) => unit.nama_unit))),
    ];
  }, [accessibleUnitList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, cabangFilter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Jika akun berganti unit atau role, reset filter cabang.
  useEffect(() => {
    setCabangFilter("Semua");
  }, [userUnitId, isAdminPusat, isAdminCabang]);

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
