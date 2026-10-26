import { apiClient } from "./apiClient";

export interface DashboardSummaryResponse {
  status: string;
  data: {
    periode: string;
    target_tahunan: number;
    realisasi_penggantian: number;
    persentase_realisasi: number;
    spk: {
      total: number;
      pending: number;
      proses: number;
      selesai: number;
      dibatalkan: number;
    };
    inventaris_wm: {
      total: number;
      tersedia_di_unit: number;
      terpasang: number;
      rusak: number;
      tarik: number;
    };
  };
}

export interface UnitBranchProgress {
  id_unit: number;
  nama_unit: string;
  target: number;
  realisasi: number;
  persentase: number;
}

export const dashboardService = {
  /**
   * Mengambil metrik ringkasan dashboard eksekutif
   */
  async getSummary(params?: { id_unit?: number | string; periode?: string }) {
    return apiClient.get<DashboardSummaryResponse>("/dashboard/summary", params);
  },

  /**
   * Mengambil rekap progres penggantian 9 cabang PAM Tirta Kamuning
   */
  async getUnitProgress() {
    return apiClient.get<{ status: string; data: UnitBranchProgress[] }>(
      "/dashboard/unit-progress"
    );
  },
};
