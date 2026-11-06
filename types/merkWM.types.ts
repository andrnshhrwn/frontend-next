import type { MerkWM, MerkWMPayload } from "@/services/merkWMService";

export type { MerkWM, MerkWMPayload };

export interface MerkWMFormState {
  kode_wm: string;
  merk_wm: string;
  wm_digit: string;
}

export interface MerkWMExportColumn {
  id: string;
  label: string;
}

export interface MerkWMExportOptions {
  scope: "filtered" | "all";
  selectedCols: string[];
}
