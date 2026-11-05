import { apiClient } from "@/services/apiClient";

export type PenugasanStatus = "pending" | "proses" | "selesai" | "dibatalkan";

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface PenugasanUnit {
  id_unit: string;
  kode_unit?: string;
  nama_unit: string;
}

export interface PenugasanPelanggan {
  id_pelanggan: string;
  id_pelanggan_pdam: string;
  id_unit: string;
  nama: string;
  alamat: string;
  id_tarif: string;
  wm_no_seri_aktif: string | null;
  unit?: PenugasanUnit;
  tarif?: {
    id_tarif: string;
    kode_tarif: string;
    nama_tarif: string;
  };
}

export interface PenugasanUser {
  id_user: string;
  fullname: string;
  username?: string;
}

export interface Penugasan {
  id_penugasan: string;
  nomor_spk: string;
  id_pelanggan: string;
  id_unit: string;
  tgl_penugasan: string;
  alasan: string;
  id_user_penugasan: string;
  status: PenugasanStatus;
  id_teknisi: string | null;

  pelanggan: PenugasanPelanggan;
  unit: PenugasanUnit;
  pembuat?: PenugasanUser;
  teknisi: PenugasanUser | null;
}

export interface PenugasanPayload {
  id_pelanggan: string;
  id_unit: string;
  alasan: string;
  tgl_penugasan?: string;
}

export interface AssignTeknisiPayload {
  id_teknisi: string;
}

export interface UpdatePenugasanPayload {
  tgl_penugasan?: string;
  alasan?: string;
  status?: PenugasanStatus;
}

export interface Teknisi {
  id_user: string;
  id_unit: string;
  fullname: string;
  username: string;
  role: "teknisi";
  unit: PenugasanUnit;
}

export const penugasanService = {
  async findAll(): Promise<Penugasan[]> {
    const response =
      await apiClient.get<ApiResponse<Penugasan[]>>("/penugasan");

    return response.data;
  },

  async findById(id: string): Promise<Penugasan> {
    const response = await apiClient.get<ApiResponse<Penugasan>>(
      `/penugasan/${id}`,
    );

    return response.data;
  },

  async cancel(id: string): Promise<Penugasan> {
    const response = await apiClient.patch<ApiResponse<Penugasan>>(
      `/penugasan/${id}/batalkan`,
      {},
    );

    if (response.status !== "success") {
      throw new Error(response.message || "Gagal membatalkan SPK.");
    }

    return response.data;
  },

  async create(payload: PenugasanPayload): Promise<Penugasan> {
    const response = await apiClient.post<ApiResponse<Penugasan>>(
      "/penugasan",
      payload,
    );

    return response.data;
  },

  async assignTeknisi(
    id: string,
    payload: AssignTeknisiPayload,
  ): Promise<Penugasan> {
    const response = await apiClient.patch<ApiResponse<Penugasan>>(
      `/penugasan/${id}/teknisi`,
      payload,
    );

    return response.data;
  },

  async update(
    id: string,
    payload: UpdatePenugasanPayload,
  ): Promise<Penugasan> {
    const response = await apiClient.patch<ApiResponse<Penugasan>>(
      `/penugasan/${id}`,
      payload,
    );

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/penugasan/${id}`);
  },
};

export const teknisiService = {
  async findAll(): Promise<Teknisi[]> {
    const response =
      await apiClient.get<ApiResponse<Teknisi[]>>("/users/teknisi");

    return response.data;
  },
};
