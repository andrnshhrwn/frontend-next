"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, Clock, Loader } from "lucide-react";

import { PageHeader, StatCard } from "@/components/ui";

import {
  laporanService,
  type LaporanFilters,
  type PenugasanItem,
  type PenugasanSummary,
} from "@/services/laporanService";
import { formatTanggal } from "@/lib/formatDate";
import { formatNumber } from "@/utils/pengirimanWm.utils";
import { useLaporan } from "@/hooks/modules/laporan/useLaporan";
import LaporanFilterBar from "@/components/modules/laporan/LaporanFilterBar";
import LaporanTable from "@/components/modules/laporan/LaporanTable";
import LaporanDetailModal from "@/components/modules/laporan/LaporanDetailModal";
import LaporanBadge from "@/components/modules/laporan/LaporanBadge";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "proses", label: "Proses" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export default function LaporanPenugasanPage() {
  const [filters, setFilters] = useState<LaporanFilters>({
    page: 1,
    limit: 10,
  });

  const [selected, setSelected] = useState<PenugasanItem | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { result, loading, error, reload } = useLaporan<
    PenugasanItem,
    PenugasanSummary
  >(laporanService.penugasan, filters);

  const s = result?.data.summary;

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
      const exportUrl = `/api/proxy/laporan/penugasan/export${
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
        title="Laporan Penugasan"
        subtitle="Rekap penugasan penggantian WM berdasarkan periode dan status."
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Penugasan"
          value={formatNumber(s?.total ?? 0)}
          subtext="Seluruh penugasan pada filter ini"
          icon={<ClipboardList className="h-5 w-5" />}
          variant="navy"
        />

        <StatCard
          title="Pending"
          value={formatNumber(s?.per_status.pending ?? 0)}
          subtext="Belum diproses teknisi"
          icon={<Clock className="h-5 w-5" />}
          variant="red"
        />

        <StatCard
          title="Proses"
          value={formatNumber(s?.per_status.proses ?? 0)}
          subtext="Sedang dikerjakan"
          icon={<Loader className="h-5 w-5" />}
          variant="primary"
        />

        <StatCard
          title="Selesai"
          value={formatNumber(s?.per_status.selesai ?? 0)}
          subtext="Penugasan terselesaikan"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="emerald"
        />
      </div>

      <LaporanFilterBar
        value={filters}
        onChange={setFilters}
        onExport={handleExport}
        exporting={exporting}
        extra={{
          key: "status",
          label: "Status",
          options: STATUS_OPTIONS,
        }}
      />

      <LaporanTable<PenugasanItem>
        rows={result?.data.items ?? []}
        rowKey={(r) => r.id_penugasan}
        meta={result?.meta}
        loading={loading}
        emptyText="Tidak ada penugasan pada filter ini."
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onDetail={setSelected}
        columns={[
          {
            header: "No. SPK & Tanggal",
            render: (r) => (
              <>
                <span className="block font-sans font-bold text-pdam-primary">
                  {r.nomor_spk}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatTanggal(r.tgl_penugasan)}
                </span>
              </>
            ),
          },
          {
            header: "Pelanggan",
            render: (r) => (
              <>
                <span className="block font-semibold text-slate-800">
                  {r.pelanggan.nama}
                </span>
                <span className="text-[10px] text-slate-400">
                  {r.pelanggan.id_pelanggan_pdam}
                </span>
              </>
            ),
          },
          {
            header: "Unit",
            render: (r) => (
              <span className="inline-block rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {r.unit.nama_unit}
              </span>
            ),
          },
          {
            header: "Alasan",
            render: (r) => r.alasan,
          },
          {
            header: "Teknisi",
            render: (r) => r.teknisi?.fullname ?? "-",
          },
          {
            header: "Status",
            render: (r) => <LaporanBadge value={r.status} />,
          },
        ]}
      />

      <LaporanDetailModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detail Penugasan"
        subtitle={selected?.nomor_spk}
        fields={
          selected
            ? [
                {
                  label: "Tanggal Penugasan",
                  value: formatTanggal(selected.tgl_penugasan),
                },
                {
                  label: "Status",
                  value: <LaporanBadge value={selected.status} />,
                },
                {
                  label: "Pelanggan",
                  value: selected.pelanggan.nama,
                },
                {
                  label: "ID Pelanggan PDAM",
                  value: selected.pelanggan.id_pelanggan_pdam,
                },
                {
                  label: "Alamat",
                  value: selected.pelanggan.alamat,
                },
                {
                  label: "Unit",
                  value: selected.unit.nama_unit,
                },
                {
                  label: "Dibuat Oleh",
                  value: selected.pembuat.fullname,
                },
                {
                  label: "Teknisi",
                  value: selected.teknisi?.fullname ?? "Belum ditugaskan",
                },
                {
                  label: "Alasan",
                  value: selected.alasan,
                },
              ]
            : []
        }
      />
    </div>
  );
}
