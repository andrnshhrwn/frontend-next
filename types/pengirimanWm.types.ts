import type { FormEvent } from "react";

import type { PengirimanWm } from "@/services/pengirimanService";
import type { Unit } from "@/services/unitService";
import type { MerkWM } from "@/services/merkWMService";
import type { Pelanggan } from "@/services/pelangganService";

export interface FormDetailItem {
  id_merk: string;
  ukuran_dn: string;
  jumlah: number;
}

export interface AggregatedDetail {
  id_merk: string;
  merk: string;
  ukuran_dn: string;
  jumlah: number;
}

export interface PengirimanWmData {
  pengirimanList: PengirimanWm[];
  unitList: Unit[];
  merkList: MerkWM[];
  pelangganList: Pelanggan[];
}

export interface PengirimanWmStats {
  totalPengirimanWM: number;
  totalWmTerpasang: number;
  totalStokTersedia: number;
  unitPenerimaCount: number;
}

export interface UsePengirimanWmActionsOptions {
  fetchData: () => Promise<void>;
  closeFormModal: () => void;
}

export interface SubmitPengirimanOptions {
  editingPengiriman: PengirimanWm | null;
  noPengiriman: string;
  tglPengiriman: string;
  unitTujuan: string;
  catatan: string;
  details: FormDetailItem[];
}

export interface PengirimanWmExportOptions {
  scope: "filtered" | "all";
  selectedCols: string[];
}

export interface PengirimanWmFormProps {
  isOpen: boolean;
  isSaving: boolean;
  isEditing: boolean;
  noPengiriman: string;
  tglPengiriman: string;
  unitTujuan: string;
  catatan: string;
  details: FormDetailItem[];
  unitList: Unit[];
  merkList: MerkWM[];
  errorMessage: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNoPengirimanChange: (value: string) => void;
  onTglPengirimanChange: (value: string) => void;
  onUnitTujuanChange: (value: string) => void;
  onCatatanChange: (value: string) => void;
  onAddDetail: () => void;
  onDetailChange: (
    index: number,
    field: keyof FormDetailItem,
    value: string | number,
  ) => void;
  onRemoveDetail: (index: number) => void;
}

export interface PengirimanWmDetailModalProps {
  isOpen: boolean;
  pengiriman: PengirimanWm | null;
  onClose: () => void;
  onEdit: (item: PengirimanWm) => void;
}

export interface PengirimanWmStockTabProps {
  unitList: Unit[];
  filteredUnit: Unit[];
  search: string;
  cabangFilter: string;
  unitFilterOptions: string[];
  onSearchChange: (value: string) => void;
  onCabangFilterChange: (value: string) => void;
  getUnitPengiriman: (idUnit: string) => PengirimanWm[];
  getUnitWmTerpasang: (idUnit: string) => number;
  getUnitTotalDikirim: (idUnit: string) => number;
  getUnitStok: (idUnit: string) => number;
}

export interface PengirimanWmHistoryTabProps {
  data: PengirimanWm[];
  search: string;
  cabangFilter: string;
  unitFilterOptions: string[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onSearchChange: (value: string) => void;
  onCabangFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onDetail: (item: PengirimanWm) => void;
  onEdit: (item: PengirimanWm) => void;
  onDelete: (item: PengirimanWm) => void;
}
