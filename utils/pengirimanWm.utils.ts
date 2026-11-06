import type {
  AggregatedDetail,
  FormDetailItem,
} from "@/types/pengirimanWm.types";

import type { PengirimanWm } from "@/services/pengirimanService";

export const EXPORT_COLUMNS = [
  { id: "noPengiriman", label: "No. Pengiriman" },
  { id: "tglPengiriman", label: "Tanggal" },
  { id: "unitTujuan", label: "Unit Tujuan" },
  { id: "totalWm", label: "Total WM" },
  { id: "catatan", label: "Catatan" },
];

export const ITEMS_PER_PAGE = 8;

export const DEFAULT_UKURAN_DN = 'DN 15 (1/2")';

export function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan yang tidak diketahui.";
}

export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

export function aggregateDetails(
  pengiriman: PengirimanWm[],
): AggregatedDetail[] {
  const aggregated = new Map<string, AggregatedDetail>();

  pengiriman.forEach((item) => {
    item.details.forEach((detail) => {
      const key = `${detail.id_merk}-${detail.ukuran_dn}`;
      const existing = aggregated.get(key);

      if (existing) {
        existing.jumlah += detail.jumlah;
      } else {
        aggregated.set(key, {
          id_merk: detail.id_merk,
          merk: detail.merk?.merk_wm ?? "Merk tidak diketahui",
          ukuran_dn: detail.ukuran_dn,
          jumlah: detail.jumlah,
        });
      }
    });
  });

  return Array.from(aggregated.values()).sort((a, b) => {
    const merkCompare = a.merk.localeCompare(b.merk);

    return merkCompare !== 0
      ? merkCompare
      : a.ukuran_dn.localeCompare(b.ukuran_dn);
  });
}

export function createDefaultFormDetail(idMerk: string): FormDetailItem {
  return {
    id_merk: idMerk,
    ukuran_dn: DEFAULT_UKURAN_DN,
    jumlah: 100,
  };
}

export function createEmptyFormDetail(idMerk: string): FormDetailItem {
  return {
    id_merk: idMerk,
    ukuran_dn: DEFAULT_UKURAN_DN,
    jumlah: 50,
  };
}
