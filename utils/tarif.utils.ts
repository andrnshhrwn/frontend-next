import type { Tarif, TarifForm } from "../types/tarif.types";

export const ITEMS_PER_PAGE = 6;

export const initialForm: TarifForm = {
  kode_tarif: "",
  nama_tarif: "",
};

export interface TarifValidationResult {
  error: string;
  payload: {
    kode_tarif: string;
    nama_tarif: string;
  } | null;
}

export function validateTarifForm(
  form: TarifForm,
  data: Tarif[],
  editingId: string | undefined,
): TarifValidationResult {
  const kode = form.kode_tarif.trim().toUpperCase();
  const nama = form.nama_tarif.trim();

  if (!kode || !nama) {
    return {
      error: "Kode dan nama golongan tarif wajib diisi.",
      payload: null,
    };
  }

  if (kode.length > 20) {
    return {
      error: "Kode tarif maksimal 20 karakter.",
      payload: null,
    };
  }

  if (nama.length > 100) {
    return {
      error: "Nama golongan tarif maksimal 100 karakter.",
      payload: null,
    };
  }

  // Pemeriksaan duplikasi lokal.
  // Backend tetap menjadi pemeriksaan utama.
  const duplicateCode = data.some(
    (item) =>
      item.kode_tarif.toLowerCase() === kode.toLowerCase() &&
      item.id_tarif !== editingId,
  );

  if (duplicateCode) {
    return {
      error: "Kode tarif sudah digunakan.",
      payload: null,
    };
  }

  const duplicateName = data.some(
    (item) =>
      item.nama_tarif.toLowerCase() === nama.toLowerCase() &&
      item.id_tarif !== editingId,
  );

  if (duplicateName) {
    return {
      error: "Nama golongan tarif sudah digunakan.",
      payload: null,
    };
  }

  return {
    error: "",
    payload: {
      kode_tarif: kode,
      nama_tarif: nama,
    },
  };
}

const columnLabels: Record<string, string> = {
  kode_tarif: "Kode Tarif",
  id_tarif: "ID Tarif",
  nama_tarif: "Nama Golongan Tarif",
  jumlahPelanggan: "Jumlah Pelanggan",
};

function escapeCSV(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildTarifCSV(
  sourceData: Tarif[],
  selectedCols: string[],
): string {
  const headers = selectedCols.map((id) => columnLabels[id] ?? id);

  const rows = sourceData.map((item) =>
    selectedCols.map((id) => String(item[id as keyof Tarif] ?? "")),
  );

  return [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\r\n");
}
