"use client";

import { useState } from "react";
import { BadgeCheck, CheckCircle2, ClipboardCheck, Clock } from "lucide-react";

import { PageHeader, StatCard } from "@/components/ui";

import {
  laporanService,
  type LaporanFilters,
  type PenggantianItem,
  type PenggantianSummary,
} from "@/services/laporanService";
import { formatTanggal } from "@/lib/formatDate";
import { formatNumber } from "@/utils/pengirimanWm.utils";
import { useLaporan } from "@/hooks/modules/laporan/useLaporan";
import LaporanFilterBar from "@/components/modules/laporan/LaporanFilterBar";
import LaporanTable from "@/components/modules/laporan/LaporanTable";
import LaporanBadge from "@/components/modules/laporan/LaporanBadge";
import LaporanDetailModal from "@/components/modules/laporan/LaporanDetailModal";

const VALIDASI_OPTIONS = [
  { value: "menunggu", label: "Menunggu" },
  { value: "disetujui", label: "Disetujui" },
  { value: "ditolak", label: "Ditolak" },
];

const kondisi = (v: string) => v.replace(/_/g, " ");

export default function LaporanPenggantianPage() {
  const [filters, setFilters] = useState<LaporanFilters>({
    page: 1,
    limit: 10,
  });
  const [selected, setSelected] = useState<PenggantianItem | null>(null);

  const { result, loading, error, reload } = useLaporan<
    PenggantianItem,
    PenggantianSummary
  >(laporanService.penggantian, filters);

  const s = result?.data.summary;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Penggantian WM (BAP)"
        subtitle="Rekap berita acara penggantian Water Meter beserta status validasinya."
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total BAP"
          value={formatNumber(s?.total ?? 0)}
          subtext="Seluruh BAP pada filter ini"
          icon={<ClipboardCheck className="h-5 w-5" />}
          variant="navy"
        />
        <StatCard
          title="Menunggu Validasi"
          value={formatNumber(s?.per_status_validasi.menunggu ?? 0)}
          subtext="Belum diputuskan admin"
          icon={<Clock className="h-5 w-5" />}
          variant="red"
        />
        <StatCard
          title="Disetujui"
          value={formatNumber(s?.per_status_validasi.disetujui ?? 0)}
          subtext="BAP yang telah divalidasi"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="emerald"
        />
        <StatCard
          title="Ditolak"
          value={formatNumber(s?.per_status_validasi.ditolak ?? 0)}
          subtext="Perlu diperbaiki teknisi"
          icon={<BadgeCheck className="h-5 w-5" />}
          variant="primary"
        />
      </div>

      <LaporanFilterBar
        value={filters}
        onChange={setFilters}
        extra={{
          key: "status_validasi",
          label: "Validasi",
          options: VALIDASI_OPTIONS,
        }}
      />

      <LaporanTable<PenggantianItem>
        rows={result?.data.items ?? []}
        rowKey={(r) => r.id_penggantian}
        meta={result?.meta}
        loading={loading}
        emptyText="Tidak ada BAP pada filter ini."
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onDetail={setSelected}
        columns={[
          {
            header: "No. SPK & Tanggal",
            render: (r) => (
              <>
                <span className="block font-sans font-bold text-pdam-primary">
                  {r.penugasan.nomor_spk}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatTanggal(r.tgl_penggantian)}
                </span>
              </>
            ),
          },
          {
            header: "Pelanggan",
            render: (r) => (
              <>
                <span className="block font-semibold text-slate-800">
                  {r.penugasan.pelanggan.nama}
                </span>
                <span className="text-[10px] text-slate-400">
                  {r.penugasan.unit.nama_unit}
                </span>
              </>
            ),
          },
          {
            header: "WM Lama",
            render: (r) => (
              <>
                <span className="block font-sans text-slate-700">
                  {r.no_seri_wm_lama ?? "-"}
                </span>
                <span className="text-[10px] capitalize text-slate-400">
                  Stand {r.stand_wm_lama ?? "-"} ·{" "}
                  {kondisi(r.kondisi_fisik_wm_lama)}
                </span>
              </>
            ),
          },
          {
            header: "WM Baru",
            render: (r) => (
              <>
                <span className="block font-sans text-slate-700">
                  {r.no_seri_wm_baru ?? "-"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {r.merk?.merk_wm ?? "-"} · Stand {r.stand_awal_wm_baru ?? "-"}
                </span>
              </>
            ),
          },
          { header: "Teknisi", render: (r) => r.teknisi.fullname },
          {
            header: "Validasi",
            render: (r) => (
              <LaporanBadge value={r.status_validasi ?? "belum_diajukan"} />
            ),
          },
        ]}
      />

      <LaporanDetailModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detail Penggantian WM (BAP)"
        subtitle={selected?.penugasan.nomor_spk}
        fields={
          selected
            ? [
                {
                  label: "Tanggal Penggantian",
                  value: formatTanggal(selected.tgl_penggantian),
                },
                {
                  label: "Status Validasi",
                  value: (
                    <LaporanBadge
                      value={selected.status_validasi ?? "belum_diajukan"}
                    />
                  ),
                },
                {
                  label: "Pelanggan",
                  value: selected.penugasan.pelanggan.nama,
                },
                {
                  label: "ID Pelanggan PDAM",
                  value: selected.penugasan.pelanggan.id_pelanggan_pdam,
                },
                { label: "Alamat", value: selected.penugasan.pelanggan.alamat },
                { label: "Unit", value: selected.penugasan.unit.nama_unit },
                { label: "Teknisi", value: selected.teknisi.fullname },
                { label: "Merk WM Baru", value: selected.merk?.merk_wm ?? "-" },
                {
                  label: "No. Seri WM Lama",
                  value: selected.no_seri_wm_lama ?? "-",
                },
                {
                  label: "Stand WM Lama",
                  value: selected.stand_wm_lama ?? "-",
                },
                {
                  label: "Kondisi WM Lama",
                  value: kondisi(selected.kondisi_fisik_wm_lama),
                },
                {
                  label: "No. Seri WM Baru",
                  value: selected.no_seri_wm_baru ?? "-",
                },
                {
                  label: "Stand Awal WM Baru",
                  value: selected.stand_awal_wm_baru ?? "-",
                },
              ]
            : []
        }
      >
        {selected?.catatan_validasi && (
          <div>
            <span className="mb-1 block font-bold text-slate-500">
              Catatan Validasi:
            </span>
            <p className="rounded-md border border-slate-100 bg-slate-50 p-2.5 text-slate-600">
              {selected.catatan_validasi}
            </p>
          </div>
        )}
      </LaporanDetailModal>
    </div>
  );
}
