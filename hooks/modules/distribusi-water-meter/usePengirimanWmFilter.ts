"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuthStore } from "@/lib/auth/auth-store";

import type { PengirimanWm } from "@/services/pengirimanService";
import type { Unit } from "@/services/unitService";

import { ITEMS_PER_PAGE } from "@/utils/pengirimanWm.utils";

export function usePengirimanWmFilter(
  pengirimanList: PengirimanWm[],
  unitList: Unit[],
) {
  // Mengambil autentikasi dari Zustand.
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);

  const authLoading = authStatus === "idle" || authStatus === "checking";

  const isAuthenticated = authStatus === "authenticated";

  const userRole = isAuthenticated ? user?.role : undefined;
  const userUnitId = isAuthenticated ? (user?.id_unit ?? null) : null;

  const isAdminPusat = userRole === "admin_pusat";
  const isAdminCabang = userRole === "admin_cabang";

  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  // Batasi daftar unit berdasarkan hak akses pengguna.
  const accessibleUnitList = useMemo(() => {
    if (authLoading || !isAuthenticated) return [];

    if (isAdminPusat) return unitList;

    if (isAdminCabang && userUnitId) {
      return unitList.filter((unit) => unit.id_unit === userUnitId);
    }

    return [];
  }, [
    authLoading,
    isAuthenticated,
    isAdminPusat,
    isAdminCabang,
    userUnitId,
    unitList,
  ]);

  // Batasi riwayat pengiriman berdasarkan unit yang boleh diakses.
  const accessiblePengirimanList = useMemo(() => {
    if (authLoading || !isAuthenticated) return [];

    if (isAdminPusat) return pengirimanList;

    if (isAdminCabang && userUnitId) {
      return pengirimanList.filter(
        (item) => item.id_unit_tujuan === userUnitId,
      );
    }

    return [];
  }, [
    authLoading,
    isAuthenticated,
    isAdminPusat,
    isAdminCabang,
    userUnitId,
    pengirimanList,
  ]);

  // Filter riwayat pengiriman.
  const filteredPengiriman = useMemo(() => {
    const keyword = search.toLowerCase().trim();

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

  // Filter daftar unit.
  const filteredUnit = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return accessibleUnitList.filter((unit) => {
      const matchSearch = unit.nama_unit.toLowerCase().includes(keyword);

      const matchCabang =
        cabangFilter === "Semua" || unit.nama_unit === cabangFilter;

      return matchSearch && matchCabang;
    });
  }, [accessibleUnitList, search, cabangFilter]);

  // Informasi pagination.
  const totalItems = filteredPengiriman.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(Math.max(1, currentPage), totalPages);

  const startIndex =
    totalItems === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  // Data halaman aktif.
  const paginatedPengiriman = useMemo(
    () => filteredPengiriman.slice(startIndex, endIndex),
    [filteredPengiriman, startIndex, endIndex],
  );

  // Pilihan filter berdasarkan unit yang dapat diakses.
  const unitFilterOptions = useMemo(
    () => [
      "Semua",
      ...Array.from(new Set(accessibleUnitList.map((unit) => unit.nama_unit))),
    ],
    [accessibleUnitList],
  );

  // Reset halaman ketika pencarian atau filter berubah.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, cabangFilter]);

  // Koreksi halaman jika jumlah data berkurang.
  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  // Reset filter ketika identitas atau role berubah.
  useEffect(() => {
    setCabangFilter("Semua");
  }, [user?.id_user, userUnitId, userRole]);

  return {
    search,
    setSearch,

    cabangFilter,
    setCabangFilter,

    currentPage: safeCurrentPage,
    setCurrentPage,

    filteredPengiriman,
    filteredUnit,
    paginatedPengiriman,

    totalPages,
    totalItems,
    startIndex,
    endIndex,

    unitFilterOptions,
  };
}
