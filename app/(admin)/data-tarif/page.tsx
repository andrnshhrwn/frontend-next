"use client";

import React, { useState } from "react";
import { Download, Plus, Pencil, Trash2, Tags, Users, Layers, AlertCircle } from "lucide-react";
import {
  PageHeader,
  StatCard,
  SearchInput,
  BaseModal,
  DeleteConfirmModal,
  ExportModal,
  Pagination,
} from "@/components/ui";

interface Tarif {
  id_tarif: string;
  nama_tarif: string;
  jumlahPelanggan: number;
}

const initialData: Tarif[] = [
  { id_tarif: "S1", nama_tarif: "Gol. 1A - Sosial Umum (Tempat Ibadah, Panti Asuhan)", jumlahPelanggan: 85 },
  { id_tarif: "S2", nama_tarif: "Gol. 1B - Sosial Khusus (Sekolah Negeri, RS Pemerintah)", jumlahPelanggan: 120 },
  { id_tarif: "R1", nama_tarif: "Gol. 2A - Rumah Tangga Sederhana", jumlahPelanggan: 2450 },
  { id_tarif: "R2", nama_tarif: "Gol. 2B - Rumah Tangga Menengah", jumlahPelanggan: 1280 },
  { id_tarif: "R3", nama_tarif: "Gol. 2C - Rumah Tangga Mampu", jumlahPelanggan: 390 },
  { id_tarif: "N1", nama_tarif: "Gol. 3A - Niaga Kecil (Warung, Kios, Usaha Rumahan)", jumlahPelanggan: 340 },
  { id_tarif: "N2", nama_tarif: "Gol. 3B - Niaga Besar (Hotel, Restoran, Perbankan)", jumlahPelanggan: 95 },
  { id_tarif: "IND", nama_tarif: "Gol. 4A - Industri Manufaktur & Pengolahan", jumlahPelanggan: 32 },
  { id_tarif: "IP", nama_tarif: "Gol. Khusus - Instansi Pemerintah & Militer", jumlahPelanggan: 28 },
];

const EXPORT_COLUMNS = [
  { id: "id_tarif", label: "Kode Golongan Tarif" },
  { id: "nama_tarif", label: "Deskripsi / Klasifikasi Tarif" },
  { id: "jumlahPelanggan", label: "Jumlah Pelanggan (SR)" },
];

export default function DataTarifPage() {
  const [data, setData] = useState<Tarif[]>(initialData);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deletingTarif, setDeletingTarif] = useState<Tarif | null>(null);
  const [editing, setEditing] = useState<Tarif | null>(null);
  const [form, setForm] = useState({ id_tarif: "", nama_tarif: "" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = data.filter(
    (t) =>
      t.id_tarif.toLowerCase().includes(search.toLowerCase()) ||
      t.nama_tarif.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPelanggan = data.reduce((a, b) => a + b.jumlahPelanggan, 0);

  const openAdd = () => {
    setEditing(null);
    setForm({ id_tarif: "", nama_tarif: "" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (t: Tarif) => {
    setEditing(t);
    setForm({ id_tarif: t.id_tarif, nama_tarif: t.nama_tarif });
    setError("");
    setModalOpen(true);
  };

  const handleSave = () => {
    const id = form.id_tarif.trim().toUpperCase();
    const nama = form.nama_tarif.trim();
    if (!id || !nama) return setError("Kode dan nama golongan tarif wajib diisi.");
    if (id.length > 20) return setError("Kode tarif maksimal 20 karakter.");
    if (nama.length > 100) return setError("Nama tarif maksimal 100 karakter.");
    if (!editing && data.some((t) => t.id_tarif === id))
      return setError("Kode tarif sudah digunakan.");

    if (editing) {
      setData((d) =>
        d.map((t) =>
          t.id_tarif === editing.id_tarif
            ? { ...t, id_tarif: id, nama_tarif: nama }
            : t
        )
      );
    } else {
      setData((d) => [...d, { id_tarif: id, nama_tarif: nama, jumlahPelanggan: 0 }]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deletingTarif) return;
    setData((d) => d.filter((x) => x.id_tarif !== deletingTarif.id_tarif));
    setDeletingTarif(null);
  };

  const handleExport = ({
    scope,
    selectedCols,
  }: {
    scope: "filtered" | "all";
    selectedCols: string[];
  }) => {
    const target = scope === "filtered" ? filtered : data;
    const header = selectedCols
      .map((c) => EXPORT_COLUMNS.find((col) => col.id === c)?.label || c)
      .join(",");

    const rows = target.map((item) => {
      return selectedCols
        .map((col) => {
          const val = String((item as any)[col] ?? "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-tarif-pam-tirta-kamuning-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Manajemen Golongan Tarif"
        subtitle="Kelola master golongan tipe tarif air (`tipe_tarif`) untuk klasifikasi pelanggan di 9 unit cabang PAM Tirta Kamuning."
        badge="Master Data PAM Tirta Kamuning"
        badgeVariant="primary"
      >
        <button
          onClick={() => setExportModalOpen(true)}
          className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        >
          <Download className="w-3.5 h-3.5" />
          Ekspor Tarif
        </button>
        <button
          onClick={openAdd}
          className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Tarif
        </button>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Golongan Tarif"
          value={data.length}
          subtext="Golongan aktif terdaftar di sistem"
          icon={<Tags className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Total Sambungan Pelanggan"
          value={totalPelanggan.toLocaleString("id-ID")}
          subtext="Akumulasi sambungan rumah aktif"
          icon={<Users className="w-5 h-5" />}
          variant="navy"
        />
        <StatCard
          title="Unit Terlayani"
          value="9 Cabang"
          subtext="Kuningan, Cilimus, Cigugur, dll."
          icon={<Layers className="w-5 h-5" />}
          variant="slate"
        />
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Cari kode (misal: R1, N1) atau nama golongan tarif..."
          className="w-full sm:max-w-md"
        />

        {search && (
          <button
            onClick={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            className="text-xs text-slate-500 hover:text-pdam-primary underline shrink-0"
          >
            Hapus Pencarian
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Kode Tarif</th>
                <th className="py-3 px-4">Nama & Klasifikasi Golongan</th>
                <th className="py-3 px-4 text-right">Sambungan (SR)</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginated.map((item) => (
                <tr key={item.id_tarif} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-pdam-primary">
                    <span className="bg-pdam-primary/10 border border-pdam-primary/20 px-2 py-0.5 rounded text-xs">
                      {item.id_tarif}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {item.nama_tarif}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-pdam-navy tabular-nums">
                    {item.jumlahPelanggan.toLocaleString("id-ID")}{" "}
                    <span className="font-normal text-slate-400 text-[11px]">SR</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="btn btn-xs btn-ghost text-slate-600 hover:text-pdam-primary hover:bg-pdam-primary/10"
                        title="Edit Tarif"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingTarif(item)}
                        disabled={item.jumlahPelanggan > 0}
                        className="btn btn-xs btn-ghost text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none"
                        title={
                          item.jumlahPelanggan > 0
                            ? "Tarif masih memiliki pelanggan terdaftar"
                            : "Hapus Tarif"
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    Tidak ditemukan golongan tarif yang sesuai kata kunci.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            startIndex={(currentPage - 1) * itemsPerPage}
            endIndex={Math.min(currentPage * itemsPerPage, filtered.length)}
          />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <BaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Ubah Golongan Tarif" : "Tambah Golongan Tarif Baru"}
        subtitle="Data akan tersinkronisasi dengan tabel master `tipe_tarif`."
        icon={<Tags className="w-5 h-5 text-pdam-primary" />}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Kode Tarif (id_tarif) *
            </label>
            <input
              type="text"
              value={form.id_tarif}
              onChange={(e) => setForm({ ...form, id_tarif: e.target.value })}
              placeholder="Contoh: R1, N1, IND"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Maksimal 20 karakter alfanumerik.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nama & Keterangan Golongan (nama_tarif) *
            </label>
            <input
              type="text"
              value={form.nama_tarif}
              onChange={(e) => setForm({ ...form, nama_tarif: e.target.value })}
              placeholder="Contoh: Gol. 2A - Rumah Tangga Sederhana"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Maksimal 100 karakter deskripsi peruntukan air.
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none shadow-xs"
            >
              Simpan
            </button>
          </div>
        </div>
      </BaseModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTarif}
        onClose={() => setDeletingTarif(null)}
        onConfirm={confirmDelete}
        itemName={deletingTarif?.nama_tarif || ""}
        itemType="golongan tarif"
        warningText="Tarif hanya dapat dihapus apabila tidak memiliki pelanggan yang terdaftar padanya."
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        columns={EXPORT_COLUMNS}
        totalFiltered={filtered.length}
        totalAll={data.length}
        onExport={handleExport}
      />
    </div>
  );
}
