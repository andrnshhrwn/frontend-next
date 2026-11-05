import { apiClient } from "@/services/apiClient";

export type UserRole = "admin_pusat" | "admin_cabang" | "teknisi";

export interface User {
  id_user: string;
  id_unit: string | null;
  fullname: string;
  username: string;
  role: UserRole;
  unit: {
    id_unit: string;
    nama_unit: string;
  } | null;
}

export interface CreateUserPayload {
  fullname: string;
  username: string;
  password: string;
  role: UserRole;
  id_unit: string | null;
}

export interface UpdateUserPayload {
  fullname?: string;
  username?: string;
  password?: string;
  role?: UserRole;
  id_unit?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const BASE_ENDPOINT = "/users";

export const userService = {
  async findAll(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(BASE_ENDPOINT);
    return response.data;
  },

  async findById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      `${BASE_ENDPOINT}/${id}`,
    );
    return response.data;
  },

  async findTeknisi(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `${BASE_ENDPOINT}/teknisi`,
    );
    return response.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      BASE_ENDPOINT,
      payload,
    );
    return response.data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      `${BASE_ENDPOINT}/${id}`,
      payload,
    );
    return response.data;
  },
};
