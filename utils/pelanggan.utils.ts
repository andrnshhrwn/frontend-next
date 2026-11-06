import type {
  Pelanggan as PelangganApi,
  PelangganPayload,
} from "@/services/pelangganService";

import type {
  Pelanggan,
  PelangganInput,
  WmStatus,
} from "@/types/pelanggan.types";

export const ITEMS_PER_PAGE = 10;

export const wmBadge: Record<WmStatus, string> = {
  "Nomor Seri Tercatat": "border-emerald-300 bg-emerald-50 text-emerald-700",
  "Nomor Seri Belum Tercatat": "border-amber-300 bg-amber-50 text-amber-700",
};

export const labelCls =
  "text-[11px] font-bold text-pdam-navy uppercase mb-1 block";

export const inputCls =
  "input input-bordered input-sm w-full text-xs border-slate-200 focus:border-pdam-primary";

export const selectCls =
  "select select-bordered select-sm w-full text-xs border-slate-200 bg-white focus:border-pdam-primary";

export const btnGhost =
  "btn btn-sm btn-ghost border border-slate-200 normal-case font-semibold text-slate-600";

export const btnPrimary =
  "btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case font-semibold";

export function mapPelanggan(data: PelangganApi): Pelanggan {
  const wmNoSeri = data.wm_no_seri_aktif;

  return {
    id: data.id_pelanggan,
    idPelangganPdam: data.id_pelanggan_pdam,
    nama: data.nama,
    alamat: data.alamat,
    cabang: data.unit.nama_unit,
    idUnit: data.id_unit,
    tipeTarif: data.tarif.nama_tarif,
    idTarif: data.id_tarif,
    wmNoSeri,
    wmStatus: wmNoSeri ? "Nomor Seri Tercatat" : "Nomor Seri Belum Tercatat",
  };
}

export function mapPelangganPayload(data: PelangganInput): PelangganPayload {
  return {
    id_pelanggan_pdam: data.id_pelanggan_pdam,
    nama: data.nama,
    alamat: data.alamat,
    id_unit: data.id_unit,
    id_tarif: data.id_tarif,
  };
}
