"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  Tags,
  Users,
  Layers,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import {
  PageHeader,
  StatCard,
  SearchInput,
  BaseModal,
  DeleteConfirmModal,
  ExportModal,
  Pagination,
} from "@/components/ui";

import {
  TarifWithJumlahPelanggan,
  TipeTarifPayload,
  tipeTarifService,
} from "@/services/tipeTarifService";

type Tarif = TarifWithJumlahPelanggan;

interface TarifForm {
  kode_tarif: string;
  nama_tarif: string;
}

const initialForm: TarifForm = {
  kode_tarif: "",
  nama_tarif: "",
};

const ITEMS_PER_PAGE = 6;

export default function DataTarifPage() {
  const [data, setData] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [editing, setEditing] = useState<Tarif | null>(null);
  const [deletingTarif, setDeletingTarif] = useState<Tarif | null>(null);
  const [form, setForm] = useState<TarifForm>(initialForm);
  const [formError, setFormError] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mengambil seluruh data tarif dari backend.
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await tipeTarifService.findAll();
      setData(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data golongan tarif.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Pencarian berdasarkan kode, UUID, dan nama tarif.
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return data;

    return data.filter(
      (item) =>
        item.id_tarif.toLowerCase().includes(keyword) ||
        item.kode_tarif.toLowerCase().includes(keyword) ||
        item.nama_tarif.toLowerCase().includes(keyword),
    );
  }, [data, search]);

  // Pagination.
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  // Statistik.
  const totalPelanggan = data.reduce(
    (total, item) => total + item.jumlahPelanggan,
    0,
  );

  const totalTarifDigunakan = data.filter(
    (item) => item.jumlahPelanggan > 0,
  ).length;

  // Membuka modal tambah.
  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setFormError("");
    setModalOpen(true);
  };

  // Membuka modal edit.
  const openEdit = (tarif: Tarif) => {
    setEditing(tarif);

    setForm({
      kode_tarif: tarif.kode_tarif,
      nama_tarif: tarif.nama_tarif,
    });

    setFormError("");
    setModalOpen(true);
  };

  // Validasi dan simpan data.
  const handleSave = async () => {
    const kode = form.kode_tarif.trim().toUpperCase();
    const nama = form.nama_tarif.trim();

    if (!kode || !nama) {
      setFormError("Kode dan nama golongan tarif wajib diisi.");
      return;
    }

    if (kode.length > 20) {
      setFormError("Kode tarif maksimal 20 karakter.");
      return;
    }

    if (nama.length > 100) {
      setFormError("Nama golongan tarif maksimal 100 karakter.");
      return;
    }

    // Pemeriksaan duplikasi lokal untuk memberi umpan balik lebih cepat.
    // Backend tetap menjadi pemeriksaan utama.
    const duplicateCode = data.some(
      (item) =>
        item.kode_tarif.toLowerCase() === kode.toLowerCase() &&
        item.id_tarif !== editing?.id_tarif,
    );

    if (duplicateCode) {
      setFormError("Kode tarif sudah digunakan.");
      return;
    }

    const duplicateName = data.some(
      (item) =>
        item.nama_tarif.toLowerCase() === nama.toLowerCase() &&
        item.id_tarif !== editing?.id_tarif,
    );

    if (duplicateName) {
      setFormError("Nama golongan tarif sudah digunakan.");
      return;
    }

    const payload: TipeTarifPayload = {
      kode_tarif: kode,
      nama_tarif: nama,
    };

    setSaving(true);
    setFormError("");

    try {
      if (editing) {
        await tipeTarifService.update(editing.id_tarif, payload);
      } else {
        await tipeTarifService.create(payload);
      }

      await loadData();

      setCurrentPage(1);
      setModalOpen(false);
      setEditing(null);
      setForm(initialForm);
      setFormError("");
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data golongan tarif.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Membuka modal hapus.
  const openDelete = (tarif: Tarif) => {
    setDeletingTarif(tarif);
    setDeleteModalOpen(true);
  };

  // Menghapus data berdasarkan UUID.
  const confirmDelete = async () => {
    if (!deletingTarif || deleting) return;

    const targetId = deletingTarif.id_tarif;

    setDeleting(true);
    setError("");

    try {
      await tipeTarifService.delete(targetId);

      setData((current) =>
        current.filter((item) => item.id_tarif !== targetId),
      );

      setDeleteModalOpen(false);
      setDeletingTarif(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus data golongan tarif.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Ekspor CSV.
  const exportCSV = ({
    scope,
    selectedCols,
  }: {
    scope: "filtered" | "all";
    selectedCols: string[];
  }) => {
    const sourceData = scope === "filtered" ? filtered : data;

    const columnLabels: Record<string, string> = {
      kode_tarif: "Kode Tarif",
      id_tarif: "ID Tarif",
      nama_tarif: "Nama Golongan Tarif",
      jumlahPelanggan: "Jumlah Pelanggan",
    };

    const escapeCSV = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const headers = selectedCols.map((id) => columnLabels[id] ?? id);

    const rows = sourceData.map((item) =>
      selectedCols.map((id) => String(item[id as keyof Tarif] ?? "")),
    );

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "data-golongan-tarif.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    setExportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Golongan Tarif"
        subtitle="Kelola master data tipe tarif pelanggan PDAM."
        badge="Master Data"
        badgeVariant="primary"
      >
        <button
          type="button"
          onClick={() => setExportModalOpen(true)}
          disabled={data.length === 0}
          className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Ekspor CSV
        </button>

        <button
          type="button"
          onClick={openAdd}
          className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Tarif
        </button>
      </PageHeader>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />

          <div className="flex-1">{error}</div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="font-medium underline disabled:opacity-50"
          >
            Muat ulang
          </button>
        </div>
      )}

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Total Golongan Tarif"
          value={loading ? "..." : data.length}
          subtext="Jumlah golongan terdaftar"
          icon={<Tags size={22} />}
          variant="primary"
        />

        <StatCard
          title="Total Pelanggan"
          value={loading ? "..." : totalPelanggan.toLocaleString("id-ID")}
          subtext="Jumlah pelanggan terdata"
          icon={<Users size={22} />}
          variant="primary"
        />

        <StatCard
          title="Golongan Digunakan"
          value={loading ? "..." : totalTarifDigunakan}
          subtext="Golongan yang memiliki pelanggan"
          icon={<Layers size={22} />}
          variant="primary"
        />
      </div>

      {/* Pencarian */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={(value: string) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            placeholder="Cari kode atau nama tarif..."
            className="w-full"
          />
        </div>

        <div className="text-xs text-slate-500">
          Menampilkan{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          golongan tarif
        </div>
      </div>

      {/* Tabel */}
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
                      <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 font-mono font-bold text-pdam-primary">
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
                          onClick={() => openEdit(item)}
                          title="Edit tarif"
                          aria-label={`Edit tarif ${item.nama_tarif}`}
                          className="btn btn-xs btn-ghost text-slate-600 hover:bg-pdam-primary/10 hover:text-pdam-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openDelete(item)}
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

        {!loading && filtered.length > 0 && (
          <div className="border-t border-slate-100 p-3">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              onPageChange={setCurrentPage}
              startIndex={(safePage - 1) * ITEMS_PER_PAGE + 1}
              endIndex={Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}
            />
          </div>
        )}
      </div>

      {/* Modal tambah dan edit */}
      <BaseModal
        isOpen={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setFormError("");
          }
        }}
        title={
          editing ? "Ubah Data Golongan Tarif" : "Tambah Golongan Tarif Baru"
        }
        subtitle="Data akan disimpan pada master golongan tarif."
        icon={<Tags className="h-5 w-5 text-pdam-primary" />}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Kode Tarif
            </label>

            <input
              type="text"
              value={form.kode_tarif}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  kode_tarif: event.target.value.toUpperCase(),
                }))
              }
              maxLength={20}
              placeholder="Contoh: KU"
              disabled={saving}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
            />

            <span className="mt-1 block text-[10px] text-slate-400">
              Masukkan kode unik untuk golongan tarif.
            </span>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Nama Golongan Tarif
            </label>

            <input
              type="text"
              value={form.nama_tarif}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  nama_tarif: event.target.value,
                }))
              }
              maxLength={100}
              placeholder="Contoh: KERAN UMUM"
              disabled={saving}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
            />

            <span className="mt-1 block text-[10px] text-slate-400">
              Masukkan nama golongan tarif pelanggan.
            </span>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => {
                if (!saving) {
                  setModalOpen(false);
                  setFormError("");
                }
              }}
              disabled={saving}
              className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-primary/90 disabled:opacity-50"
            >
              {saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}

              {saving
                ? "Menyimpan..."
                : editing
                  ? "Simpan Perubahan"
                  : "Simpan"}
            </button>
          </div>
        </div>
      </BaseModal>

      {/* Modal konfirmasi hapus */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeletingTarif(null);
          }
        }}
        onConfirm={() => {
          void confirmDelete();
        }}
        title="Hapus Golongan Tarif"
        itemName={deletingTarif?.nama_tarif ?? ""}
        itemType="golongan tarif"
        warningText="Tindakan ini tidak dapat dibatalkan. Golongan tarif tidak dapat dihapus jika masih digunakan oleh pelanggan."
      />

      {/* Modal ekspor */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Ekspor Data Golongan Tarif"
        subtitle="Pilih cakupan data dan kolom yang ingin disertakan dalam file CSV."
        columns={[
          {
            id: "kode_tarif",
            label: "Kode Tarif",
            defaultChecked: true,
          },
          {
            id: "nama_tarif",
            label: "Nama Golongan Tarif",
            defaultChecked: true,
          },
          {
            id: "jumlahPelanggan",
            label: "Jumlah Pelanggan",
            defaultChecked: true,
          },
          {
            id: "id_tarif",
            label: "ID Tarif (UUID)",
            defaultChecked: false,
          },
        ]}
        totalFiltered={filtered.length}
        totalAll={data.length}
        onExport={exportCSV}
      />
    </div>
  );
}
