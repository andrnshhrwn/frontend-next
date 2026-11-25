"use client";

import { useState } from "react";
import { PackageCheck, Truck } from "lucide-react";

import { PageHeader, StatCard } from "@/components/ui";
import {
  laporanService,
  type LaporanFilters,
  type PengirimanItem,
  type PengirimanSummary,
} from "@/services/laporanService";
import { formatTanggal } from "@/lib/formatDate";
import { formatNumber } from "@/utils/pengirimanWm.utils";
import { useLaporan } from "@/hooks/modules/laporan/useLaporan";
import LaporanFilterBar from "@/components/modules/laporan/LaporanFilterBar";
import LaporanTable from "@/components/modules/laporan/LaporanTable";
import LaporanDetailModal from "@/components/modules/laporan/LaporanDetailModal";

export default function LaporanPengirimanPage() {
  const [filters, setFilters] = useState<LaporanFilters>({
    page: 1,
    limit: 10,
  });

  const [selected, setSelected] = useState<PengirimanItem | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { result, loading, error, reload } = useLaporan<
    PengirimanItem,
    PengirimanSummary
  >(laporanService.pengiriman, filters);

  const summary = result?.data.summary;

  const handleExport = () => {
    if (exporting) return;

    setExporting(true);
    setExportError(null);

    try {
      const params = new URLSearchParams();

      // Kirim filter aktif tanpa parameter pagination.
      Object.entries(filters).forEach(([key, value]) => {
        if (
          key === "page" ||
          key === "limit" ||
          value === undefined ||
          value === null ||
          value === "" ||
          value === "all"
        ) {
          return;
        }

        params.set(key, String(value));
      });

      const query = params.toString();
      const exportUrl = `/api/proxy/laporan/pengiriman-wm/export${
        query ? `?${query}` : ""
      }`;

      // Browser mengunduh file menggunakan cookie HTTP-only.
      const link = document.createElement("a");
      link.href = exportUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setExportError("Gagal memulai unduhan Excel. Silakan coba kembali.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Pengiriman Water Meter"
        subtitle="Rekap pengiriman WM ke unit cabang berdasarkan periode."
        badge=""
        badgeVariant="primary"
      />

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="font-semibold hover:underline"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {exportError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {exportError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Pengiriman"
          value={formatNumber(summary?.total_pengiriman ?? 0)}
          subtext="Jumlah catatan pengiriman pada filter ini"
          icon={<Truck className="h-5 w-5" />}
          variant="navy"
        />

        <StatCard
          title="Total WM Dikirim"
          value={formatNumber(summary?.total_wm ?? 0)}
          subtext="Akumulasi unit WM pada filter ini"
          icon={<PackageCheck className="h-5 w-5" />}
          variant="primary"
        />
      </div>

      <LaporanFilterBar
        value={filters}
        onChange={setFilters}
        onExport={handleExport}
        exporting={exporting}
      />

      <LaporanTable<PengirimanItem>
        rows={result?.data.items ?? []}
        rowKey={(r) => r.id_pengiriman}
        meta={result?.meta}
        loading={loading}
        emptyText="Tidak ada pengiriman pada filter ini."
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onDetail={setSelected}
        columns={[
          {
            header: "No. Pengiriman & Tanggal",
            render: (r) => (
              <>
                <span className="block font-sans font-bold text-pdam-primary">
                  {r.no_pengiriman}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatTanggal(r.tgl_pengiriman)}
                </span>
              </>
            ),
          },
          {
            header: "Unit Tujuan",
            render: (r) => (
              <span className="inline-block rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {r.unit_tujuan.nama_unit}
              </span>
            ),
          },
          {
            header: "Total",
            render: (r) => (
              <span className="font-sans font-bold text-slate-700">
                {formatNumber(r.total_wm)} Unit
              </span>
            ),
          },
          {
            header: "Rincian Merk & Jumlah",
            render: (r) => (
              <div className="space-y-1">
                {r.details.map((d) => (
                  <div key={d.id_detail} className="text-[11px] text-slate-600">
                    <span className="font-semibold">{d.merk.merk_wm}</span>
                    {" / "}
                    {d.ukuran_dn}: {formatNumber(d.jumlah)} Unit
                  </div>
                ))}
              </div>
            ),
          },
          {
            header: "Catatan",
            className: "max-w-xs truncate text-slate-500",
            render: (r) => r.catatan || "-",
          },
        ]}
      />

      <LaporanDetailModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detail Pengiriman Water Meter"
        subtitle={selected?.no_pengiriman}
        fields={
          selected
            ? [
                {
                  label: "Tanggal Pengiriman",
                  value: formatTanggal(selected.tgl_pengiriman),
                },
                {
                  label: "Unit Tujuan",
                  value: selected.unit_tujuan.nama_unit,
                },
                {
                  label: "Dicatat Oleh",
                  value: selected.user_pencatat.fullname,
                },
                {
                  label: "Total WM",
                  value: `${formatNumber(selected.total_wm)} Unit`,
                },
              ]
            : []
        }
      >
        {selected && (
          <>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                    <th className="px-3 py-2">Merk WM</th>
                    <th className="px-3 py-2">Ukuran DN</th>
                    <th className="px-3 py-2 text-right">Jumlah</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {selected.details.map((d) => (
                    <tr key={d.id_detail}>
                      <td className="px-3 py-2 font-medium text-slate-800">
                        {d.merk.merk_wm}
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {d.ukuran_dn}
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-pdam-primary">
                        {formatNumber(d.jumlah)} Unit
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="rounded-md border border-slate-100 bg-slate-50 p-2.5 text-slate-600">
              {selected.catatan || "Tidak ada catatan khusus."}
            </p>
          </>
        )}
      </LaporanDetailModal>
    </div>
  );
}
