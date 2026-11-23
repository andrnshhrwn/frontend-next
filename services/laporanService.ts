import { apiClient } from "@/services/apiClient";

export interface Meta {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
}

export interface LaporanResponse<TItem, TSummary> {
  status: string;
  message: string;
  data: { items: TItem[]; summary: TSummary };
  meta: Meta;
}

export type LaporanFilters = Record<string, string | number | undefined | null>;

// ---------- Tipe data ----------

export interface PengirimanItem {
  id_pengiriman: string;
  no_pengiriman: string;
  tgl_pengiriman: string;
  total_wm: number;
  catatan: string | null;
  unit_tujuan: { kode_unit: string; nama_unit: string };
  user_pencatat: { fullname: string };
  details: {
    id_detail: string;
    ukuran_dn: string;
    jumlah: number;
    merk: { kode_wm: string; merk_wm: string };
  }[];
}

export interface PengirimanSummary {
  total_pengiriman: number;
  total_wm: number;
}

export type PenugasanStatus = "pending" | "proses" | "selesai" | "dibatalkan";

export interface PenugasanItem {
  id_penugasan: string;
  nomor_spk: string;
  tgl_penugasan: string;
  alasan: string;
  status: PenugasanStatus;
  pelanggan: { id_pelanggan_pdam: string; nama: string; alamat: string };
  unit: { kode_unit: string; nama_unit: string };
  pembuat: { fullname: string };
  teknisi: { fullname: string } | null;
}

export interface PenugasanSummary {
  total: number;
  per_status: Record<PenugasanStatus, number>;
}

export type StatusValidasi = "menunggu" | "disetujui" | "ditolak";

export interface PenggantianItem {
  id_penggantian: string;
  no_seri_wm_lama: string | null;
  stand_wm_lama: number | null;
  kondisi_fisik_wm_lama: string;
  no_seri_wm_baru: string | null;
  stand_awal_wm_baru: number | null;
  tgl_penggantian: string | null;
  tahap_penggantian: "data_wm_lama" | "menunggu_validasi";
  status_validasi: StatusValidasi | null;
  catatan_validasi: string | null;
  penugasan: {
    nomor_spk: string;
    pelanggan: { id_pelanggan_pdam: string; nama: string; alamat: string };
    unit: { kode_unit: string; nama_unit: string };
  };
  teknisi: { fullname: string };
  merk: { kode_wm: string; merk_wm: string } | null;
}

export interface PenggantianSummary {
  total: number;
  per_status_validasi: Record<StatusValidasi | "belum_diajukan", number>;
}

// ---------- Service ----------

export const laporanService = {
  pengiriman: (f: LaporanFilters) =>
    apiClient.get<LaporanResponse<PengirimanItem, PengirimanSummary>>(
      "/laporan/pengiriman-wm",
      f,
    ),

  penugasan: (f: LaporanFilters) =>
    apiClient.get<LaporanResponse<PenugasanItem, PenugasanSummary>>(
      "/laporan/penugasan",
      f,
    ),

  penggantian: (f: LaporanFilters) =>
    apiClient.get<LaporanResponse<PenggantianItem, PenggantianSummary>>(
      "/laporan/penggantian-wm",
      f,
    ),
};
