import type { ValidasiBap, StatusValidasi } from "@/services/validasiService";

export type StatusLabel =
  | "Belum Diajukan"
  | "Menunggu"
  | "Disetujui"
  | "Ditolak";

export type StatusFilter = "Semua" | StatusValidasi;

export type ExportScope = "filtered" | "all";

export interface ValidasiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ValidasiExportColumn {
  id: string;
  label: string;
}

export interface ValidasiExportArgs {
  scope: ExportScope;
  selectedCols: string[];
}

export interface ValidasiDataResult {
  data: ValidasiBap[];
  pagination: ValidasiPagination | null;
}

export interface ValidasiReviewModalProps {
  item: ValidasiBap;
  onClose: () => void;
  onApprove: () => Promise<void>;
  onReject: (catatan: string) => Promise<void>;
  processing: boolean;
}
