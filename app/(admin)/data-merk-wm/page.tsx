"use client";

import React, { useState } from "react";
import { Download, Plus, Pencil, Trash2, Gauge, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import {
  PageHeader,
  StatCard,
  SearchInput,
  BaseModal,
  DeleteConfirmModal,
  ExportModal,
  Pagination,
} from "@/components/ui";

interface MerkWM {
  id_merk: number;
  wm_kode: string;
  merk_wm: string;
  wm_digit: number;
  jumlahWM: number;
}

const initialData: MerkWM[] = [
  { id_merk: 1, wm_kode: "ITR", merk_wm: "Itron", wm_digit: 5, jumlahWM: 640 },
  { id_merk: 2, wm_kode: "LIN", merk_wm: "Linflow", wm_digit: 5, jumlahWM: 480 },
  { id_merk: 3, wm_kode: "OND", merk_wm: "Onda", wm_digit: 5, jumlahWM: 310 },
  { id_merk: 4, wm_kode: "ACT", merk_wm: "Actaris", wm_digit: 5, jumlahWM: 180 },
  { id_merk: 5, wm_kode: "NBG", merk_wm: "Ningbo", wm_digit: 4, jumlahWM: 120 },
  { id_merk: 6, wm_kode: "BRM", merk_wm: "Bar-Meters", wm_digit: 5, jumlahWM: 80 },
  { id_merk: 7, wm_kode: "SNS", merk_wm: "Sensus", wm_digit: 5, jumlahWM: 30 },
];

const EXPORT_COLUMNS = [
  { id: "wm_kode", label: "Kode Merk" },
  { id: "merk_wm", label: "Nama Merk" },
  { id: "wm_digit", label: "Jumlah Digit Stand" },
  { id: "jumlahWM", label: "Jumlah Populasi Aset (Unit)" },
];

export default function DataMerkWMPage() {
  const [data, setData] = useState<MerkWM[]>(initialData);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deletingMerk, setDeletingMerk] = useState<MerkWM | null>(null);
  const [editing, setEditing] = useState<MerkWM | null>(null);
  const [form, setForm] = useState({ wm_kode: "", merk_wm: "", wm_digit: "5" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = data.filter(
    (m) =>
      m.merk_wm.toLowerCase().includes(search.toLowerCase()) ||
      m.wm_kode.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalWM = data.reduce((a, b) => a + b.jumlahWM, 0);

  const openAdd = () => {
    setEditing(null);
    setForm({ wm_kode: "", merk_wm: "", wm_digit: "5" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (m: MerkWM) => {
    setEditing(m);
    setForm({ wm_kode: m.wm_kode, merk_wm: m.merk_wm, wm_digit: String(m.wm_digit) });
    setError("");
    setModalOpen(true);
  };

  const handleSave = () => {
    const kode = form.wm_kode.trim().toUpperCase();
    const nama = form.merk_wm.trim();
    const digit = Number(form.wm_digit);
    if (!kode) return setError("Kode merk (wm_kode) wajib diisi.");
    if (kode.length > 10) return setError("Kode merk maksimal 10 karakter.");
    if (!nama) return setError("Nama merk wajib diisi.");
    if (nama.length > 50) return setError("Nama merk maksimal 50 karakter.");
    if (!digit || digit < 3 || digit > 8)
      return setError("Jumlah digit harus antara 3 dan 8 digit.");
    if (!editing && data.some((m) => m.wm_kode === kode))
      return setError("Kode merk sudah digunakan.");

    if (editing) {
      setData((d) =>
        d.map((m) =>
          m.id_merk === editing.id_merk
            ? { ...m, wm_kode: kode, merk_wm: nama, wm_digit: digit }
            : m
        )
      );
    } else {
      setData((d) => [
        ...d,
        {
          id_merk: Date.now(),
          wm_kode: kode,
          merk_wm: nama,
          wm_digit: digit,
          jumlahWM: 0,
        },
      ]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deletingMerk) return;
    setData((d) => d.filter((x) => x.id_merk !== deletingMerk.id_merk));
    setDeletingMerk(null);
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
    a.download = `data-merk-wm-pam-tirta-kamuning-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Manajemen Merk Water Meter"
        subtitle="Kelola master data merk dan jumlah digit meteran air (`merk_wm`) untuk standar pembacaan meter di PAM Tirta Kamuning."
        badge="Master Data PAM Tirta Kamuning"
        badgeVariant="primary"
      >
        <button
          onClick={() => setExportModalOpen(true)}
          className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        >
          <Download className="w-3.5 h-3.5" />
          Ekspor CSV
        </button>
        <button
          onClick={openAdd}
          className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Merk
        </button>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Merk Terdaftar"
          value={data.length}
          subtext="Merk tervalidasi standar teknis"
          icon={<Gauge className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Total Populasi Unit WM"
          value={totalWM.toLocaleString("id-ID")}
          subtext="Seluruh aset meter di 9 cabang"
          icon={<Layers className="w-5 h-5" />}
          variant="navy"
        />
        <StatCard
          title="Standar Digit Mayoritas"
          value="5 Digit"
          subtext="93.5% populasi meter terpasang"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="emerald"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Cari nama merk atau kode (misal: ITR, LIN)..."
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
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Merk Water Meter</th>
                <th className="py-3 px-4 text-center">Digit Stand</th>
                <th className="py-3 px-4 text-right">Populasi Unit</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginated.map((item) => (
                <tr key={item.id_merk} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-pdam-primary">
                    <span className="bg-pdam-primary/10 border border-pdam-primary/20 px-2 py-0.5 rounded text-xs">
                      {item.wm_kode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {item.merk_wm}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      {item.wm_digit} digit
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-pdam-navy tabular-nums">
                    {item.jumlahWM.toLocaleString("id-ID")}{" "}
                    <span className="font-normal text-slate-400 text-[11px]">Unit</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="btn btn-xs btn-ghost text-slate-600 hover:text-pdam-primary hover:bg-pdam-primary/10"
                        title="Edit Merk"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingMerk(item)}
                        disabled={item.jumlahWM > 0}
                        className="btn btn-xs btn-ghost text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none"
                        title={
                          item.jumlahWM > 0
                            ? "Merk masih berelasi dengan aset water meter"
                            : "Hapus Merk"
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
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ada merk water meter yang sesuai kriteria pencarian.
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
        title={editing ? "Ubah Data Merk" : "Tambah Merk Water Meter Baru"}
        subtitle="Data akan tersimpan di tabel master `merk_wm`."
        icon={<Gauge className="w-5 h-5 text-pdam-primary" />}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Kode Merk (wm_kode) *
            </label>
            <input
              type="text"
              value={form.wm_kode}
              onChange={(e) => setForm({ ...form, wm_kode: e.target.value })}
              placeholder="Contoh: ITR, LIN, ACT"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Maksimal 10 karakter kode singkatan merk.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nama Merk (merk_wm) *
            </label>
            <input
              type="text"
              value={form.merk_wm}
              onChange={(e) => setForm({ ...form, merk_wm: e.target.value })}
              placeholder="Contoh: Itron, Onda, Linflow"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Maksimal 50 karakter nama pabrikan/merk.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Jumlah Digit Stand Meter (wm_digit) *
            </label>
            <select
              value={form.wm_digit}
              onChange={(e) => setForm({ ...form, wm_digit: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary"
            >
              {[4, 5, 6, 7, 8].map((d) => (
                <option key={d} value={d}>
                  {d} Digit
                </option>
              ))}
            </select>
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
        isOpen={!!deletingMerk}
        onClose={() => setDeletingMerk(null)}
        onConfirm={confirmDelete}
        itemName={deletingMerk?.merk_wm || ""}
        itemType="merk water meter"
        warningText="Merk tidak dapat dihapus jika masih ada unit water meter yang terhubung dengannya."
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
