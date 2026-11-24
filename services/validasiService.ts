import { apiClient, API_BASE_URL } from "./apiClient";

// ======================================================
// ENUMS
// ======================================================

export type UserRole = "admin_pusat" | "admin_cabang" | "teknisi" | "pimpinan";

export type StatusValidasi = "menunggu" | "disetujui" | "ditolak";

export type KondisiWmLama =
  | "normal"
  | "macet"
  | "kaca_pecah"
  | "berembun_parah"
  | "bodi_korosi";

export type TahapPenggantian = "data_wm_lama" | "menunggu_validasi";

export type PenugasanStatus = "pending" | "proses" | "selesai" | "dibatalkan";

// ======================================================
// RELATION TYPES
// ======================================================

export interface ValidasiPelanggan {
  id_pelanggan: string;
  id_pelanggan_pdam: string;
  nama: string;
  alamat: string;
  wm_no_seri_aktif: string | null;
}

export interface ValidasiUnit {
  id_unit: string;
  kode_unit: string;
  nama_unit: string;
}

export interface ValidasiTeknisi {
  id_user: string;
  fullname: string;
  username: string;
  role: UserRole;
}

export interface ValidasiMerkWm {
  id_merk: string;
  kode_wm: string;
  merk_wm: string;
  wm_digit: number;
}

export interface ValidasiPenugasan {
  id_penugasan: string;
  nomor_spk: string;
  status: PenugasanStatus;
  pelanggan: ValidasiPelanggan;
  unit: ValidasiUnit;
  teknisi: ValidasiTeknisi | null;
}

// ======================================================
// BAP TYPE
// ======================================================

export interface ValidasiBap {
  id_penggantian: string;
  id_penugasan: string;

  no_seri_wm_lama: string | null;
  stand_wm_lama: number | null;
  kondisi_fisik_wm_lama: KondisiWmLama;
  path_image_wm_lama: string | null;

  no_seri_wm_baru: string | null;
  stand_awal_wm_baru: number | null;
  path_image_wm_baru: string | null;

  tgl_penggantian: string | null;

  id_merk: string | null;
  merk: ValidasiMerkWm | null;

  id_teknisi: string;
  tahap_penggantian: TahapPenggantian;
  status_validasi: StatusValidasi | null;
  catatan_validasi: string | null;

  penugasan: ValidasiPenugasan;
  teknisi: ValidasiTeknisi;
}

// ======================================================
// QUERY & RESPONSE TYPES
// ======================================================

export interface ValidasiQuery {
  status_validasi?: StatusValidasi;
  page?: number;
  limit?: number;
}

export interface ValidasiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ValidasiListResult {
  data: ValidasiBap[];
  pagination: ValidasiPagination;
}

export interface TolakBapPayload {
  catatan_validasi: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ======================================================
// CONSTANTS
// ======================================================

const BASE_ENDPOINT = "/validasi";

const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_STORAGE_BUCKET = "water_meter";

// ======================================================
// IMAGE URL HELPER
// ======================================================

export function getValidasiImageUrl(
  path: string | null | undefined,
): string | null {
  if (!path) return null;

  const cleanPath = path.trim();

  if (!cleanPath) return null;

  // URL lengkap: gunakan langsung.
  if (/^https?:\/\//i.test(cleanPath)) {
    return cleanPath;
  }

  // Path foto lama yang masih menggunakan penyimpanan lokal.
  if (cleanPath.startsWith("/uploads/")) {
    if (cleanPath.endsWith("/undefined")) return null;

    return `${BACKEND_ORIGIN}${cleanPath}`;
  }

  // Path object Supabase Storage.
  if (!SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL belum dikonfigurasi.");
    return null;
  }

  const normalizedPath = cleanPath.replace(/^\/+/, "");

  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${normalizedPath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

// ======================================================
// VALIDASI SERVICE
// ======================================================

export const validasiService = {
  async findAll(params: ValidasiQuery = {}): Promise<ValidasiListResult> {
    const response = await apiClient.get<ApiResponse<ValidasiListResult>>(
      BASE_ENDPOINT,
      {
        status_validasi: params.status_validasi,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    );

    return response.data;
  },

  async findById(id: string): Promise<ValidasiBap> {
    const response = await apiClient.get<ApiResponse<ValidasiBap>>(
      `${BASE_ENDPOINT}/${encodeURIComponent(id)}`,
    );

    return response.data;
  },

  async setujui(id: string): Promise<ValidasiBap> {
    const response = await apiClient.patch<ApiResponse<ValidasiBap>>(
      `${BASE_ENDPOINT}/${encodeURIComponent(id)}/setujui`,
      {},
    );

    return response.data;
  },

  async tolak(id: string, payload: TolakBapPayload): Promise<ValidasiBap> {
    const response = await apiClient.patch<ApiResponse<ValidasiBap>>(
      `${BASE_ENDPOINT}/${encodeURIComponent(id)}/tolak`,
      payload,
    );

    return response.data;
  },
};
