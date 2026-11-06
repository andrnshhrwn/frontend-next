import { useCallback, useEffect, useState } from "react";

import {
  penugasanService,
  teknisiService,
  type Teknisi,
} from "@/services/penugasanService";

import { apiClient } from "@/services/apiClient";

import type {
  ApiResponse,
  Pelanggan,
  PenugasanAccess,
  TicketView,
} from "@/types/penugasan.types";

import { toTicket } from "@/utils/penugasan.utils";

export function usePenugasanData(access: PenugasanAccess) {
  const { isAdminPusat, isAdminCabang, unitId } = access;

  const [tickets, setTickets] = useState<TicketView[]>([]);
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [teknisi, setTeknisi] = useState<Teknisi[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingTeknisi, setLoadingTeknisi] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!isAdminPusat && !isAdminCabang) {
      setError("Anda tidak memiliki akses ke halaman penugasan.");
      setLoading(false);
      return;
    }

    if (isAdminCabang && !unitId) {
      setError("Data unit pada akun Anda tidak valid.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await penugasanService.findAll();

      // Backend sudah menerapkan buildAccessScope berdasarkan role.
      setTickets(data.map(toTicket));

      if (isAdminCabang) {
        const pelangganResponse =
          await apiClient.get<ApiResponse<Pelanggan[]>>("/pelanggan");

        if (!pelangganResponse.success) {
          throw new Error(
            pelangganResponse.message || "Gagal mengambil data pelanggan.",
          );
        }

        const pelangganData = pelangganResponse.data ?? [];

        setPelanggan(pelangganData.filter((item) => item.id_unit === unitId));
      } else {
        setPelanggan([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data penugasan.",
      );
    } finally {
      setLoading(false);
    }
  }, [isAdminPusat, isAdminCabang, unitId]);

  const loadTeknisi = useCallback(async () => {
    if (!isAdminCabang) return;

    setLoadingTeknisi(true);
    setError("");

    try {
      const data = await teknisiService.findAll();

      setTeknisi(data.filter((item) => item.id_unit === unitId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data teknisi.",
      );
    } finally {
      setLoadingTeknisi(false);
    }
  }, [isAdminCabang, unitId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    tickets,
    pelanggan,
    teknisi,
    loading,
    loadingTeknisi,
    error,
    setError,
    loadData,
    loadTeknisi,
  };
}
