"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  LaporanFilters,
  LaporanResponse,
} from "@/services/laporanService";

export function useLaporan<TItem, TSummary>(
  fetcher: (f: LaporanFilters) => Promise<LaporanResponse<TItem, TSummary>>,
  filters: LaporanFilters,
) {
  const [result, setResult] = useState<LaporanResponse<TItem, TSummary> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const key = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    fetcher(JSON.parse(key))
      .then((res) => {
        if (!cancelled) setResult(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat laporan.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { result, loading, error, reload };
}
