"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Pagination, SearchInput } from "@/components/ui";

import type { MerkWM } from "@/types/merkWM.types";

import { ITEMS_PER_PAGE } from "@/utils/merkWM.utils";

interface MerkWMTableProps {
  loading: boolean;
  search: string;
  paginated: MerkWM[];
  filteredLength: number;
  safePage: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onPageChange: (page: number) => void;
  onEdit: (item: MerkWM) => void;
  onDelete: (item: MerkWM) => void;
}

export default function MerkWMTable({
  loading,
  search,
  paginated,
  filteredLength,
  safePage,
  totalPages,
  onSearchChange,
  onClearSearch,
  onPageChange,
  onEdit,
  onDelete,
}: MerkWMTableProps) {
  return (
    <>
      {/* Pencarian */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Cari kode, ID, atau nama merk..."
          className="w-full sm:max-w-xs"
        />

        {search && (
          <button
            type="button"
            onClick={onClearSearch}
            className="shrink-0 text-xs text-slate-500 underline hover:text-pdam-primary"
          >
            Hapus Pencarian
          </button>
        )}
      </div>

      {/* Tabel */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Kode WM</th>
                <th className="px-4 py-3">Nama Merk Water Meter</th>
                <th className="px-4 py-3 text-center">Digit Stand</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    Memuat data merk water meter...
                  </td>
                </tr>
              ) : paginated.length > 0 ? (
                paginated.map((item) => (
                  <tr
                    key={item.id_merk}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-pdam-primary">
                      <span className="rounded border border-pdam-primary/20 bg-pdam-primary/10 px-2 py-0.5 text-xs">
                        {item.kode_wm}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {item.merk_wm}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
                        {item.wm_digit} digit
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="btn btn-xs btn-ghost text-slate-600 hover:bg-pdam-primary/10 hover:text-pdam-primary"
                          title="Edit Merk"
                          aria-label={`Edit merk ${item.merk_wm}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="btn btn-xs btn-ghost text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Hapus Merk"
                          aria-label={`Hapus merk ${item.merk_wm}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    {search
                      ? "Tidak ada merk water meter yang sesuai dengan pencarian."
                      : "Belum ada data merk water meter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredLength > 0 && (
          <div className="border-t border-slate-100 p-4">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filteredLength}
              onPageChange={onPageChange}
              startIndex={(safePage - 1) * ITEMS_PER_PAGE}
              endIndex={Math.min(safePage * ITEMS_PER_PAGE, filteredLength)}
            />
          </div>
        )}
      </div>
    </>
  );
}
