import { apiClient } from "@/services/apiClient";

export interface MerkWM {
  id_merk: string;
  kode_wm: string;
  merk_wm: string;
  wm_digit: number;
}

export interface MerkWMPayload {
  kode_wm: string;
  merk_wm: string;
  wm_digit: number;
}

export const merkWMService = {
  async findAll(): Promise<MerkWM[]> {
    const response = await apiClient.get<MerkWM[] | { data: MerkWM[] }>(
      "/merk-wm",
    );

    return Array.isArray(response) ? response : response.data;
  },

  async findById(id: string): Promise<MerkWM> {
    const response = await apiClient.get<MerkWM | { data: MerkWM }>(
      `/merk-wm/${id}`,
    );

    return "data" in response ? response.data : response;
  },

  async create(payload: MerkWMPayload): Promise<MerkWM> {
    const response = await apiClient.post<MerkWM | { data: MerkWM }>(
      "/merk-wm",
      payload,
    );

    return "data" in response ? response.data : response;
  },

  async update(id: string, payload: MerkWMPayload): Promise<MerkWM> {
    const response = await apiClient.patch<MerkWM | { data: MerkWM }>(
      `/merk-wm/${id}`,
      payload,
    );

    return "data" in response ? response.data : response;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/merk-wm/${id}`);
  },
};
