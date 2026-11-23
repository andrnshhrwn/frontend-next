import {
  apiRequest,
  ApiError,
  authHttp,
  toApiError,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
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
  user: UserProfile;
}

// ======================================================
// AUTH SERVICE
// ======================================================

export const authService = {
  /**
   * Login lewat Route Handler Next. Token disimpan sebagai cookie httpOnly,
   * sehingga response hanya berisi data user.
   */
  async login(
    username: string,
    password: string,
    rememberMe = false,
  ): Promise<LoginResult> {
    let user: UserProfile | undefined;

    try {
      const res = await authHttp.post<{ data: LoginResult }>(
        "/api/auth/login",
        { username, password, rememberMe },
      );
      user = res.data?.data?.user;
    } catch (error) {
      throw toApiError(error, 10000);
    }

    if (!user) {
      throw new ApiError(500, "Respons login dari server tidak valid.");
    }

    setStoredUser(user, rememberMe);

    return { user };
  },

  /**
   * Mengambil profil pengguna dari backend (lewat proxy).
   */
  async getMe(): Promise<UserProfile> {
    const response = await apiRequest<ApiResponse<UserProfile>>("/auth/me");
    return response.data;
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
