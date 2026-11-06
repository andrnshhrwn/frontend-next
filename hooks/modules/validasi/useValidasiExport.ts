"use client";

import { useMemo, useState } from "react";

import { validasiService, type ValidasiBap } from "@/services/validasiService";

import type { StatusFilter, ValidasiExportArgs } from "@/types/validasi.types";

import {
  downloadCsv,
  EXPORT_LIMIT,
  getErrorMessage,
  matchesSearch,
} from "@/utils/validasi.utils";

interface UseValidasiExportParams {
  statusFilter: StatusFilter;
  search: string;
  showToast: (message: string, type?: "success" | "error" | "warning") => void;
}

export function useValidasiExport({
  statusFilter,
  search,
  showToast,
}: UseValidasiExportParams) {
  const [showExport, setShowExport] = useState(false);
  const [preparingExport, setPreparingExport] = useState(false);
  const [exportRows, setExportRows] = useState<ValidasiBap[]>([]);

  const prepareExport = async (): Promise<void> => {
    try {
      setPreparingExport(true);

      const firstResult = await validasiService.findAll({
        status_validasi: statusFilter === "Semua" ? undefined : statusFilter,
        page: 1,
        limit: EXPORT_LIMIT,
      });

      let allRows = [...firstResult.data];

      const totalPages = firstResult.pagination.totalPages;

      // Mengambil semua halaman, bukan hanya halaman yang sedang dibuka.
      for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
        const result = await validasiService.findAll({
          status_validasi: statusFilter === "Semua" ? undefined : statusFilter,
          page: currentPage,
          limit: EXPORT_LIMIT,
        });

        allRows = [...allRows, ...result.data];
      }

      setExportRows(allRows);
      setShowExport(true);
    } catch (error) {
      showToast(
        `Gagal menyiapkan data ekspor: ${getErrorMessage(error)}`,
        "error",
      );
    } finally {
      setPreparingExport(false);
    }
  };

  const exportFilteredRows = useMemo(() => {
    return exportRows.filter((item) => matchesSearch(item, search));
  }, [exportRows, search]);

  const handleExport = ({ scope, selectedCols }: ValidasiExportArgs): void => {
    const rows = scope === "filtered" ? exportFilteredRows : exportRows;

    if (rows.length === 0) {
      showToast("Tidak ada data untuk diekspor.", "warning");
      return;
    }

    downloadCsv(rows, selectedCols);

    setShowExport(false);

    showToast(`${rows.length} data BAP berhasil diekspor ke CSV.`, "success");
  };

  return {
    showExport,
    setShowExport,
    preparingExport,
    exportRows,
    exportFilteredRows,
    prepareExport,
    handleExport,
  };
}
