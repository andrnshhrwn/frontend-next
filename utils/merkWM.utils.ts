import type {
  MerkWM,
  MerkWMExportColumn,
  MerkWMFormState,
} from "../types/merkWM.types";

export const ITEMS_PER_PAGE = 6;

export const EMPTY_FORM: MerkWMFormState = {
  kode_wm: "",
  merk_wm: "",
  wm_digit: "5",
};

export const EXPORT_COLUMNS: MerkWMExportColumn[] = [
  { id: "kode_wm", label: "Kode WM" },
  { id: "id_merk", label: "ID Merk" },
  { id: "merk_wm", label: "Nama Merk" },
  { id: "wm_digit", label: "Jumlah Digit Stand" },
];

export function sortMerkWM(data: MerkWM[]): MerkWM[] {
  return [...data].sort((a, b) =>
    a.kode_wm.localeCompare(b.kode_wm, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
}

export function filterMerkWM(data: MerkWM[], search: string): MerkWM[] {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return data;

  return data.filter(
    (item) =>
      item.id_merk.toLowerCase().includes(keyword) ||
      item.kode_wm.toLowerCase().includes(keyword) ||
      item.merk_wm.toLowerCase().includes(keyword) ||
      String(item.wm_digit).includes(keyword),
  );
}

export function validateMerkWMForm(form: MerkWMFormState): string | null {
  const kode = form.kode_wm.trim();
  const nama = form.merk_wm.trim();
  const digit = Number(form.wm_digit);

  if (!kode) {
    return "Kode WM wajib diisi.";
  }

  if (kode.length > 20) {
    return "Kode WM maksimal 20 karakter.";
  }

  if (!nama) {
    return "Nama merk wajib diisi.";
  }

  if (nama.length > 50) {
    return "Nama merk maksimal 50 karakter.";
  }

  if (form.wm_digit.trim() === "" || !Number.isInteger(digit) || digit <= 0) {
    return "Jumlah digit harus berupa bilangan bulat positif.";
  }

  return null;
}

export function createMerkWMPayload(form: MerkWMFormState) {
  return {
    kode_wm: form.kode_wm.trim(),
    merk_wm: form.merk_wm.trim(),
    wm_digit: Number(form.wm_digit),
  };
}

function escapeCSV(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function generateMerkWMCSV(
  data: MerkWM[],
  selectedCols: string[],
): string {
  const header = selectedCols
    .map(
      (column) =>
        EXPORT_COLUMNS.find((item) => item.id === column)?.label || column,
    )
    .map(escapeCSV)
    .join(",");

  const rows = data.map((item) =>
    selectedCols
      .map((column) => {
        const value = String(item[column as keyof MerkWM] ?? "");

        return escapeCSV(value);
      })
      .join(","),
  );

  return [header, ...rows].join("\r\n");
}

export function downloadMerkWMCSV(csvContent: string): void {
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `data-merk-wm-pam-tirta-kamuning-${Date.now()}.csv`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
