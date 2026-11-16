import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui";

import type { Unit } from "@/types/unit.types";

interface UnitTableProps {
  loading: boolean;
  search: string;
  paginated: Unit[];
  filteredLength: number;
  safePage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}

export default function UnitTable({
  loading,
  search,
  paginated,
  filteredLength,
  safePage,
  totalPages,
  itemsPerPage,
  startIndex,
  endIndex,
  onPageChange,
  onEdit,
  onDelete,
}: UnitTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Kode Unit</th>
              <th className="px-4 py-3">Nama Unit</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Memuat data Unit...
                  </span>
                </td>
              </tr>
            ) : paginated.length > 0 ? (
              paginated.map((item) => (
                <tr
                  key={item.id_unit}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-sans font-bold text-pdam-primary">
                    <span className="rounded border border-pdam-primary/20 bg-pdam-primary/10 px-2 py-0.5 text-xs">
                      {item.kode_unit}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-medium text-slate-700">
                    {item.nama_unit}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="btn btn-xs btn-ghost text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit Unit"
                        aria-label={`Edit unit ${item.nama_unit}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="btn btn-xs btn-ghost text-slate-500 hover:bg-red-50 hover:text-red-600"
                        title="Hapus Unit"
                        aria-label={`Hapus unit ${item.nama_unit}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  {search
                    ? "Tidak ada unit yang sesuai dengan pencarian."
                    : "Belum ada data unit."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredLength > 0 && (
        <div className="border-t border-slate-100 p-4">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredLength}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
