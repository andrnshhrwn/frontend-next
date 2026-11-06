import type {
  Penugasan,
  PenugasanStatus,
  Teknisi,
} from "@/services/penugasanService";

export type StatusFilter = "Semua" | PenugasanStatus;

export interface Pelanggan {
  id_pelanggan: string;
  id_pelanggan_pdam: string;
  id_unit: string;
  nama: string;
  alamat: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TicketInput {
  id_pelanggan: string;
  id_unit: string;
  alasan: string;
}

export interface TicketView {
  id: string;
  nomorSpk: string;
  tanggal: string;
  cabang: string;
  pelanggan: string;
  idPelanggan: string;
  alamat: string;
  alasan: string;
  teknisi: string | null;
  status: PenugasanStatus;
  raw: Penugasan;
}

export interface PenugasanUpdatePayload {
  tgl_penugasan?: string;
  alasan?: string;
}

export interface PenugasanStats {
  total: number;
  pending: number;
  proses: number;
  selesai: number;
}

export interface StatusFilterOption {
  label: string;
  value: StatusFilter;
  count?: number;
}

export interface PenugasanModalState {
  showExport: boolean;
  showCreate: boolean;
  assignId: string | null;
  detailId: string | null;
  cancelId: string | null;
  editId: string | null;
  deleteId: string | null;
}

export interface PenugasanAccess {
  isAdminPusat: boolean;
  isAdminCabang: boolean;
  unitId: string;
  unitName: string;
}

export interface PenugasanDataState {
  tickets: TicketView[];
  pelanggan: Pelanggan[];
  teknisi: Teknisi[];
  loading: boolean;
  loadingTeknisi: boolean;
  error: string;
}

export interface PenugasanFilterState {
  search: string;
  cabangFilter: string;
  statusFilter: StatusFilter;
  currentPage: number;
}

export interface PenugasanTablePagination {
  currentPage: number;
  safeCurrentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}
