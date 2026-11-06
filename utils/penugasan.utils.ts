import type { Penugasan, PenugasanStatus } from "@/services/penugasanService";

import type {
  StatusFilter,
  StatusFilterOption,
  TicketView,
  PenugasanStats,
} from "@/types/penugasan.types";

export const ITEMS_PER_PAGE = 10;

export const statusLabel: Record<PenugasanStatus, string> = {
  pending: "Pending",
  proses: "Proses",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export const statusClass: Record<PenugasanStatus, string> = {
  pending: "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
  proses: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  selesai: "border-pdam-navy/30 bg-pdam-navy/10 text-pdam-navy",
  dibatalkan: "border-slate-300 bg-slate-100 text-slate-500",
};

export const statusFilters: StatusFilterOption[] = [
  { label: "Semua SPK", value: "Semua" },
  { label: "Pending Disposisi", value: "pending" },
  { label: "Dalam Pengerjaan", value: "proses" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

export const labelCls =
  "text-[11px] font-bold text-pdam-navy uppercase mb-1 block";

export const btnGhost =
  "btn btn-sm btn-ghost border border-slate-200 normal-case font-semibold text-slate-600";

export const btnPrimary =
  "btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case font-semibold";

export function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function toTicket(item: Penugasan): TicketView {
  return {
    id: item.id_penugasan,
    nomorSpk: item.nomor_spk,
    tanggal: formatDate(item.tgl_penugasan),
    cabang: item.unit?.nama_unit ?? "-",
    pelanggan: item.pelanggan?.nama ?? "-",
    idPelanggan: item.pelanggan?.id_pelanggan_pdam ?? "-",
    alamat: item.pelanggan?.alamat ?? "-",
    alasan: item.alasan,
    teknisi: item.teknisi?.fullname ?? null,
    status: item.status,
    raw: item,
  };
}

export function csvCell(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function downloadFile(
  filename: string,
  content: string,
  mime: string,
): void {
  const blob = new Blob(["\uFEFF" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function getPenugasanStats(tickets: TicketView[]): PenugasanStats {
  return {
    total: tickets.length,
    pending: tickets.filter((item) => item.status === "pending").length,
    proses: tickets.filter((item) => item.status === "proses").length,
    selesai: tickets.filter((item) => item.status === "selesai").length,
  };
}

export function getStatusFilterOptions(
  tickets: TicketView[],
  stats: PenugasanStats,
): StatusFilterOption[] {
  return statusFilters.map((item) => ({
    ...item,
    count:
      item.value === "Semua"
        ? stats.total
        : tickets.filter((ticket) => ticket.status === item.value).length,
  }));
}

export function filterPenugasan(
  tickets: TicketView[],
  search: string,
  cabangFilter: string,
  statusFilter: StatusFilter,
): TicketView[] {
  // Sengaja tidak menggunakan trim(), mengikuti perilaku kode asli.
  const q = search.toLowerCase();

  return tickets.filter((item) => {
    return (
      (statusFilter === "Semua" || item.status === statusFilter) &&
      (!cabangFilter || item.cabang === cabangFilter) &&
      (!q ||
        item.id.toLowerCase().includes(q) ||
        item.nomorSpk.toLowerCase().includes(q) ||
        item.pelanggan.toLowerCase().includes(q) ||
        item.idPelanggan.toLowerCase().includes(q) ||
        item.cabang.toLowerCase().includes(q) ||
        item.alasan.toLowerCase().includes(q))
    );
  });
}

export function getPenugasanUnits(tickets: TicketView[]): string[] {
  return [...new Set(tickets.map((item) => item.cabang))].sort();
}

export function getPaginatedPenugasan(
  filtered: TicketView[],
  currentPage: number,
) {
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const startIndex = filtered.length === 0 ? 0 : start + 1;

  const endIndex = Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length);

  return {
    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,
    paginatedTickets: filtered.slice(start, start + ITEMS_PER_PAGE),
  };
}

export function buildPenugasanCsv(rows: TicketView[]): string {
  const header = [
    "Nomor SPK",
    "Tanggal",
    "Unit",
    "ID Pelanggan",
    "Nama Pelanggan",
    "Alamat",
    "Alasan",
    "Teknisi",
    "Status",
  ];

  const dataRows = rows.map((item) => [
    item.nomorSpk,
    item.tanggal,
    item.cabang,
    item.idPelanggan,
    item.pelanggan,
    item.alamat,
    item.alasan,
    item.teknisi ?? "-",
    statusLabel[item.status],
  ]);

  return [
    header.map(csvCell).join(","),
    ...dataRows.map((row) => row.map(csvCell).join(",")),
  ].join("\n");
}

export function canEditPenugasan(
  status: PenugasanStatus,
  isAdminCabang: boolean,
): boolean {
  return isAdminCabang && status === "pending";
}

export function canDeletePenugasan(
  status: PenugasanStatus,
  isAdminCabang: boolean,
): boolean {
  return isAdminCabang && (status === "pending" || status === "dibatalkan");
}

export function canAssignTeknisi(
  status: PenugasanStatus,
  teknisi: string | null,
  isAdminCabang: boolean,
): boolean {
  return isAdminCabang && status === "pending" && !teknisi;
}
