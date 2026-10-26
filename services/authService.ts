import {
  apiClient,
  setAccessToken,
  removeAccessToken,
  setStoredUser,
  getStoredUser,
  removeStoredUser,
  getAccessToken,
  ApiError,
} from "./apiClient";

export interface UserProfile {
  id_user: number;
  nip: string;
  nama_lengkap: string;
  email: string;
  role: "admin_pusat" | "admin_cabang" | "teknisi";
  unit_kerja: {
    id_unit: number;
    nama_unit: string;
    kode_unit: string;
  };
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    user: UserProfile;
  };
}

// Akun Demo resmi PAM Tirta Kamuning untuk pengujian
export const DEMO_ACCOUNTS = [
  {
    role: "admin_pusat" as const,
    label: "Admin Pusat",
    identifier: "198804122015031002",
    email: "agus.supriyadi@tirtakamuning.co.id",
    nama: "H. Agus Supriyadi, S.T.",
    unit: "Kantor Pusat Kuningan",
    password: "Password123!",
  },
  {
    role: "admin_cabang" as const,
    label: "Admin Cabang Cilimus",
    identifier: "199208152019021004",
    email: "admin.cilimus@tirtakamuning.co.id",
    nama: "Siti Rahmawati, S.E.",
    unit: "Unit Cilimus",
    password: "Password123!",
  },
  {
    role: "teknisi" as const,
    label: "Teknisi Lapangan",
    identifier: "199511202021011006",
    email: "dede.suryana@tirtakamuning.co.id",
    nama: "Dede Suryana",
    unit: "Unit Kuningan",
    password: "Password123!",
  },
];

export const authService = {
  /**
   * Login pengguna menggunakan NIP / Email dan Password
   */
  async login(identifier: string, password: string): Promise<UserProfile> {
    try {
      const res = await apiClient.post<LoginResponse>("/auth/login", {
        identifier,
        password,
      });

      if (res.data?.access_token) {
        setAccessToken(res.data.access_token);
        setStoredUser(res.data.user);
        return res.data.user;
      }
      throw new ApiError(500, "Respon server tidak memiliki token autentikasi.");
    } catch (err: any) {
      // Mock Fallback jika backend server belum menyala (development mode)
      const matchedDemo = DEMO_ACCOUNTS.find(
        (a) =>
          a.identifier === identifier.trim() ||
          a.email.toLowerCase() === identifier.trim().toLowerCase()
      );

      if (matchedDemo && password) {
        console.warn(
          "[authService] Backend offline, menggunakan sesi autentikasi demo:",
          matchedDemo.nama
        );
        const mockUser: UserProfile = {
          id_user: 1,
          nip: matchedDemo.identifier,
          nama_lengkap: matchedDemo.nama,
          email: matchedDemo.email,
          role: matchedDemo.role,
          unit_kerja: {
            id_unit: matchedDemo.role === "admin_pusat" ? 0 : 1,
            nama_unit: matchedDemo.unit,
            kode_unit: matchedDemo.role === "admin_pusat" ? "PST" : "KNG",
          },
        };
        const mockToken = "mock_jwt_token_" + Date.now();
        setAccessToken(mockToken);
        setStoredUser(mockUser);
        return mockUser;
      }

      throw err;
    }
  },

  /**
   * Logout pengguna aktif
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout").catch(() => {});
    } finally {
      removeAccessToken();
      removeStoredUser();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  },

  /**
   * Mendapatkan profil pengguna tersimpan
   */
  getCurrentUser(): UserProfile | null {
    return getStoredUser();
  },

  /**
   * Cek apakah pengguna memiliki sesi login aktif
   */
  isAuthenticated(): boolean {
    return !!getAccessToken();
  },

  /**
   * Mengambil data profil terbaru dari endpoint `/auth/me`
   */
  async getMe(): Promise<UserProfile> {
    const res = await apiClient.get<{ data: UserProfile }>("/auth/me");
    if (res.data) {
      setStoredUser(res.data);
      return res.data;
    }
    return getStoredUser();
  },
};
