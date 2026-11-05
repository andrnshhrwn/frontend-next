import {
  apiClient,
  apiRequest,
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  type StoredUser,
  type ApiError,
} from "@/services/apiClient";

// ======================================================
// TYPES
// ======================================================

export type UserRole = StoredUser["role"];
export type UserProfile = StoredUser;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponseData {
  token: string;
  user: UserProfile;
}

export interface LoginResult {
  token: string;
  user: UserProfile;
}

// ======================================================
// AUTH SERVICE
// ======================================================

export const authService = {
  /**
   * Login menggunakan username dan password.
   * Token dan profil pengguna disimpan setelah login berhasil.
   */
  async login(username: string, password: string): Promise<LoginResult> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      "/auth/login",
      {
        username,
        password,
      },
    );

    const result = response.data;

    if (!result?.token || !result.user) {
      throw new Error("Respons login dari server tidak valid.");
    }

    setAccessToken(result.token);
    setStoredUser(result.user);

    return result;
  },

  /**
   * Mengambil profil pengguna yang sedang login.
   */
  async getMe(token?: string): Promise<UserProfile> {
    const response = await apiRequest<ApiResponse<UserProfile>>("/auth/me", {
      method: "GET",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    return response.data;
  },

  /**
   * Mengambil access token dari localStorage.
   */
  getToken(): string | null {
    return getAccessToken();
  },

  /**
   * Mengambil profil pengguna dari localStorage.
   */
  getCurrentUser(): UserProfile | null {
    return getStoredUser();
  },

  /**
   * Memeriksa keberadaan token dan profil pengguna.
   */
  isAuthenticated(): boolean {
    return Boolean(this.getToken() && this.getCurrentUser());
  },

  /**
   * Menghapus seluruh data sesi.
   */
  clearSession(): void {
    removeAccessToken();
    removeStoredUser();
  },

  /**
   * Logout lokal.
   */
  async logout(): Promise<void> {
    this.clearSession();
  },
};
