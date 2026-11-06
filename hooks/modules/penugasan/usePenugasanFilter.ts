import { useEffect, useMemo, useState } from "react";

import type { StatusFilter, TicketView } from "@/types/penugasan.types";

import {
  filterPenugasan,
  getPaginatedPenugasan,
  getPenugasanStats,
  getPenugasanUnits,
  getStatusFilterOptions,
} from "@/utils/penugasan.utils";

export function usePenugasanFilter(tickets: TicketView[]) {
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(
    () => filterPenugasan(tickets, search, cabangFilter, statusFilter),
    [tickets, search, cabangFilter, statusFilter],
  );

  // Kembali ke halaman pertama setiap kali filter berubah.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, cabangFilter, statusFilter]);

  const pagination = useMemo(
    () => getPaginatedPenugasan(filtered, currentPage),
    [filtered, currentPage],
  );

  const stats = useMemo(() => getPenugasanStats(tickets), [tickets]);

  const tabs = useMemo(
    () => getStatusFilterOptions(tickets, stats),
    [tickets, stats],
  );

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
    paginatedTickets: pagination.paginatedTickets,
    totalPages: pagination.totalPages,
    safeCurrentPage: pagination.safeCurrentPage,
    startIndex: pagination.startIndex,
    endIndex: pagination.endIndex,
    stats,
    tabs,
    units,
    handlePageChange,
    resetFilter,
  };
}
