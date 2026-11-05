import { apiClient } from "@/services/apiClient";

export interface TipeTarif {
  id_tarif: string;
  kode_tarif: string;
  nama_tarif: string;
}

export interface TarifWithJumlahPelanggan extends TipeTarif {
  jumlahPelanggan: number;
}

export interface TipeTarifPayload {
  kode_tarif: string;
  nama_tarif: string;
}

export const tipeTarifService = {
  async findAll(): Promise<TarifWithJumlahPelanggan[]> {
    const response = await apiClient.get<
      TarifWithJumlahPelanggan[] | { data: TarifWithJumlahPelanggan[] }
    >("/tipe-tarif");

    return Array.isArray(response) ? response : response.data;
  },

  async findById(id: string): Promise<TipeTarif> {
    const response = await apiClient.get<TipeTarif | { data: TipeTarif }>(
      `/tipe-tarif/${encodeURIComponent(id)}`,
    );

    return "data" in response ? response.data : response;
  },

  async create(payload: TipeTarifPayload): Promise<TipeTarif> {
    const response = await apiClient.post<TipeTarif | { data: TipeTarif }>(
      "/tipe-tarif",
      payload,
    );

    return "data" in response ? response.data : response;
  },

  async update(id: string, payload: TipeTarifPayload): Promise<TipeTarif> {
    const response = await apiClient.patch<TipeTarif | { data: TipeTarif }>(
      `/tipe-tarif/${encodeURIComponent(id)}`,
      payload,
    );

    return "data" in response ? response.data : response;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tipe-tarif/${encodeURIComponent(id)}`);
  },
};
