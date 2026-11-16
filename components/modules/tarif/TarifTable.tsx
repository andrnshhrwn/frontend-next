import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui";

import type { Tarif } from "@/types/tarif.types";
import { ITEMS_PER_PAGE } from "@/utils/tarif.utils";

interface TarifTableProps {
  loading: boolean;
  error: string;
  paginated: Tarif[];
  filteredLength: number;
  safePage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onEdit: (tarif: Tarif) => void;
  onDelete: (tarif: Tarif) => void;
}

export default function TarifTable({
  loading,
  error,
  paginated,
  filteredLength,
  safePage,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onEdit,
  onDelete,
}: TarifTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Kode Tarif</th>
              <th className="px-4 py-3">Nama Golongan Tarif</th>
              <th className="px-4 py-3 text-center">Jumlah Pelanggan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Memuat data tarif...
                  </span>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  {error
                    ? "Data tarif belum dapat ditampilkan."
                    : "Tidak ada data golongan tarif yang ditemukan."}
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={item.id_tarif}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 font-sans font-bold text-pdam-primary">
                      {item.kode_tarif}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-700">
                    {item.nama_tarif}
                  </td>

                  <td className="px-4 py-3 text-center text-slate-600">
                    {item.jumlahPelanggan.toLocaleString("id-ID")}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Edit tarif"
                        aria-label={`Edit tarif ${item.nama_tarif}`}
                        className="btn btn-xs btn-ghost text-slate-600 hover:bg-pdam-primary/10 hover:text-pdam-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        title="Hapus tarif"
                        aria-label={`Hapus tarif ${item.nama_tarif}`}
                        className="btn btn-xs btn-ghost text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredLength > 0 && (
        <div className="border-t border-slate-100 p-3">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredLength}
            itemsPerPage={ITEMS_PER_PAGE}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
