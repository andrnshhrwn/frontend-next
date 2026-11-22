import {
  apiRequest,
  ApiError,
  authHttp,
  toApiError,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
  removeAccessToken,
  removeStoredUser,
  refreshSession,
  type StoredUser,
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

export interface LoginResult {
  token: string;
  user: UserProfile;
}

// ======================================================
// AUTH SERVICE
// ======================================================

export const authService = {
  /**
   * Login lewat Route Handler Next, supaya refresh token
   * disimpan di cookie httpOnly.
   */
  async login(
    username: string,
    password: string,
    rememberMe = false,
  ): Promise<LoginResult> {
    let result: LoginResult | undefined;

    try {
      const res = await authHttp.post<{ data: LoginResult }>(
        "/api/auth/login",
        { username, password, rememberMe },
      );
      result = res.data?.data;
    } catch (error) {
      throw toApiError(error, 10000);
    }

    if (!result?.token || !result.user) {
      throw new ApiError(500, "Respons login dari server tidak valid.");
    }

    setAccessToken(result.token);
    setStoredUser(result.user, rememberMe);

    return result;
  },

  /**
   * Mengambil profil pengguna dari backend.
   */
  async getMe(): Promise<UserProfile> {
    if (!getAccessToken()) {
      return this.restoreSession();
    }

    const response = await apiRequest<ApiResponse<UserProfile>>("/auth/me");
    return response.data;
  },

  /**
   * Memulihkan sesi dari cookie refresh token (dipakai saat reload).
   */
  async restoreSession(): Promise<UserProfile> {
    const { user } = await refreshSession();
    return user;
  },

  getToken(): string | null {
    return getAccessToken();
  },

  getCurrentUser(): UserProfile | null {
    return getStoredUser();
  },

  /**
   * Memeriksa profil lokal saja. Bukan validasi ke server.
   */
  hasSession(): boolean {
    return Boolean(this.getCurrentUser());
  },

  /**
   * Memvalidasi sesi melalui backend.
   */
  async validateSession(): Promise<UserProfile> {
    return this.getMe();
  },

  /**
   * Menghapus data sesi di sisi client.
   */
  clearSession(): void {
    removeAccessToken();
    removeStoredUser();
  },

  /**
   * Logout: cabut refresh token di server, hapus cookie, bersihkan client.
   */
  async logout(): Promise<void> {
    await authHttp.post("/api/auth/logout").catch(() => {});
    this.clearSession();
  },
};
