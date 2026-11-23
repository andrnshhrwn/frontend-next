"use client";

import { ArrowUpRight, Calendar, MapPin, Pencil, Trash2 } from "lucide-react";

import { Pagination, SearchInput, SelectDropdown } from "@/components/ui";

import { useAuthStore } from "@/lib/auth/auth-store";

import type { PengirimanWmHistoryTabProps } from "@/types/pengirimanWm.types";

import { aggregateDetails, formatNumber } from "@/utils/pengirimanWm.utils";

import { formatTanggal } from "@/lib/formatDate";

export default function PengirimanHistoryTab({
  data,
  search,
  cabangFilter,
  unitFilterOptions,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  canManage,
  onSearchChange,
  onCabangFilterChange,
  onPageChange,
  onDetail,
  onEdit,
  onDelete,
}: PengirimanWmHistoryTabProps) {
  // Mengambil status autentikasi dan user dari Zustand.
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);

  const authLoading = authStatus === "idle" || authStatus === "checking";

  // Filter unit tujuan hanya untuk Admin Pusat.
  const isAdminPusat =
    !authLoading &&
    authStatus === "authenticated" &&
    user?.role === "admin_pusat";

  // Pastikan hak pengelolaan juga sesuai role.
  const canEdit =
    !authLoading &&
    authStatus === "authenticated" &&
    canManage &&
    user?.role === "admin_cabang";

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {/* Pencarian dan filter */}
      <div className="flex flex-col items-center justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Cari no. pengiriman, unit tujuan, atau catatan..."
          className="w-full sm:max-w-md"
        />

        {isAdminPusat && (
          <SelectDropdown
            value={cabangFilter}
            onChange={onCabangFilterChange}
            options={unitFilterOptions}
            icon={<MapPin className="h-3.5 w-3.5" />}
            className="w-full sm:w-56"
          />
        )}
      </div>

      {/* Tabel riwayat pengiriman */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">No. Pengiriman & Tanggal</th>

              <th className="px-4 py-3">Unit Tujuan</th>

              <th className="px-4 py-3">Total Pengiriman</th>

              <th className="px-4 py-3">Rincian Merk & Jumlah</th>

              <th className="px-4 py-3">Catatan</th>

              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {data.map((item) => (
              <tr
                key={item.id_pengiriman}
                className="transition-colors hover:bg-slate-50/60"
              >
                {/* Nomor dan tanggal pengiriman */}
                <td className="px-4 py-3.5">
                  <span className="block font-sans font-bold text-pdam-primary">
                    {item.no_pengiriman}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {formatTanggal(item.tgl_pengiriman)}
                  </span>
                </td>

                {/* Unit tujuan */}
                <td className="px-4 py-3.5 font-semibold text-slate-800">
                  <span className="inline-block rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {item.unit_tujuan?.nama_unit ?? "-"}
                  </span>
                </td>

                {/* Total pengiriman */}
                <td className="px-4 py-3.5">
                  <span className="font-sans text-xs font-bold text-slate-700">
                    {formatNumber(item.total_wm)} Unit
                  </span>
                </td>

                {/* Rincian merk dan jumlah */}
                <td className="px-4 py-3.5">
                  <div className="space-y-1">
                    {aggregateDetails([item]).map((detail) => (
                      <div
                        key={`${detail.id_merk}-${detail.ukuran_dn}`}
                        className="text-[11px] text-slate-600"
                      >
                        <span className="font-semibold">{detail.merk}</span>
                        {" / "}
                        {detail.ukuran_dn}: {formatNumber(detail.jumlah)} Unit
                      </div>
                    ))}
                  </div>
                </td>

                {/* Catatan */}
                <td className="max-w-xs truncate px-4 py-3.5 text-slate-500">
                  {item.catatan || "-"}
                </td>

                {/* Aksi */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onDetail(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-pdam-primary hover:text-pdam-navy hover:underline"
                    >
                      Detail
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                    {canEdit && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title="Edit pengiriman"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          title="Hapus pengiriman"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Hapus
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {/* Data kosong */}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  Tidak ada catatan pengiriman yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-slate-100 p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={onPageChange}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>
    </div>
  );
}
