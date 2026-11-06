import type {
  ValidasiBap,
  StatusValidasi,
  KondisiWmLama,
} from "@/services/validasiService";

import type { StatusLabel, ValidasiExportColumn } from "@/types/validasi.types";

export const PAGE_LIMIT = 20;
export const EXPORT_LIMIT = 100;

export const statusLabels: Record<StatusValidasi, StatusLabel> = {
  menunggu: "Menunggu",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

export const kondisiLabel: Record<KondisiWmLama, string> = {
  normal: "Normal",
  macet: "Macet",
  kaca_pecah: "Kaca Pecah",
  berembun_parah: "Berembun Parah",
  bodi_korosi: "Bodi Korosi",
};

export const statusClass: Record<StatusLabel, string> = {
  "Belum Diajukan": "border-slate-300 bg-slate-100 text-slate-600",
  Menunggu: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  Disetujui: "border-emerald-500/30 bg-emerald-50 text-emerald-700",
  Ditolak: "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
};

export const alasanTolak = [
  "Foto stand meter buram / tidak terbaca",
  "Deviasi atau selisih stand meter tidak wajar",
  "Nomor seri meteran fisik tidak sesuai dengan BAP",
  "Foto dokumentasi tidak lengkap",
  "Lainnya",
];

export const exportColumns: ValidasiExportColumn[] = [
  { id: "nomor_spk", label: "Nomor SPK" },
  { id: "tanggal", label: "Tanggal Penggantian" },
  { id: "nama_pelanggan", label: "Nama Pelanggan" },
  { id: "id_pelanggan_pdam", label: "ID Pelanggan PDAM" },
  { id: "alamat", label: "Alamat" },
  { id: "unit", label: "Unit / Cabang" },
  { id: "teknisi", label: "Teknisi" },
  { id: "sn_lama", label: "Nomor Seri WM Lama" },
  { id: "stand_lama", label: "Stand WM Lama" },
  { id: "kondisi", label: "Kondisi WM Lama" },
  { id: "sn_baru", label: "Nomor Seri WM Baru" },
  { id: "stand_baru", label: "Stand Awal WM Baru" },
  { id: "wm_aktif", label: "Nomor Seri WM Aktif" },
  { id: "status", label: "Status Validasi" },
  { id: "catatan", label: "Catatan Validasi" },
];

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan. Silakan coba kembali.";
}

export function getStatusLabel(status: StatusValidasi | null): StatusLabel {
  if (!status) {
    return "Belum Diajukan";
  }

  return statusLabels[status];
}

export function fmtStand(value: number | null): string {
  if (value === null) {
    return "-";
  }

  return `${value.toLocaleString("id-ID")} m³`;
}

export function formatDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function matchesSearch(item: ValidasiBap, search: string): boolean {
  const query = search.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const pelanggan = item.penugasan.pelanggan;

  const searchable = [
    item.penugasan.nomor_spk,
    pelanggan.nama,
    pelanggan.id_pelanggan_pdam,
    pelanggan.alamat,
    item.penugasan.unit.nama_unit,
    item.teknisi.fullname,
    item.no_seri_wm_lama,
    item.no_seri_wm_baru,
  ];

  return searchable.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(query),
  );
}

// Mencegah isi CSV dianggap sebagai formula spreadsheet.
function escapeCsvValue(value: unknown): string {
  let text = String(value ?? "");

  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadCsv(
  rows: ValidasiBap[],
  selectedColumns: string[],
): void {
  const selected = exportColumns.filter((column) =>
    selectedColumns.includes(column.id),
  );

  const headers = selected.map((column) => escapeCsvValue(column.label));

  const records = rows.map((item) => {
    const pelanggan = item.penugasan.pelanggan;

    const values: Record<string, unknown> = {
      nomor_spk: item.penugasan.nomor_spk,
      tanggal: formatDate(item.tgl_penggantian),
      nama_pelanggan: pelanggan.nama,
      id_pelanggan_pdam: pelanggan.id_pelanggan_pdam,
      alamat: pelanggan.alamat,
      unit: item.penugasan.unit.nama_unit,
      teknisi: item.teknisi.fullname,
      sn_lama: item.no_seri_wm_lama,
      stand_lama: item.stand_wm_lama,
      kondisi: kondisiLabel[item.kondisi_fisik_wm_lama],
      sn_baru: item.no_seri_wm_baru,
      stand_baru: item.stand_awal_wm_baru,
      wm_aktif: pelanggan.wm_no_seri_aktif,
      status: getStatusLabel(item.status_validasi),
      catatan: item.catatan_validasi,
    };

    return selected
      .map((column) => escapeCsvValue(values[column.id]))
      .join(",");
  });

  const csvContent = [headers.join(","), ...records].join("\r\n");

  // BOM agar karakter UTF-8 terbaca dengan benar di Excel.
  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `data-validasi-bap-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
