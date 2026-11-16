import type { Unit, UnitForm } from "../types/unit.types";

export const ITEMS_PER_PAGE = 6;

export const EMPTY_FORM: UnitForm = {
  kode_unit: "",
  nama_unit: "",
};

export interface UnitValidationResult {
  error: string;
  payload: {
    kode_unit: string;
    nama_unit: string;
  } | null;
}

export function filterAndSortUnits(data: Unit[], search: string): Unit[] {
  const sortedData = [...data].sort((a, b) =>
    a.kode_unit.localeCompare(b.kode_unit, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  const keyword = search.trim().toLowerCase();

  if (!keyword) return sortedData;

  return sortedData.filter(
    (unit) =>
      unit.id_unit.toLowerCase().includes(keyword) ||
      unit.kode_unit.toLowerCase().includes(keyword) ||
      unit.nama_unit.toLowerCase().includes(keyword),
  );
}

export function validateUnitForm(form: UnitForm): UnitValidationResult {
  const kode_unit = form.kode_unit.trim();
  const nama_unit = form.nama_unit.trim();

  if (!kode_unit) {
    return {
      error: "Kode Unit wajib diisi.",
      payload: null,
    };
  }

  if (kode_unit.length > 20) {
    return {
      error: "Kode Unit maksimal 20 karakter.",
      payload: null,
    };
  }

  if (!nama_unit) {
    return {
      error: "Nama Unit wajib diisi.",
      payload: null,
    };
  }

  if (nama_unit.length > 100) {
    return {
      error: "Nama Unit maksimal 100 karakter.",
      payload: null,
    };
  }

  return {
    error: "",
    payload: {
      kode_unit,
      nama_unit,
    },
  };
}
