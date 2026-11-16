import { apiClient } from "@/services/apiClient";

export interface StokWmItem {
  id_unit: string;
  kode_unit: string;
  nama_unit: string;
  id_merk: string;
  kode_wm: string;
  merk_wm: string;
  wm_digit: number;
  total_dikirim: number;
  total_terpasang: number;
  stok_tersedia: number;
}

export interface StokWmSummary {
  total_dikirim: number;
  total_terpasang: number;
  stok_tersedia: number;
}

export interface StokWmResponse {
  data: StokWmItem[];
  summary: StokWmSummary;
}

interface ApiResponse<T> {
  status: "success";
  message: string;
  data: T;
}

const BASE_ENDPOINT = "/penggantian-wm";

export const stokWmService = {
  async getStok(): Promise<StokWmResponse> {
    const response = await apiClient.get<ApiResponse<StokWmResponse>>(
      `${BASE_ENDPOINT}/stok`,
    );

    return response.data;
  },
};
