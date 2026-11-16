import type { TarifWithJumlahPelanggan } from "@/services/tipeTarifService";

export type Tarif = TarifWithJumlahPelanggan;

export interface TarifForm {
  kode_tarif: string;
  nama_tarif: string;
}

export interface TarifExportOptions {
  scope: "filtered" | "all";
  selectedCols: string[];
}
