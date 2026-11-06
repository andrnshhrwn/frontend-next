import { useMemo, useState } from "react";

import type { Pelanggan, PelangganTab } from "@/types/pelanggan.types";

import { ITEMS_PER_PAGE } from "@/utils/pelanggan.utils";

export function usePelangganFilter(customers: Pelanggan[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState<PelangganTab>("semua");
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [tarifFilter, setTarifFilter] = useState("");

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

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    totalItems === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const displayedCustomers = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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
    itemsPerPage: ITEMS_PER_PAGE,
  };
}
