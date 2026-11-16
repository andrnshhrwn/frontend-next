"use client";

import { useEffect, useMemo, useState } from "react";

import type { StatusFilter, TicketView } from "@/types/penugasan.types";

import {
  filterPenugasan,
  getPenugasanStats,
  getPenugasanUnits,
  getStatusFilterOptions,
  ITEMS_PER_PAGE,
} from "@/utils/penugasan.utils";

import { paginate } from "@/utils/pagination.utils";

export function usePenugasanFilter(tickets: TicketView[]) {
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

  const [currentPage, setCurrentPage] = useState(1);

  // Filter data penugasan.
  const filtered = useMemo(
    () => filterPenugasan(tickets, search, cabangFilter, statusFilter),
    [tickets, search, cabangFilter, statusFilter],
  );

  // Kembali ke halaman pertama setiap kali filter berubah.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, cabangFilter, statusFilter]);

  // Pagination menggunakan utility bersama.
  const pagination = useMemo(
    () => paginate(filtered, currentPage, ITEMS_PER_PAGE),
    [filtered, currentPage],
  );

  const {
    paginatedData: paginatedTickets,
    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,
  } = pagination;

  // Menyesuaikan halaman aktif jika jumlah data berkurang.
  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  // Statistik.
  const stats = useMemo(() => getPenugasanStats(tickets), [tickets]);

  // Pilihan filter status.
  const tabs = useMemo(
    () => getStatusFilterOptions(tickets, stats),
    [tickets, stats],
  );

  // Daftar unit untuk filter cabang.
  const units = useMemo(() => getPenugasanUnits(tickets), [tickets]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilter = () => {
    setSearch("");
    setCabangFilter("");
    setStatusFilter("Semua");
    setCurrentPage(1);
  };

  return {
    search,
    setSearch,

    cabangFilter,
    setCabangFilter,

    statusFilter,
    setStatusFilter,

    currentPage,
    setCurrentPage,

    filtered,
    paginatedTickets,

    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,

    stats,
    tabs,
    units,

    handlePageChange,
    resetFilter,
  };
}
