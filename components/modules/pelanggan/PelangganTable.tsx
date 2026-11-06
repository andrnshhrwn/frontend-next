"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { Pagination } from "@/components/ui";

import type { Pelanggan, PelangganTableProps } from "@/types/pelanggan.types";

import { wmBadge } from "@/utils/pelanggan.utils";

export function PelangganTable({
  customers,
  filteredCount,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  onPageChange,
  onDetail,
  onEdit,
  onDelete,
}: PelangganTableProps) {
  return (
    <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-sm w-full">
          <thead>
            <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
              <th className="py-3.5 pl-5">ID &amp; NAMA PELANGGAN</th>

              <th className="py-3.5">ALAMAT &amp; UNIT CABANG</th>

              <th className="py-3.5">GOLONGAN TARIF</th>

              <th className="py-3.5">PENCATATAN NOMOR SERI WM</th>

              <th className="py-3.5 text-right pr-5">AKSI</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <span className="loading loading-spinner loading-md text-pdam-primary" />

                  <p className="text-xs text-slate-500 mt-2">
                    Memuat data pelanggan...
                  </p>
                </td>
              </tr>
            ) : filteredCount === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  Tidak ada data pelanggan yang ditemukan.
                </td>
              </tr>
            ) : (
              customers.map((item: Pelanggan) => (
                <tr
                  key={item.id}
                  className="hover:bg-pdam-bg/60 transition-colors"
                >
                  <td className="py-3.5 pl-5">
                    <span className="font-bold text-pdam-navy block">
                      {item.nama}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      {item.idPelangganPdam}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="text-slate-600 block">{item.alamat}</span>

                    <span className="font-bold text-[11px] text-pdam-navy">
                      {item.cabang}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-medium text-slate-700">
                      {item.tipeTarif}
                    </span>
                  </td>

                  <td className="py-3.5">
                    {item.wmNoSeri ? (
                      <div>
                        <span
                          className={`badge badge-xs font-bold border ${wmBadge[item.wmStatus]}`}
                        >
                          Nomor Seri Tercatat
                        </span>

                        <span className="font-mono text-[10px] text-slate-500 block mt-1">
                          {item.wmNoSeri}
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`badge badge-xs font-bold border ${wmBadge[item.wmStatus]}`}
                      >
                        Nomor Seri Belum Tercatat
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 text-right pr-5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onDetail(item)}
                        title="Detail pelanggan"
                        aria-label={`Detail pelanggan ${item.nama}`}
                        className="btn btn-ghost btn-xs btn-square text-emerald-700 hover:bg-emerald-700/10"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Edit pelanggan"
                        aria-label={`Edit pelanggan ${item.nama}`}
                        className="btn btn-ghost btn-xs btn-square text-pdam-primary hover:bg-pdam-primary/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        title="Hapus pelanggan"
                        aria-label={`Hapus pelanggan ${item.nama}`}
                        className="btn btn-ghost btn-xs btn-square text-pdam-red hover:bg-pdam-red/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalItems > 0 && (
        <div className="p-4 border-t border-slate-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex + 1}
            endIndex={endIndex}
          />
        </div>
      )}
    </div>
  );
}
