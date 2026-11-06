import { apiClient } from "@/services/apiClient";

export interface PengirimanWmDetail {
  id_detail: string;
  id_merk: string;
  ukuran_dn: string;
  jumlah: number;
  merk: {
    id_merk: string;
    merk_wm: string;
    wm_digit: number;
  };
}

export interface PengirimanWm {
  id_pengiriman: string;
  no_pengiriman: string;
  id_unit_tujuan: string;
  tgl_pengiriman: string;
  total_wm: number;
  catatan: string | null;
  id_user_pusat: string;
  created_at: string;
  unit_tujuan: {
    id_unit: string;
    nama_unit: string;
  };
  user_pusat: {
    id_user: string;
    fullname: string;
    username: string;
  };
  details: PengirimanWmDetail[];
}

export interface CreatePengirimanWmDetailPayload {
  id_merk: string;
  ukuran_dn: string;
  jumlah: number;
}

export interface CreatePengirimanWmPayload {
  no_pengiriman: string;
  id_unit_tujuan: string;
  tgl_pengiriman: string;
  catatan?: string | null;
  details: CreatePengirimanWmDetailPayload[];
}

export interface UpdatePengirimanWmPayload {
  no_pengiriman?: string;
  id_unit_tujuan?: string;
  tgl_pengiriman?: string;
  catatan?: string | null;
  details?: CreatePengirimanWmDetailPayload[];
}

interface ApiResponse<T> {
  status: "success";
  message: string;
  data: T;
}

const BASE_ENDPOINT = "/pengiriman-wm";

export const pengirimanWmService = {
  async findAll(): Promise<PengirimanWm[]> {
    const response =
      await apiClient.get<ApiResponse<PengirimanWm[]>>(BASE_ENDPOINT);

    return response.data;
  },

  async findById(id: string): Promise<PengirimanWm> {
    const response = await apiClient.get<ApiResponse<PengirimanWm>>(
      `${BASE_ENDPOINT}/${id}`,
    );

    return response.data;
  },

  async create(payload: CreatePengirimanWmPayload): Promise<PengirimanWm> {
    const response = await apiClient.post<ApiResponse<PengirimanWm>>(
      BASE_ENDPOINT,
      payload,
    );

    return response.data;
  },

  async update(
    id: string,
    payload: UpdatePengirimanWmPayload,
  ): Promise<PengirimanWm> {
    const response = await apiClient.patch<ApiResponse<PengirimanWm>>(
      `${BASE_ENDPOINT}/${id}`,
      payload,
    );

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${BASE_ENDPOINT}/${id}`);
  },
};
