import type { Unit } from "@/services/unitService";
import type { TarifWithJumlahPelanggan } from "@/services/tipeTarifService";

export type WmStatus = "Nomor Seri Tercatat" | "Nomor Seri Belum Tercatat";

export type PelangganTab = "semua" | "tercatat" | "belum_tercatat";

export interface Pelanggan {
  id: string;
  idPelangganPdam: string;
  nama: string;
  alamat: string;
  cabang: string;
  idUnit: string;
  tipeTarif: string;
  idTarif: string;
  wmNoSeri: string | null;
  wmStatus: WmStatus;
}

export interface PelangganInput {
  id_pelanggan_pdam: string;
  nama: string;
  alamat: string;
  id_unit: string;
  id_tarif: string;
}

export interface PelangganHeaderProps {
  isLoading: boolean;
  canCreate: boolean;
  onImport: () => void;
  onCreate: () => void;
}

export interface PelangganStatsProps {
  isLoading: boolean;
  totalPelanggan: number;
  totalWmTercatat: number;
  totalWmBelumTercatat: number;
}

export interface PelangganFiltersProps {
  tab: PelangganTab;
  onTabChange: (value: PelangganTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  cabangFilter: string;
  onCabangFilterChange: (value: string) => void;
  tarifFilter: string;
  onTarifFilterChange: (value: string) => void;
  units: Unit[];
  tariffs: TarifWithJumlahPelanggan[];
}

export interface PelangganTableProps {
  customers: Pelanggan[];
  filteredCount: number;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onDetail: (customer: Pelanggan) => void;
  onEdit: (customer: Pelanggan) => void;
  onDelete: (customer: Pelanggan) => void;
}

export interface PelangganFormModalProps {
  editing: Pelanggan | null;
  units: Unit[];
  tariffs: TarifWithJumlahPelanggan[];
  onClose: () => void;
  onSave: (data: PelangganInput) => Promise<void>;
}

export interface PelangganDetailModalProps {
  customer: Pelanggan;
  onClose: () => void;
  onEdit: () => void;
}

export interface PelangganImportModalProps {
  onClose: () => void;
  onImported: (count: number) => Promise<void>;
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    duration?: number,
  ) => void;
}

export interface PelangganDeleteModalProps {
  customer: Pelanggan;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
