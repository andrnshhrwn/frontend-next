"use client";

import { ArrowRight, ArrowUpRight, Loader2, ShieldCheck } from "lucide-react";

import { Pagination } from "@/components/ui";

import type { ValidasiBap } from "@/services/validasiService";
import type { ValidasiPagination } from "@/types/validasi.types";

import {
  fmtStand,
  formatDate,
  getStatusLabel,
  statusClass,
} from "@/utils/validasi.utils";

interface ValidasiTableProps {
  data: ValidasiBap[];
  loading: boolean;
  pagination: ValidasiPagination | null;
  page: number;
  total: number;
  pageLimit: number;
  canManageValidation: boolean;
  onPageChange: (page: number) => void;
  onOpenDetail: (id: string) => void;
}

export default function ValidasiTable({
  data,
  loading,
  pagination,
  page,
  total,
  pageLimit,
  canManageValidation,
  onPageChange,
  onOpenDetail,
}: ValidasiTableProps) {
  const currentPage = pagination?.page ?? page;

  const currentStart = total === 0 ? 0 : (currentPage - 1) * pageLimit;

  const currentEnd = Math.min(currentStart + data.length, total);

  return (
    <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-sm w-full">
          <thead>
            <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
              <th className="py-3.5 pl-5">SPK &amp; TANGGAL</th>
              <th className="py-3.5">PELANGGAN &amp; UNIT</th>
              <th className="py-3.5">TEKNISI</th>
              <th className="py-3.5">METER LAMA → BARU</th>
              <th className="py-3.5">STATUS VALIDASI</th>
              <th className="py-3.5 text-right pr-5">AKSI</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-pdam-primary" />

                  <p className="text-xs text-slate-500 mt-2">
                    Memuat data BAP...
                  </p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />

                  <p className="font-semibold">Tidak ada data BAP</p>

                  <p className="text-xs mt-1">
                    Belum ada data yang sesuai dengan filter atau pencarian.
                  </p>
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const status = getStatusLabel(item.status_validasi);

                const canReviewItem =
                  canManageValidation && status === "Menunggu";

                return (
                  <tr
                    key={item.id_penggantian}
                    className="hover:bg-pdam-bg/60 text-xs transition-colors"
                  >
                    <td className="py-3.5 pl-5 font-bold">
                      <span className="text-pdam-primary font-sans block">
                        {item.penugasan.nomor_spk}
                      </span>

                      <span className="text-xs text-slate-700 font-normal">
                        {formatDate(item.tgl_penggantian)}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className="font-bold text-xs text-pdam-navy block">
                        {item.penugasan.pelanggan.nama}
                      </span>

                      <span className="text-xs text-slate-500 flex flex-row gap-0.5 items-center">
                        <span>{item.penugasan.unit.nama_unit}</span>
                        <span className="text-xs text-pdam-primary">|</span>
                        <span className="text-slate-900">
                          {item.penugasan.pelanggan.id_pelanggan_pdam}
                        </span>
                      </span>
                    </td>

                    <td className="py-3.5 font-medium text-xs text-slate-700">
                      {item.teknisi.fullname}
                    </td>

                    <td className="py-3.5">
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-500 font-sans">
                          {item.no_seri_wm_lama ?? "-"} (
                          {fmtStand(item.stand_wm_lama)})
                        </span>

                        <div className="flex items-center gap-1 font-bold font-sans">
                          <ArrowRight className="w-3 h-3 text-pdam-primary shrink-0" />

                          <span className="text-pdam-primary">
                            {item.no_seri_wm_baru ?? "-"} (
                            {fmtStand(item.stand_awal_wm_baru)})
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`badge badge-sm font-bold border ${statusClass[status]}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="py-3.5 text-right pr-5">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(item.id_penggantian)}
                        className={`btn btn-xs normal-case gap-1 ${
                          canReviewItem
                            ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0"
                            : "btn-ghost text-pdam-primary hover:underline"
                        }`}
                      >
                        {canReviewItem ? "Periksa & Validasi" : "Lihat Detail"}

                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && pagination && pagination.totalPages > 0 && (
        <div className="px-5 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            totalItems={total}
            itemsPerPage={pageLimit}
            startIndex={currentStart}
            endIndex={currentEnd}
          />
        </div>
      )}
    </div>
  );
}
