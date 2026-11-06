import {
  CalendarDays,
  Building2,
  FileText,
  Package,
  Pencil,
} from "lucide-react";

import { BaseModal } from "@/components/ui";

import type { PengirimanWmDetailModalProps } from "@/types/pengirimanWm.types";

import { aggregateDetails, formatNumber } from "@/utils/pengirimanWm.utils";

export default function PengirimanDetailModal({
  isOpen,
  pengiriman,
  onClose,
  onEdit,
}: PengirimanWmDetailModalProps) {
  if (!pengiriman) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Pengiriman Water Meter"
      subtitle={pengiriman.no_pengiriman}
      icon={<FileText className="h-5 w-5" />}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:grid-cols-2">
          <div>
            <span className="mb-1 block text-[10px] font-semibold uppercase text-slate-400">
              <CalendarDays className="mr-1 inline h-3 w-3" />
              Tanggal Pengiriman
            </span>
            <span className="font-semibold text-slate-800">
              {pengiriman.tgl_pengiriman}
            </span>
          </div>

          <div>
            <span className="mb-1 block text-[10px] font-semibold uppercase text-slate-400">
              <Building2 className="mr-1 inline h-3 w-3" />
              Unit Cabang Tujuan
            </span>
            <span className="font-semibold text-slate-800">
              {pengiriman.unit_tujuan?.nama_unit ?? "-"}
            </span>
          </div>

          <div>
            <span className="mb-1 block text-[10px] font-semibold uppercase text-slate-400">
              Dicatat Oleh
            </span>
            <span className="font-semibold text-slate-800">
              {pengiriman.user_pusat?.fullname ?? "-"}
            </span>
          </div>

          <div>
            <span className="mb-1 block text-[10px] font-semibold uppercase text-slate-400">
              Total WM
            </span>
            <span className="font-semibold text-pdam-primary">
              {formatNumber(pengiriman.total_wm)} Unit
            </span>
          </div>
        </div>

        <div>
          <span className="mb-2 block font-bold text-slate-500">
            Rincian Merk dan Ukuran:
          </span>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                    <th className="px-3 py-2">Merk WM</th>
                    <th className="px-3 py-2">Ukuran DN</th>
                    <th className="px-3 py-2 text-right">Jumlah</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {aggregateDetails([pengiriman]).map((detail) => (
                    <tr key={`${detail.id_merk}-${detail.ukuran_dn}`}>
                      <td className="px-3 py-2 font-medium text-slate-800">
                        {detail.merk}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-500">
                        {detail.ukuran_dn}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-pdam-primary">
                        {formatNumber(detail.jumlah)} Unit
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50 font-bold text-slate-900">
                    <td colSpan={2} className="px-3 py-2.5 text-right">
                      Total Akumulasi:
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-pdam-primary">
                      {formatNumber(pengiriman.total_wm)} Unit
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div>
          <span className="mb-1 block font-bold text-slate-500">
            <Package className="mr-1 inline h-3.5 w-3.5" />
            Catatan Pengiriman:
          </span>
          <p className="rounded-md border border-slate-100 bg-slate-50 p-2.5 text-slate-600">
            {pengiriman.catatan || "Tidak ada catatan khusus."}
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm rounded-md text-slate-600"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={() => onEdit(pengiriman)}
            className="btn btn-sm rounded-md border-none bg-pdam-primary text-white hover:bg-pdam-primary/90"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Pengiriman
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
