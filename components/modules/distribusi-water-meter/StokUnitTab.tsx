import { MapPin } from "lucide-react";

import { SearchInput, SelectDropdown } from "@/components/ui";

import type { PengirimanWmStockTabProps } from "@/types/pengirimanWm.types";

import { aggregateDetails, formatNumber } from "@/utils/pengirimanWm.utils";

export default function StokUnitTab({
  filteredUnit,
  search,
  cabangFilter,
  unitFilterOptions,
  onSearchChange,
  onCabangFilterChange,
  getUnitPengiriman,
  getUnitWmTerpasang,
  getUnitTotalDikirim,
  getUnitStok,
}: PengirimanWmStockTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Cari unit cabang..."
          className="w-full sm:max-w-md"
        />

        <SelectDropdown
          value={cabangFilter}
          onChange={onCabangFilterChange}
          options={unitFilterOptions}
          icon={<MapPin className="h-3.5 w-3.5" />}
          className="w-full sm:w-56"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUnit.map((unit) => {
          const unitPengiriman = getUnitPengiriman(unit.id_unit);
          const totalDikirim = getUnitTotalDikirim(unit.id_unit);
          const totalTerpasang = getUnitWmTerpasang(unit.id_unit);
          const stokTersedia = getUnitStok(unit.id_unit);
          const detailAggregated = aggregateDetails(unitPengiriman);

          return (
            <div
              key={unit.id_unit}
              className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Unit Cabang
                  </span>
                  <h4 className="text-base font-bold text-slate-800 capitalize">
                    {unit.nama_unit}
                  </h4>
                </div>

                <span className="whitespace-nowrap rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {formatNumber(stokTersedia)} WM Tersedia
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-slate-50 p-2">
                  <span className="block text-[10px] text-slate-500">
                    Dikirim
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatNumber(totalDikirim)}
                  </span>
                </div>

                <div className="rounded-md bg-blue-50 p-2">
                  <span className="block text-[10px] text-blue-600">
                    Terpasang
                  </span>
                  <span className="text-sm font-bold text-blue-800">
                    {formatNumber(totalTerpasang)}
                  </span>
                </div>

                <div className="rounded-md bg-emerald-50 p-2">
                  <span className="block text-[10px] text-emerald-600">
                    Tersedia
                  </span>
                  <span className="text-sm font-bold text-emerald-800">
                    {formatNumber(stokTersedia)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="text-xs font-semibold text-slate-600">
                  Rincian Pengiriman per Merk dan Ukuran:
                </div>

                {detailAggregated.length > 0 ? (
                  detailAggregated.map((detail) => (
                    <div
                      key={`${detail.id_merk}-${detail.ukuran_dn}`}
                      className="flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 p-2 text-xs"
                    >
                      <div>
                        <span className="block font-medium text-slate-700">
                          {detail.merk}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {detail.ukuran_dn}
                        </span>
                      </div>

                      <span className="whitespace-nowrap font-mono font-bold text-pdam-primary">
                        {formatNumber(detail.jumlah)} Unit
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs italic text-slate-400">
                    Belum ada catatan pengiriman.
                  </div>
                )}
              </div>

              {stokTersedia < 0 && (
                <p className="text-[11px] text-red-600">
                  Perhatian: jumlah WM aktif terpasang melebihi total pengiriman
                  yang tercatat. Periksa kelengkapan data.
                </p>
              )}
            </div>
          );
        })}

        {filteredUnit.length === 0 && (
          <div className="col-span-full rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            Tidak ada unit cabang yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
