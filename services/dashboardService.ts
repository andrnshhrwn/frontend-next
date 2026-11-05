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
  target_tahunan: number | null;
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

export const dashboardService = {
  async getSummary(params?: {
    periode?: string;
  }): Promise<ApiResponse<DashboardSummary>> {
    return apiClient.get<ApiResponse<DashboardSummary>>(
      "/dashboard/summary",
      params,
    );
  },

  async getUnitProgress(params?: {
    periode?: string;
  }): Promise<ApiResponse<UnitBranchProgress[]>> {
    return apiClient.get<ApiResponse<UnitBranchProgress[]>>(
      "/dashboard/unit-progress",
      params,
    );
  },
};
