"use client";

import { useCallback, useEffect, useState } from "react";

import { validasiService, type ValidasiBap } from "@/services/validasiService";

import type { StatusFilter, ValidasiPagination } from "@/types/validasi.types";

import { getErrorMessage, PAGE_LIMIT } from "@/utils/validasi.utils";

export function useValidasiData(statusFilter: StatusFilter, page: number) {
  const [data, setData] = useState<ValidasiBap[]>([]);
  const [pagination, setPagination] = useState<ValidasiPagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");

  const loadData = useCallback(
    async (isRefresh = false): Promise<void> => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setPageError("");

        const result = await validasiService.findAll({
          status_validasi: statusFilter === "Semua" ? undefined : statusFilter,
          page,
          limit: PAGE_LIMIT,
        });

        setData(result.data);
        setPagination(result.pagination);
      } catch (error) {
        setPageError(getErrorMessage(error));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [statusFilter, page],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    data,
    pagination,
    loading,
    refreshing,
    pageError,
    loadData,
  };
}
