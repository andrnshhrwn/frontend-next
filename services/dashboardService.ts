import { apiClient } from "./apiClient";

export interface DashboardSummary {
  periode: string;
  total_pelanggan: number;

  spk: {
    total: number;
    pending: number;
    proses: number;
    selesai: number;
    dibatalkan: number;
  };

  penggantian_wm: {
    total: number;
    menunggu: number;
    disetujui: number;
    ditolak: number;
  };

  pengiriman_wm: {
    total_wm_dikirim: number;
  };

  inventori: {
    total_wm_dikirim: number;
    wm_terpasang_aktif: number;
    wm_stok: number;
    wm_dicabut: number;
    persentase_wm_terpasang: number;
    persentase_wm_stok: number;
  };

  target_bulanan: number | null;
  persentase_realisasi: number | null;
}

export interface UnitBranchProgress {
  id_unit: string;
  nama_unit: string;
  target: number | null;
  realisasi: number;
  persentase: number | null;
}

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

type DashboardParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export const dashboardService = {
  async getSummary(
    params?: DashboardParams,
  ): Promise<ApiResponse<DashboardSummary>> {
    return apiClient.get<ApiResponse<DashboardSummary>>(
      "/dashboard/summary",
      params,
    );
  },

  async getUnitProgress(
    params?: DashboardParams,
  ): Promise<ApiResponse<UnitBranchProgress[]>> {
    return apiClient.get<ApiResponse<UnitBranchProgress[]>>(
      "/dashboard/unit-progress",
      params,
    );
  },
};
