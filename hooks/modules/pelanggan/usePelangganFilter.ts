"use client";

import { useEffect, useMemo, useState } from "react";

import type { Pelanggan, PelangganTab } from "@/types/pelanggan.types";

import { ITEMS_PER_PAGE } from "@/utils/pelanggan.utils";
import { paginate } from "@/utils/pagination.utils";

export function usePelangganFilter(customers: Pelanggan[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState<PelangganTab>("semua");
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [tarifFilter, setTarifFilter] = useState("");

  // Filter data pelanggan.
  const filtered = useMemo(() => {
    return customers.filter((customer) => {
      const q = search.toLowerCase();

      const matchesWmStatus =
        tab === "semua" ||
        (tab === "tercatat" && !!customer.wmNoSeri) ||
        (tab === "belum_tercatat" && !customer.wmNoSeri);

      return (
        matchesWmStatus &&
        (!cabangFilter || customer.idUnit === cabangFilter) &&
        (!tarifFilter || customer.idTarif === tarifFilter) &&
        (!q ||
          customer.idPelangganPdam.toLowerCase().includes(q) ||
          customer.nama.toLowerCase().includes(q) ||
          customer.alamat.toLowerCase().includes(q) ||
          (customer.wmNoSeri ?? "").toLowerCase().includes(q))
      );
    });
  }, [customers, tab, search, cabangFilter, tarifFilter]);

  // Pagination menggunakan utility bersama.
  const pagination = useMemo(
    () => paginate(filtered, currentPage, ITEMS_PER_PAGE),
    [filtered, currentPage],
  );

  const {
    paginatedData: displayedCustomers,
    totalItems,
    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,
  } = pagination;

  // Sinkronisasi state jika jumlah halaman berkurang.
  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  // Reset halaman ketika filter berubah.
  const changeTab = (value: PelangganTab) => {
    setTab(value);
    setCurrentPage(1);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const changeCabangFilter = (value: string) => {
    setCabangFilter(value);
    setCurrentPage(1);
  };

  const changeTarifFilter = (value: string) => {
    setTarifFilter(value);
    setCurrentPage(1);
  };

  const resetPage = () => setCurrentPage(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    setCurrentPage,

    tab,
    search,
    cabangFilter,
    tarifFilter,

    filtered,
    totalItems,
    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,

    displayedCustomers,

    changeTab,
    changeSearch,
    changeCabangFilter,
    changeTarifFilter,
    resetPage,
    handlePageChange,

    itemsPerPage: ITEMS_PER_PAGE,
  };
}
