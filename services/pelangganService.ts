import { apiClient } from "@/services/apiClient";

export interface PelangganUnit {
  id_unit: string;
  nama_unit: string;
}

export interface PelangganTarif {
  id_tarif: string;
  nama_tarif: string;
}

export interface Pelanggan {
  id_pelanggan: string;
  id_pelanggan_pdam: string;
  id_unit: string;
  nama: string;
  alamat: string;
  id_tarif: string;
  wm_no_seri_aktif: string | null;
  unit: PelangganUnit;
  tarif: PelangganTarif;
}

export interface PelangganPayload {
  id_pelanggan_pdam: string;
  id_unit: string;
  nama: string;
  alamat: string;
  id_tarif: string;
  wm_no_seri_aktif?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ImportPelangganError {
  row: number;
  field: string;
  message: string;
}

export interface ImportPelangganSkipped {
  row: number;
  column: string;
  id_pelanggan_pdam: string;
  reason: string;
}

// Data import menggunakan kode bisnis, bukan UUID database.
export interface ImportPelangganRow {
  id_pelanggan_pdam: string;
  kode_unit: string;
  nama: string;
  alamat: string;
  kode_tarif: string;
  wm_no_seri_aktif?: string;
}

export interface ImportPelangganPreview {
  total_rows: number;
  valid_rows: number;
  skipped_rows: number;
  invalid_rows: number;
  can_import: boolean;
  rows: ImportPelangganRow[];
  skipped: ImportPelangganSkipped[];
  errors: ImportPelangganError[];
  preview: ImportPelangganRow[];
  preview_limit: number;
}

export interface ImportPelangganResult {
  imported_count: number;
  skipped_count: number;
  failed_count: number;
  skipped: ImportPelangganSkipped[];
  errors: ImportPelangganError[];
}

export const pelangganService = {
  async findAll(): Promise<Pelanggan[]> {
    const response =
      await apiClient.get<ApiResponse<Pelanggan[]>>("/pelanggan");

    return response.data;
  },

  async findById(id: string): Promise<Pelanggan> {
    const response = await apiClient.get<ApiResponse<Pelanggan>>(
      `/pelanggan/${id}`,
    );

    return response.data;
  },

  async create(payload: PelangganPayload): Promise<Pelanggan> {
    const response = await apiClient.post<ApiResponse<Pelanggan>>(
      "/pelanggan",
      payload,
    );

    return response.data;
  },

  async update(
    id: string,
    payload: Partial<PelangganPayload>,
  ): Promise<Pelanggan> {
    const response = await apiClient.patch<ApiResponse<Pelanggan>>(
      `/pelanggan/${id}`,
      payload,
    );

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/pelanggan/${id}`);
  },

  async previewImport(file: File): Promise<ImportPelangganPreview> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<ImportPelangganPreview>>(
      "/pelanggan/import/preview",
      formData,
    );

    return response.data;
  },

  async confirmImport(
    rows: ImportPelangganRow[],
  ): Promise<ImportPelangganResult> {
    const response = await apiClient.post<ApiResponse<ImportPelangganResult>>(
      "/pelanggan/import/confirm",
      {
        rows,
        confirm: true,
      },
    );

    return response.data;
  },
};
