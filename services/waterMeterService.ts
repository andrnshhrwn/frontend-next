import { apiClient } from "./apiClient";
import type { WaterMeterItem } from "@/components/water-meter";

export interface WaterMeterFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  id_unit?: number | string;
  status?: string;
  id_merk?: number;
  tahun_pengadaan?: number;
}

export interface WaterMeterListResponse {
  status: string;
  data: WaterMeterItem[];
  meta: {
    page: number;
    limit: number;
    total_records: number;
    total_pages: number;
  };
}

export const waterMeterService = {
  /**
   * Mengambil daftar inventaris water meter dari API
   */
  async getList(params?: WaterMeterFilterParams): Promise<WaterMeterListResponse> {
    return apiClient.get<WaterMeterListResponse>("/water-meter", params);
  },

  /**
   * Detail water meter berdasarkan nomor seri / ID
   */
  async getDetail(id_wm: string): Promise<WaterMeterItem> {
    const res = await apiClient.get<{ status: string; data: WaterMeterItem }>(
      `/water-meter/${encodeURIComponent(id_wm)}`
    );
    return res.data;
  },

  /**
   * Registrasi water meter baru satuan
   */
  async create(payload: {
    no_seri: string;
    id_merk: number;
    ukuran_dn: string;
    tahun_pengadaan: number;
    id_unit: number;
  }) {
    return apiClient.post("/water-meter", payload);
  },

  /**
   * Impor water meter massal via file CSV
   */
  async importBulkCsv(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/water-meter/bulk", formData);
  },

  /**
   * Update status aset water meter (tersedia_di_unit | terpasang | rusak | tarik)
   */
  async updateStatus(id_wm: string, status: string, catatan?: string) {
    return apiClient.patch(`/water-meter/${encodeURIComponent(id_wm)}/status`, {
      status,
      catatan,
    });
  },
};
