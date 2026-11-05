import { apiClient } from "@/services/apiClient";

export interface Unit {
  id_unit: string;
  kode_unit: string;
  nama_unit: string;
}

export interface UnitPayload {
  kode_unit: string;
  nama_unit: string;
}

export const unitService = {
  async findAll(): Promise<Unit[]> {
    const response = await apiClient.get<Unit[] | { data: Unit[] }>("/unit");

    if (Array.isArray(response)) {
      return response;
    }

    return response.data;
  },

  async findById(id: string): Promise<Unit> {
    const response = await apiClient.get<Unit | { data: Unit }>(`/unit/${id}`);

    return "data" in response ? response.data : response;
  },

  async create(payload: UnitPayload): Promise<Unit> {
    const response = await apiClient.post<Unit | { data: Unit }>(
      "/unit",
      payload,
    );

    return "data" in response ? response.data : response;
  },

  async update(id: string, payload: UnitPayload): Promise<Unit> {
    const response = await apiClient.patch<Unit | { data: Unit }>(
      `/unit/${id}`,
      payload,
    );

    return "data" in response ? response.data : response;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/unit/${id}`);
  },
};
