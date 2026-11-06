"use client";

import { ArrowUpRight } from "lucide-react";

import { Pagination } from "@/components/ui";

import type { TicketView } from "@/types/penugasan.types";

import {
  canAssignTeknisi,
  canDeletePenugasan,
  canEditPenugasan,
  statusClass,
  statusLabel,
} from "@/utils/penugasan.utils";

interface PenugasanTableProps {
  tickets: TicketView[];
  filteredCount: number;
  totalCount: number;
  loading: boolean;
  isAdminCabang: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onAssign: (ticket: TicketView) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDetail: (id: string) => void;
}

export default function PenugasanTable({
  tickets,
  filteredCount,
  totalCount,
  loading,
  isAdminCabang,
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  endIndex,
  onPageChange,
  onAssign,
  onEdit,
  onDelete,
  onDetail,
}: PenugasanTableProps) {
  return (
    <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-pdam-bg/60">
        <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-pdam-navy">
          Daftar Surat Perintah Kerja (SPK)
          <span className="badge border border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary text-[10px] font-semibold">
            Data Backend
          </span>
        </h3>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>
            Menampilkan {filteredCount} dari {totalCount} penugasan
          </span>

          <span>•</span>

          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            Data dimuat
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-sm w-full">
          <thead>
            <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
              <th className="py-3.5 pl-5">ID &amp; Tanggal</th>
              <th className="py-3.5">Unit</th>
              <th className="py-3.5">Pelanggan &amp; Alamat</th>
              <th className="py-3.5">Alasan</th>
              <th className="py-3.5">Teknisi</th>
              <th className="py-3.5">Status</th>
              <th className="py-3.5 text-right pr-5">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  Memuat data penugasan...
                </td>
              </tr>
            ) : (
              tickets.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-pdam-bg/60 transition-colors"
                >
                  <td className="py-3.5 pl-5 font-bold">
                    <span className="text-pdam-primary font-mono block">
                      {item.nomorSpk}
                    </span>

                    <span className="text-[10px] text-slate-400 font-normal">
                      {item.tanggal}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="badge bg-slate-100 text-slate-700 border-slate-200 badge-sm font-bold">
                      {item.cabang}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-semibold text-pdam-navy block">
                      {item.pelanggan}
                    </span>

                    <span className="text-[10px] text-slate-500">
                      {item.alamat}
                    </span>

                    <span className="text-[10px] text-slate-400 block font-mono">
                      {item.idPelanggan}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="text-slate-700">{item.alasan}</span>
                  </td>

                  <td className="py-3.5">
                    {item.teknisi ? (
                      <span className="font-medium text-slate-700">
                        {item.teknisi}
                      </span>
                    ) : canAssignTeknisi(
                        item.status,
                        item.teknisi,
                        isAdminCabang,
                      ) ? (
                      <button
                        onClick={() => onAssign(item)}
                        className="btn btn-xs btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-primary hover:text-white font-semibold normal-case"
                      >
                        + Pilih
                      </button>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`badge badge-sm font-bold border ${statusClass[item.status]}`}
                    >
                      {statusLabel[item.status]}
                    </span>
                  </td>

                  <td className="py-3.5 text-right pr-5">
                    <div className="flex items-center justify-end gap-2">
                      {canEditPenugasan(item.status, isAdminCabang) && (
                        <button
                          onClick={() => onEdit(item.id)}
                          className="text-xs font-semibold text-pdam-primary hover:text-pdam-navy hover:underline"
                        >
                          Edit
                        </button>
                      )}

                      {canDeletePenugasan(item.status, isAdminCabang) && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                        >
                          Hapus
                        </button>
                      )}

                      <button
                        onClick={() => onDetail(item.id)}
                        className="text-pdam-primary hover:text-pdam-navy font-semibold hover:underline flex items-center gap-0.5"
                      >
                        Detail
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}

            {!loading && filteredCount === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  Tidak ada penugasan yang sesuai filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className="p-4 border-t border-slate-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={filteredCount}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </div>
      )}
    </div>
  );
}
